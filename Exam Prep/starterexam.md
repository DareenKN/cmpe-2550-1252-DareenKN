YES.
We’re doing a **realistic mock lab exam** in your exact style.

Same structure.
Same `$output`.
Same `mySqlQuery`.
Same AJAX pattern.

No surprises.

---

# 🧪 CMPE2550 – MOCK LAB EXAM 02

### Topic: MySQL Data Retrieval (SELECT Only)

---

## 📄 Scenario

You are given a database with the following tables:

### departments

* dept_id (PK)
* dept_name
* location

### employees

* emp_id (PK)
* emp_name
* salary
* dept_id (FK)

---

## 🎯 Requirements

1. When the page loads, retrieve **all departments** ordered by dept_name.
2. Display them in a table.
3. Each row must have a **Retrieve** button.
4. When clicked, retrieve all employees for that department.
5. Display employees in a second table.
6. Show a message indicating how many records were retrieved.
7. Hide employee section if no employees found.

NO INSERT.
NO UPDATE.
NO DELETE.

---

---

# 📁 STARTER FILES

---

# 🟣 index.html (Starter)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Lab Exam 02</title>
    <script src="jquery.js"></script>
    <script src="script.js"></script>
</head>
<body>

<h2>Departments</h2>

<div id="status"></div>

<table border="1">
    <thead>
        <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
        </tr>
    </thead>
    <tbody id="departments-body"></tbody>
</table>

<hr>

<div class="data-section">

    <h2>Employees</h2>
    <div id="emp-status"></div>

    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody id="employees-body"></tbody>
    </table>

</div>

</body>
</html>
```

---

# 🟣 script.js (Starter)

You must complete the following:

```js
$(document).ready(function () {

    $('.data-section').hide();

    // TODO: Call function to retrieve all departments

});

function CallAJAX(url, method, data, dataType, successMethod, errorMethod) {
    $.ajax({
        url: url,
        method: method,
        data: data,
        dataType: dataType,
        success: successMethod,
        error: errorMethod
    });
}

// TODO: GetAllDepartments()

// TODO: GetAllDepartmentsSuccess()

// TODO: Event delegation for retrieve button

// TODO: GetEmployeesByDepartment()

// TODO: GetEmployeesByDepartmentSuccess()

function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);
}
```

---

# 🟣 service.php (Starter)

```php
<?php

require_once "db.php";

$output = array();

$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

$action = isset($clean_get["action"]) ? $clean_get["action"] :
    (isset($clean_post["action"]) ? $clean_post["action"] : "");

$output = ["message" => ""];

switch ($action) {

    case "":
        break;

    default:
        $output["error"] = "Invalid action specified";
        break;
}

echo json_encode($output);
die();
```

---

---

# 🧠 WHAT YOU WOULD NEED TO WRITE (MENTAL CHECK)

## In script.js you must:

* Write `GetAllDepartments()`
* Write `GetAllDepartmentsSuccess()`
* Add `$(document).on(...)`
* Write `GetEmployeesByDepartment()`
* Write `GetEmployeesByDepartmentSuccess()`

---

## In service.php you must:

Add switch cases:

```php
case "GetAllDepartments":
    GetAllDepartments();
    break;

case "GetEmployeesByDepartment":
    GetEmployeesByDepartment();
    break;
```

Then write two functions:

---

### GetAllDepartments()

```php
function GetAllDepartments()
{
    global $output;

    $query = "SELECT * FROM departments
              ORDER BY dept_name";

    if ($queryOutput = mySqlQuery($query)) {
        $output["departments"] = $queryOutput->fetch_all();
    } else {
        $output["error"] = "Failed to retrieve departments.";
        return;
    }

    switch (count($output["departments"])) {
        case 0:
            $output["message"] = "No departments found.";
            break;
        case 1:
            $output["message"] = "Retrieved: 1 department.";
            break;
        default:
            $output["message"] =
                "Retrieved: " . count($output["departments"]) . " departments.";
            break;
    }
}
```

---

### GetEmployeesByDepartment()

```php
function GetEmployeesByDepartment()
{
    global $output, $clean_get;

    if (!isset($clean_get["dept_id"])) {
        $output["error"] = "Missing department ID.";
        return;
    }

    $dept_id = $clean_get["dept_id"];

    $query = "
        SELECT emp_id, emp_name, salary
        FROM employees
        WHERE dept_id = '$dept_id'
    ";

    if ($queryOutput = mySqlQuery($query)) {
        $output["employees"] = $queryOutput->fetch_all();
    } else {
        $output["error"] = "Failed to retrieve employees.";
        return;
    }

    switch (count($output["employees"])) {
        case 0:
            $output["message"] = "No employees found.";
            break;
        case 1:
            $output["message"] = "Retrieved: 1 employee.";
            break;
        default:
            $output["message"] =
                "Retrieved: " . count($output["employees"]) . " employees.";
            break;
    }
}
```

---

# 🎯 Why This Is Realistic

This is EXACTLY how exam questions are structured:

* One main table
* One related table
* One foreign key
* One join or WHERE
* One message count
* One hide/show section

No trickery.
Just structure.

---

# 🧘🏽‍♀️ Final Thought

Look at this mock exam.

It’s ICA 03.
But renamed.

That’s all.

You are not learning something new.
You are renaming tables.

If you want, I can now:

* 🔥 Make you solve it timed
* 🔥 Or give you a harder version with JOIN + COUNT
* 🔥 Or give you a trick question version

Your choice, Miss Future 4.0 GPA.
