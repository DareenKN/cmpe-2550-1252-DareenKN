<?php
function userCheck($user)
{
    $exists = mySqlQuery(("SELECT 1 FROM users WHERE username='$user'"));
    return ($exists && $exists->num_rows > 0);
}

function RegisterCheck($user, $pass)
{
    global $status;
    $success = false;

    if (!userCheck($user)) {
        $secret = password_hash($pass, PASSWORD_DEFAULT);
        error_log("Encoded : $secret");

        $query = "INSERT INTO users (username, password_hash) VALUES ('$user', '$secret')";
        if (mySQLNonQuery($query) < 1) {
            $status = "Error registering user";
            $success = false;
        } else {
            $userQuery = mySqlQuery("SELECT user_id FROM users WHERE username='$user'");
            $roleQuery = mySqlQuery("SELECT role_id FROM roles WHERE role_name='Member'");

            $user_id = null;
            $role_id = null;
            if ($userQuery && $roleQuery) {
                $user_id = $userQuery->fetch_row()[0];
                $role_id = $roleQuery->fetch_row()[0];
            }
            if ($user_id == null || $role_id == null) {
                $status = "Error registering user";
                error_log($status);
                return false;
            }

            $query = "SELECT 1 FROM user_roles WHERE 
                      user_id = '$user_id' AND role_id = '$role_id'";
            $result = mySqlQuery($query);
            if ($result && $result->num_rows < 1) {
                mySQLNonQuery("INSERT INTO user_roles (user_id, role_id) 
                VALUES ('$user_id', '$role_id')");
            }
            $status = "User registered successfully";
            error_log($status);
            $success = true;
        }
    } else {
        $status = "User already exists";
        error_log($status);
        $success = false;
    }
    return $success;
}

function LoginCheck($user, $pass)
{
    global $status;

    $query_pass = mySqlQuery("SELECT password_hash FROM users WHERE username='$user'");

    if ($query_pass && $query_pass->num_rows > 0) {
        $row = $query_pass->fetch_assoc();
        error_log(print_r($row, true));

        $hash = $row['password_hash'];

        if (password_verify($pass, $hash)) {
            $status = "Login success";
            error_log($status);
            return true;
        }
    }
    $status = "Login failed";
    error_log($status);
    return false;
}
?>