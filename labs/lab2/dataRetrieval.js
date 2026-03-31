/**
 * CMPE2550 – LAB 02 – Authentication/Authorization
 * Name: Dareen Kinga Njatou
 * dataRetrieval.js
 * Description: JavaScript file to retrieve authors and their books from MySQL database via AJAX
 * Date: February 05, 2026
 */

$(document).ready(function () {
  $("#addUser").click(AddUser);
  GetAllUsers();
  GetAllRoles();
});


/**
 * FunctionName:    GetAllAuthors
 * Description:     Retrieves all authors from the database via AJAX call
 */
function GetAllUsers() {
  CallAJAX("service.php", "get", "json",
    { action: "GetAllUsers" },
    GetAllUsersSuccess, ErrorMethod);
}

function GetAllUsersSuccess(data) {
  console.log(data);
  $('#status').html(data.message);
  let tbody = $('.users-table tbody');
  tbody.empty();

  if (hasError(data)) return;
  data.users.forEach(user => {
    options = "";
    data.roles.forEach(role => {
      let selected = role[0] === user.role_name ? "selected" : "";
      options += `<option value="${role[0]}" ${selected}>${role[0]}</option>`;
    });

    let row = `<tr>
                <td><button class="btn btn-delete" data-user="${user.user_id}" onclick="DeleteUser(${user.user_id})">Delete</button></td>

                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.password_hash}</td>

                <td><select class="role-select" data-user="${user.user_id}">${options}</select></td>                
                <td><button class="btn btn-change-role" data-user="${user.user_id} " onclick="ChangeUserRole(${user.user_id})">Change Role</button></td>
              </tr>`;
    tbody.append(row);
    $("#status").html(data.message);
  });
}

function DeleteUser(userId) {
  // if (!confirm("Are you sure you want to delete this user?")) return;
  let userRole = $(`.role-select[data-user="${userId}"]`).val();
  console.log("Deleting user:", userId, userRole);
  CallAJAX("service.php", "post", "json",
    { action: "DeleteUser", user_id: userId, user_role: userRole },
    function (data) {
      console.log(data);
      if (hasError(data)) return;
      $('#status').html(data.message);
      GetAllUsers();
    }, ErrorMethod);
}

function AddUser() {
  const username = $('#username').val();
  const password = $('#password').val();
  const role = $('#role').val();

  console.log("Adding user:", username, role);

  CallAJAX("service.php", "post", "json",
    { action: "AddUser", username: username, password: password, user_role: role },
    function (data) {
      console.log(data);
      if (data.error) {
        $('#form-status').html(data.error);
        return;
      }
      $('#form-status').html(data.message);
      GetAllUsers();
    }, ErrorMethod);
}

function ChangeUserRole(userId) {
  const newRole = $(`.role-select[data-user="${userId}"]`).val();
  console.log("Changing role for user:", userId, "to", newRole);

  CallAJAX("service.php", "post", "json",
    { action: "ChangeUserRole", user_id: userId, new_role: newRole },
    function (data) {
      console.log(data);
      if (hasError(data)) return;
      $('#status').html(data.message);
      GetAllUsers();
    }, ErrorMethod);
}

function GetAllRoles() {
  CallAJAX("service.php", "get", "json",
    { action: "GetAllRoles" },
    GetAllRolesSuccess, ErrorMethod);
}

function GetAllRolesSuccess(data) {
  console.log(data);
  $('#status').html(data.message);
  let tbody = $('.roles-table tbody');
  tbody.empty();

  if (hasError(data)) return;
  data.roleInfo.forEach(role => {
    options = "";
    // data.roles.forEach(role => {
    //   let selected = role[0] === user.role_name ? "selected" : "";
    //   options += `<option value="${role[0]}" ${selected}>${role[0]}</option>`;
    // });

    let row = `<tr>
                <td><button class="btn btn-delete" data-role="${role.role_id}" onclick="DeleteRole(${role.role_id})">Delete</button></td>

                <td>${role.role_id}</td>
                <td>${role.role_name}</td>
                <td>${role.description}</td>

                <td><select class="role-select" data-role="${role.role_rank}">${options}</select></td>                
                // <td><button class="btn btn-change-role" data-user="${role.user_id} " onclick="ChangeUserRole(${role.user_id})">Change Role</button></td>
              </tr>`;
    tbody.append(row);
    $("#status").html(data.message);
  });
}



// Event delegation for dynamically created buttons
//$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);

/** 
*FunctionName:    CallAJAX
*Description:     Generic AJAX call function 
*/
function CallAJAX(url, method, dataType, data, successMethod, errorMethod) {
  $.ajax({ url: url, method: method, dataType: dataType, data: data, success: successMethod, error: errorMethod });
}

/**
 * FunctionName:    hasError
 * Description:     Checks if returned data contains an error
 * Inputs:          data - Data returned from AJAX call
 * Outputs:         true if error exists, false otherwise
 */
function hasError(data) {
  if (data.error) {
    $('#status').html(data.error);
    return true;
  }
  return false;
}

/**
 * FunctionName:    ErrorMethod
 * Description:     Generic error method for AJAX calls
 */
function ErrorMethod(req, status, error) {
  console.log("AJAX ERROR", status, error);
  console.log(req);

  $('#status').html(`An error occurred.`);
}
