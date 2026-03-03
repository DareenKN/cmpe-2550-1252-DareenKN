Okay. Breathe.

You’ve done ICAs on this. You literally built the patterns already. The exam is just going to remix them.

You have **30 minutes**, so I’m giving you a tight, high-yield, “write-this-and-don’t-think” cheat sheet. No fluff. Just structure and traps to avoid.

---

# 🚨 LAB EXAM 02 – DATABASE RETRIEVAL CHEAT SHEET

**Coverage: SELECT only (NO insert / update / delete)**
So this is basically your ICA 03 pattern.

---

# 🧠 1. Big Picture Flow (Memorize This)

### Page Loads

```js
$(document).ready(function () {
    $('.data-section').hide();
    GetAllSomething();
});
```

### Button Click (Dynamic)

```js
$(document).on('click', '.btn-retrieve', FunctionName);
```

### AJAX Call

```js
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
```

---

# 🧠 2. Retrieval Pattern (Frontend JS)

## 🔹 Step 1 – First Retrieval

```js
function GetAllAuthors() {
    let data = {};
    data["action"] = "GetAllAuthors";

    CallAJAX("service.php", "get", data, "json",
        GetAllAuthorsSuccess,
        ErrorMethod
    );
}
```

---

## 🔹 Step 2 – Success Method

```js
function GetAllAuthorsSuccess(returnedData) {

    let tbody = $("#authors-body");
    tbody.empty();

    if (!returnedData.authors || returnedData.authors.length === 0) {
        $('.data-section').hide();
        return;
    }

    returnedData.authors.forEach(author => {

        let row = `
            <tr>
                <td>
                    <button class="btn btn-retrieve" data-author="${author[0]}">
                        Retrieve
                    </button>
                </td>
                <td>${author[0]}</td>
                <td>${author[1]}</td>
            </tr>
        `;

        tbody.append(row);
    });

    $('#status').html(returnedData.message);
}
```

---

## 🔹 Step 3 – Retrieve Related Data

```js
function GetTitlesByAuthor() {

    let id = $(this).data("author");

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["id"] = id;

    CallAJAX("service.php", "get", data, "json",
        GetTitlesByAuthorSuccess,
        ErrorMethod
    );
}
```

---

## 🔹 Step 4 – Second Success Method

```js
function GetTitlesByAuthorSuccess(returnedData) {

    let tbody = $("#books-body");
    tbody.empty();

    if (!returnedData.titles || returnedData.titles.length === 0) {
        $('.data-section').hide();
        $('#error_status').html(returnedData.message);
        return;
    }

    $('.data-section').show();
    $('#error_status').empty();

    returnedData.titles.forEach(book => {

        let row = `
            <tr>
                <td>${book[0]}</td>
                <td>${book[1]}</td>
                <td>${book[2]}</td>
            </tr>
        `;

        tbody.append(row);
    });

    $('#book-status').html(returnedData.message);
}
```

---

# 🧠 3. service.php Pattern (VERY IMPORTANT)

This is where most people mess up.

---

## 🔹 Always Start Like This

```php
require_once("db.php");

$action = $_GET["action"] ?? $_POST["action"] ?? "";

switch($action)
{
    case "GetAllAuthors":
        GetAllAuthors();
        break;

    case "GetTitlesByAuthor":
        GetTitlesByAuthor();
        break;
}
```

---

## 🔹 Retrieval Function

```php
function GetAllAuthors()
{
    global $pdo;

    $sql = "SELECT au_id, au_lname, au_fname FROM authors";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $authors = $stmt->fetchAll(PDO::FETCH_NUM);

    echo json_encode([
        "authors" => $authors,
        "message" => "Authors retrieved successfully."
    ]);
}
```

---

## 🔹 Retrieval With Parameter

```php
function GetTitlesByAuthor()
{
    global $pdo;

    $au_id = $_GET["au_id"] ?? "";

    $sql = "
        SELECT t.title_id, t.title, t.type, t.price
        FROM titles t
        INNER JOIN titleauthor ta ON t.title_id = ta.title_id
        WHERE ta.au_id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$au_id]);

    $titles = $stmt->fetchAll(PDO::FETCH_NUM);

    echo json_encode([
        "titles" => $titles,
        "message" => "Titles retrieved successfully."
    ]);
}
```

---

# 🧠 4. db.php Pattern

```php
$dsn = "mysql:host=localhost;dbname=your_db;charset=utf8";

$username = "root";
$password = "";

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e) {
    echo "Connection failed.";
}
```

---

# 🚨 5. Most Common Exam Mistakes

### ❌ Forgetting:

* `tbody.empty();`
* `dataType: "json"`
* `echo json_encode(...)`
* `global $pdo;`
* `?` placeholder in SQL
* `execute([$variable])`

---

### ❌ Using $_POST when you're calling GET

Match them.

If AJAX uses:

```js
method: "get"
```

Then use:

```php
$_GET["something"]
```

---

### ❌ Returning plain text instead of JSON

ALWAYS:

```php
echo json_encode([...]);
```

---

# 🧠 6. Quick Debug Checklist

If nothing shows:

* Open browser console
* Look for JSON errors
* Check Network tab
* Make sure action names match EXACTLY
* Check spelling

---

# 🧠 7. If You Freeze Mid Exam

Write this skeleton first:

1. document.ready
2. CallAJAX function
3. First retrieval
4. Success method
5. service.php switch
6. SELECT query
7. json_encode

Build the bones first. Then details.

---

# 💭 Now Listen to Me

You’ve literally already done:

* Multi-table joins
* Dynamic buttons
* AJAX chaining
* JSON handling

This exam is not new knowledge.
It’s pattern repetition.

You’re not behind.
You’re trained.

Go in there calm.
Start with structure.
Then fill.

You’ve got 110 minutes.
That’s luxury time.

Now breathe once.

And go cook.
