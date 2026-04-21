<?php
/* CMPE2550 - Web Applications
 * Name: Dareen Kinga Njatou
 * ICA3 - MySQL Data Retrieval 
 * service.php
 * Description: Backend service to retrieve authors and their Titles from MySQL database
 * Date: January 20, 2026 */

// Include database functions
require_once "db.php";
require_once "functions.php";

function CleanCollection($input)
{
  global $connection;
  $clean = array();

  foreach ($input as $key => $value) {
    if (is_array($value)) {
      $clean[trim($connection->real_escape_string(strip_tags(htmlspecialchars($key))))]
        = CleanCollection($value);
    } else {
      $clean[trim($connection->real_escape_string(strip_tags(htmlspecialchars($key))))]
        = trim($connection->real_escape_string(strip_tags(htmlspecialchars($value))));
    }
  }

  return $clean;
}

// Global output array
$output = array();

// Cleaning data
$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

// Determine action from GET or POST parameters
$action = isset($clean_get["action"]) ? $clean_get["action"] :
  (isset($clean_post["action"]) ? $clean_post["action"] : "");

// Default message
$output = ["message" => ""];

// Handle actions
switch ($action) {

  case "GetAllUsers":
    GetAllUsers();
    break;

  case "AddUser":
    AddUser();
    break;

  case "AddRole":
    AddRole();
    break;
  
  case "DeleteRole":
    DeleteRole();
    break;

  case "DeleteUser":
    DeleteUser();
    break;

  case "ChangeRole":
    ChangeRole();
    break;

  case "ChangeUserRole":
    ChangeUserRole();
    break;

  case "GetAllRoles":
    GetAllRoles();
    break;

  default:
    $output["error"] = "Invalid action specified";
    break;
}

// Return output as JSON
error_log("Output: " . print_r($output, true));
echo (json_encode($output));
die();

function GetAllUsers()
{
  global $output;
  $query = "SELECT u.user_id, u.username, u.password_hash, r.role_name
            FROM users u
              JOIN user_roles ur ON u.user_id = ur.user_id
              JOIN roles r ON ur.role_id = r.role_id";
  $result = mySqlQuery($query);
  $count = 0;
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $count++;
      $output["users"][] = [
        "user_id" => $row["user_id"],
        "username" => $row["username"],
        "password_hash" => $row["password_hash"],
        "role_name" => $row["role_name"]
      ];
    }
    $output["message"] = "Retrieved $count user records";
    GetRolesName();
  }
}

function GetRolesName()
{
  global $output;
  $query_roles = "SELECT DISTINCT role_name FROM roles";
  if ($roles = mySqlQuery($query_roles)) {
    $output["roles"] = $roles->fetch_all();
  } else
    $output["error"] = "Error retrieving roles";
}

