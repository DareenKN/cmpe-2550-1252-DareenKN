OKAY. GOOD.
This is what I needed.

We are **NOT changing your pattern**.
We are using:

* ✅ `$output`
* ✅ `global $output`
* ✅ `CleanCollection`
* ✅ `mySqlQuery`
* ✅ `fetch_all()`
* ✅ switch($action)
* ✅ echo json_encode($output)

We are staying inside **YOUR brain architecture**.

---

# 🚨 LAB EXAM 02 – YOUR EXACT PATTERN (RETRIEVAL ONLY)

Since exam says:

> Up to database retrieval (NO insert / update / delete)

You only need:

* GetAllSomething
* GetSomethingByID
* Possibly GetTypes / GetNames

That’s it.

---

# 🧠 1️⃣ TOP OF service.php (YOUR STYLE)

You ALWAYS write this:

```php
require_once "db.php";

$output = array();

$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

$action = isset($clean_get["action"]) ? $clean_get["action"] :
  (isset($clean_post["action"]) ? $clean_post["action"] : "");

$output = ["message" => ""];
```

DO NOT change this. This is muscle memory.

---

# 🧠 2️⃣ SWITCH BLOCK (ONLY RETRIEVAL)

In exam it will look like:

```php
switch ($action) {

  case "GetAllAuthors":
    GetAllAuthors();
    break;

  case "GetTitlesByAuthor":
    GetTitlesByAuthor();
    break;

  default:
    $output["error"] = "Invalid action specified";
    break;
}
```

That’s it.

No delete. No update. No stress.

---

# 🧠 3️⃣ BASIC RETRIEVAL FUNCTION (YOUR STYLE)

### 🔹 GetAllAuthors()

```php
function GetAllAuthors()
{
  global $output;

  $query = "SELECT * FROM authors
            ORDER BY au_lname";

  if ($queryOutput = mySqlQuery($query)) {

    $output["authors"] = $queryOutput->fetch_all();

  } else {
    $output["error"] = "Something went wrong retrieving authors!";
    return;
  }

  switch (count($output["authors"])) {
    case 0:
      $output["message"] = "No author records found.";
      break;
    case 1:
      $output["message"] = "Retrieved: 1 author record.";
      break;
    default:
      $output["message"] =
        "Retrieved: " . count($output["authors"]) . " author records.";
      break;
  }
}
```

🔥 THIS IS YOUR EXACT STRUCTURE.

---

# 🧠 4️⃣ RETRIEVAL WITH PARAMETER (YOUR STYLE)

### 🔹 GetTitlesByAuthor()

```php
function GetTitlesByAuthor()
{
  global $output, $clean_get;

  if (!isset($clean_get["au_id"])) {
    $output["error"] = "Missing author ID";
    return;
  }

  $au_id = $clean_get["au_id"];

  $query = "
    SELECT t.title_id, t.title, t.type, t.price
    FROM titles t
    JOIN titleauthor ta ON t.title_id = ta.title_id
    WHERE ta.au_id = '$au_id'
  ";

  if ($queryOutput = mySqlQuery($query)) {

    $output["titles"] = $queryOutput->fetch_all();

  } else {
    $output["error"] = "Failed to retrieve titles";
    return;
  }

  switch (count($output["titles"])) {
    case 0:
      $output["message"] =
        "No titles found for the specified author.";
      break;
    case 1:
      $output["message"] =
        "Retrieved: 1 title record.";
      break;
    default:
      $output["message"] =
        "Retrieved: " . count($output["titles"]) . " title records.";
      break;
  }
}
```

THIS is what you write if they ask for:

* GetStudentsByCourse
* GetOrdersByCustomer
* GetEmployeesByDepartment

Just change table names.

---

# 🧠 5️⃣ END OF FILE (DO NOT FORGET)

You ALWAYS finish with:

```php
echo json_encode($output);
die();
```

If you forget this, NOTHING shows.

---

# 🧠 6️⃣ FRONTEND MATCHING (YOUR STYLE)

### 🔹 AJAX

```js
function GetAllAuthors() {

    let data = {};
    data["action"] = "GetAllAuthors";

    CallAJAX("service.php", "get",
        data, "json",
        GetAllAuthorsSuccess,
        ErrorMethod);
}
```

---

### 🔹 With parameter

```js
function GetTitlesByAuthor() {

    let au_id = $(this).data("author");

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["au_id"] = au_id;

    CallAJAX("service.php", "get",
        data, "json",
        GetTitlesByAuthorSuccess,
        ErrorMethod);
}
```

---

# 🚨 7️⃣ EXAM SURVIVAL CHECKLIST (YOUR VERSION)

If nothing works:

1. Does action match EXACT spelling?
2. Does case name match JS action?
3. Did you use `$clean_get`?
4. Did you use `global $output`?
5. Did you assign `$output["something"]`?
6. Did you echo json_encode?
7. Did you die();

That’s it.

---

# 🎯 What You DO NOT Need To Study

* Prepared statements
* PDO
* New patterns
* New architectures
* Frameworks
* Anything fancy

You are using:

* mySqlQuery
* $output array
* fetch_all()
* switch(count())

Stick to it.

---

# 🧘🏽‍♀️ Now Listen Carefully

You are not confused.

You just panicked because I gave you a different PDO pattern.

Your brain went:

> "WHY ARE WE LEARNING NEW THINGS 30 MINUTES BEFORE WAR?"

Valid reaction.

But now we are back inside **your territory**.

Your structure.
Your rhythm.
Your pattern.

You’ve written this like 6 times already.

This exam is ICA 03 with different table names.

Go in.
Write top structure first.
Then switch.
Then first SELECT.
Then second SELECT.

You don’t need genius mode.
You need muscle memory mode.

And you have it.