function AddUser()
{
  session_start();
  global $output, $clean_post;

  $username = $clean_post["username"] ?? "";
  $password = $clean_post["password"] ?? "";
  $role = $clean_post["user_role"] ?? "";

  if (empty($username)) {
    $output["error"] = "Username is required";
    return;
  }
  if (empty($password)) {
    if (userCheck($username)) {
      $output["error"] = "Username already exists";
    } else {
      $output["error"] = "Password is required";
    }
    return;
  }
  if (empty($role)) {
    $output["error"] = "Role is required";
    return;
  }

  if (!userCheck($username)) {
    $secret = password_hash($password, PASSWORD_DEFAULT);
    error_log("Encoded : $secret");

    // Get current user's rank for authorization check
    $current_rank = $_SESSION["rank"] ?? 999; // default to lowest rank
    $query = "SELECT role_rank FROM roles WHERE role_name='$role'";
    $target_rank = mySqlQuery($query)->fetch_assoc()["role_rank"] ?? 999; // default to lowest rank if not found

    if ($target_rank < $current_rank) {
      $output["error"] = "Unauthorized: Cannot assign a role higher than your own rank";
      return;
    }

    if ($target_rank === $current_rank) {
      $output["error"] = "Unauthorized: Cannot assign a role equal to your own rank";
      return;
    }

    $query = "INSERT INTO users (username, password_hash) VALUES ('$username', '$secret')";
    if (mySQLNonQuery($query) < 1) {
      $output["error"] = "Error registering user";
    } else {
      $userQuery = mySqlQuery("SELECT user_id FROM users WHERE username='$username'");
      $roleQuery = mySqlQuery("SELECT role_id FROM roles WHERE role_name='$role'");

      $user_id = null;
      $role_id = null;
      if ($userQuery && $roleQuery) {
        $user_id = $userQuery->fetch_row()[0];
        $role_id = $roleQuery->fetch_row()[0];
      }
      if ($user_id == null || $role_id == null) {
        $output["error"] = "Error registering user";
      }

      $query = "SELECT 1 FROM user_roles WHERE 
                      user_id = '$user_id' AND role_id = '$role_id'";
      $result = mySqlQuery($query);
      if ($result && $result->num_rows < 1) {
        mySQLNonQuery("INSERT INTO user_roles (user_id, role_id) 
                VALUES ('$user_id', '$role_id')");
      }
      $output["message"] = "User registered successfully";
    }
  } else {
    $output["error"] = "User already exists";
  }
}

function AddRole()
{
  global $output, $clean_post;

  $role_name = $clean_post["rolename"] ?? "";
  $description = $clean_post["desc"] ?? "";
  $role_rank = $clean_post["rolerank"] ?? "";

  if (empty($role_name)) {
    $output["error"] = "Role name is required";
    return;
  }
  if (empty($description)) {
    $output["error"] = "Role description is required";
    return;
  }
  if (empty($role_rank)) {
    $output["error"] = "Role rank is required";
    return;
  }

  $query = "INSERT INTO roles (role_name, description, role_rank) 
            VALUES ('$role_name', '$description', '$role_rank')";
  if (mySQLNonQuery($query) < 1) {
    $output["error"] = "Error adding role";
  } else {
    $output["message"] = "Role added successfully";
  }
}

function DeleteRole()
{
  global $output, $clean_post;

  // Verify that the role doesn't have any users assigned before deletion
  $query = "SELECT 1 FROM user_roles WHERE role_id = '{$clean_post["role_id"]}'";
  $result = mySqlQuery($query);
  if ($result && $result->num_rows > 0) {
    $output["error"] = "Cannot delete role: Users are assigned to this role";
    return;
  }
  $query = "DELETE FROM roles WHERE role_id = '{$clean_post["role_id"]}'";
  if (mySQLNonQuery($query) < 1) {
    $output["error"] = "Error deleting role";
  } else {
    $output["message"] = "Role deleted successfully";
  } 
}

function DeleteUser()
{
  global $output, $clean_post;

  if (!isset($clean_post["user_id"]) || !isset($clean_post["user_role"])) {
    $output["error"] = "User ID and role are required for deletion";
    return;
  }

  $user_id = $clean_post["user_id"];
  $role = $clean_post["user_role"];

  if (empty($user_id)) {
    $output["error"] = "User ID is required for deletion";
    return;
  }

  if (empty($role)) {
    $output["error"] = "Role is required for deletion";
    return;
  }


  $query1 = "DELETE FROM user_roles where user_id = '$user_id' and role_id = (SELECT role_id FROM roles WHERE role_name='$role')";
  $query2 = "DELETE FROM users WHERE user_id = '$user_id'";
  $result1 = -1;


  if ($result1 = mysqlNonQuery($query1) >= 0) {
    error_log("$result1 record(s) deleted from user_roles");
    $output["message"] = "$result1 user role(s) deleted successfully";

    $result2 = -1;
    if ($result2 = mysqlNonQuery($query2) >= 0) {
      error_log("$result2 record(s) deleted from users");
      $output["message"] .= " and $result2 user(s) deleted successfully";
    } else {
      error_log("Was not able to delete user from users table!");
      $output["error"] = "Was not able to delete user from users table!";
    }
  } else {
    error_log("Was not able to delete user role from user_roles table!");
    $output["error"] = "Was not able to delete in user_roles table!";
  }
}

function ChangeUserRole()
{
  session_start();
  $current_rank = $_SESSION["rank"] ?? 999; // default to lowest rank if not set
  global $output, $clean_post;

  if (!isset($clean_post["user_id"]) || !isset($clean_post["new_role"])) {
    $output["error"] = "User ID and new role are required for role change";
    return;
  }

  $user_id = (int) $clean_post["user_id"];
  $new_role = $clean_post["new_role"];

  if (empty($new_role)) {
    $output["error"] = "New role is required for role change";
    return;
  }

  $query = "SELECT role_rank FROM roles WHERE role_name='$new_role'";
  $target_rank = mySqlQuery($query)->fetch_assoc()["role_rank"] ?? 999; // default to lowest rank if not found

  // If the older role is same less than current user rank, don't allow the change to prevent privilege escalation by changing to a higher role and then changing other users' roles
  if (isset($clean_post["older_role"])) {
    $older_role = $clean_post["older_role"];
    $query = "SELECT role_rank FROM roles WHERE role_name='$older_role'";
    $older_role_rank = mySqlQuery($query)->fetch_assoc()["role_rank"] ?? 999; // default to lowest rank if not found

    if ($older_role_rank < $current_rank) {
      $output["error"] = "Unauthorized: Cannot change role of a user with a role higher than your own rank";
      return;
    }
  }

  if ($target_rank < $current_rank) {
    $output["error"] = "Unauthorized: Cannot assign a role higher than your own rank";
    return;
  }

  if ($target_rank === $current_rank) {
    $output["error"] = "Unauthorized: Cannot assign a role equal to your own rank";
    return;
  }

  $query = "UPDATE user_roles SET role_id = (SELECT role_id FROM roles WHERE role_name='$new_role') 
            WHERE user_id = '$user_id'";
  $result = mySQLNonQuery($query);
  if ($result >= 0) {
    $output["message"] = "User role updated successfully";
  } else {
    error_log("Error updating user role: " . $result . "");
    $output["error"] = "Failed to update user role";
  }
}

function ChangeRole()
{
  session_start();
  $current_rank = $_SESSION["rank"] ?? 999; // default to lowest rank if not set
  global $output, $clean_post;

  if (!isset($clean_post["role_id"])) {
    $output["error"] = "Role ID is required for role rank change";
    return;
  }

  if (!isset($clean_post["new_rank"]) || $clean_post["new_rank"] != "") {
    $output["error"] = "New rank is required for role rank change";
    return;
  }



  $role_id = (int) $clean_post["role_id"];
  $new_rank = (int) $clean_post["new_rank"];

  if ($new_rank < $current_rank) {
    $output["error"] = "Unauthorized: Cannot assign a role rank higher than your own rank";
    return;
  }

  if ($new_rank == $current_rank) {
    $output["error"] = "Unauthorized: Cannot assign a role rank equal to your own rank";
    return;
  }

  $query = "UPDATE roles SET role_rank = '$new_rank' WHERE role_id = '$role_id'";
  $result = mySQLNonQuery($query);
  if ($result >= 0) {
    $output["message"] = "Role rank updated successfully" . " New rank: $new_rank" . "curent rank: $current_rank";
  } else {
    error_log("Error updating role rank: " . $result . "");
    $output["error"] = "Failed to update role rank";
  }
}

function GetAllRoles()
{
  global $output;
  $query = "SELECT * FROM roles";
  $result = mySqlQuery($query);
  $count = 0;
  if ($result) {
    while ($row = $result->fetch_assoc()) {
      $count++;
      $output["roleInfo"][] = [
        "role_id" => $row["role_id"],
        "role_name" => $row["role_name"],
        "description" => $row["description"],
        "role_rank" => $row["role_rank"]
      ];
    }

    // populate the list of roles for dropdowns
    $result->data_seek(0); // reset result pointer to beginning
      while ($row = $result->fetch_row()) {
        $output["roles"][] = $row;
      }

    $output["message"] = "Retrieved $count roles records";
  }
}