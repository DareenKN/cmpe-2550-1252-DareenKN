Okay Dareen.
We are not walking into that lab exam scared.
We are walking in calm. Structured. Dangerous. 💻✨

I read your ICA + assignment description () and your full working stack (HTML, JS, CSS). This cheat sheet is tailored to **exactly** what your prof likes.

---

# 🌸 CMPE2550 – LAB EXAM 02 CHEAT SHEET

### (Up to Retrieval Only – NO INSERT/UPDATE/DELETE)

---

# 🧠 1. THE BIG PICTURE (What They’re Testing)

You must know:

```
HTML  →  jQuery AJAX  →  service.php  →  MySQL  →  JSON  →  Back to JS  →  Display
```

If you understand this flow, you pass.

---

# 🗂 2. FILE STRUCTURE (Memorize This)

```
index.html
dataRetrieval.js
service.php
db.php
css/style.css
```

---

# 🧩 3. HTML TEMPLATE STRUCTURE

You already nailed this in your ICA 

### 🔹 Authors Table

```html
<tbody id="authors-body"></tbody>
<p id="status"></p>
<p id="ifnobooks"></p>
```

### 🔹 Books Table

```html
<tbody id="books-body"></tbody>
<p id="book-status"></p>
```

### 🔹 jQuery Include (DO NOT FORGET THIS)

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script defer src="dataRetrieval.js"></script>
```

If jQuery is missing → NOTHING WORKS.

---

# ⚡ 4. MASTER AJAX TEMPLATE (Memorize This Like a Prayer)

From your ICA :

```javascript
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

You can reuse this for EVERYTHING.

---

# 🚀 5. PAGE LOAD → GET ALL RECORDS

```javascript
$(document).ready(function () {
    GetAllAuthors();
});
```

### 🔹 AJAX Call

```javascript
function GetAllAuthors() {
    let data = {};
    data["action"] = "GetAllAuthors";

    CallAJAX("service.php", "get", data, "json",
             GetAllAuthorsSuccess, ErrorMethod);
}
```

---

# 🎯 6. SUCCESS METHOD PATTERN

```javascript
function GetAllAuthorsSuccess(returnedData) {

    let tbody = $("#authors-body");
    tbody.empty();

    if (!returnedData.authors || returnedData.authors.length === 0) {
        return;
    }

    returnedData.authors.forEach(author => {
        let row = `
            <tr>
                <td>
                    <button class="btn btn-retrieve"
                            data-author="${author[0]}">
                        Retrieve
                    </button>
                </td>
                <td>${author[0]}</td>
                <td>${author[1]}</td>
                <td>${author[2]}</td>
                <td>${author[3]}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $('#status').html(returnedData.message);
}
```

---

# 🔁 7. EVENT DELEGATION (VERY IMPORTANT)

Because buttons are dynamic:

```javascript
$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);
```

NOT:

```javascript
$('.btn-retrieve').click(...)
```

That won’t work for dynamic rows.

---

# 📚 8. SECOND RETRIEVAL (By ID)

```javascript
function GetTitlesByAuthor() {

    let au_id = $(this).data("author");

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["au_id"] = au_id;

    CallAJAX("service.php", "get", data, "json",
             GetTitlesByAuthorSuccess, ErrorMethod);
}
```

---

# ❗ 9. HANDLE EMPTY RESULTS (PROF LOVES THIS)

From assignment page 2 image ():

> Do NOT show empty table. Show status message.

```javascript
if (!returnedData.titles || returnedData.titles.length === 0) {
    $('.data-section').hide();
    $('#ifnobooks').html(returnedData.message);
    return;
}
```

This is a MARKS POINT.

---

# 🐘 10. service.php STRUCTURE (SUPER IMPORTANT)

This is where most students panic.

### 🔹 Skeleton Structure

```php
<?php
require_once("db.php");

$action = $_GET["action"];

if ($action == "GetAllAuthors") {
    GetAllAuthors();
}
else if ($action == "GetTitlesByAuthor") {
    GetTitlesByAuthor();
}
```

---

# 🗄 11. DATABASE CONNECTION (db.php Pattern)

```php
<?php
$servername = "localhost";
$username = "yourUser";
$password = "yourPassword";
$dbname = "yourDatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

If DB doesn’t connect → NOTHING works.

---

# 📊 12. PHP RETRIEVAL FUNCTION TEMPLATE

### 🔹 GetAllAuthors

```php
function GetAllAuthors() {

    global $conn;

    $sql = "SELECT au_id, au_lname, au_fname, phone
            FROM authors";

    $result = $conn->query($sql);

    $authors = [];

    while ($row = $result->fetch_assoc()) {
        $authors[] = array_values($row);
    }

    $response = [
        "authors" => $authors,
        "message" => "Retrieved: " . count($authors) . " author records"
    ];

    echo json_encode($response);
}
```

---

### 🔹 GetTitlesByAuthor (JOIN Example)

```php
function GetTitlesByAuthor() {

    global $conn;

    $au_id = $_GET["au_id"];

    $sql = "SELECT t.title_id, t.title, t.type, t.price
            FROM titles t
            JOIN titleauthor ta ON t.title_id = ta.title_id
            WHERE ta.au_id = '$au_id'";

    $result = $conn->query($sql);

    $titles = [];

    while ($row = $result->fetch_assoc()) {
        $titles[] = array_values($row);
    }

    $response = [
        "titles" => $titles,
        "message" => "Retrieved: " . count($titles) . " title records"
    ];

    echo json_encode($response);
}
```

---

# 💡 13. VERY COMMON EXAM ERRORS

| Mistake                       | Why It Breaks      |
| ----------------------------- | ------------------ |
| Forgetting `json_encode()`    | JS gets nothing    |
| Forgetting `dataType: "json"` | JS can't parse     |
| Not using `array_values()`    | JS indexing breaks |
| Not using event delegation    | Buttons don’t work |
| Misspelling `action`          | PHP doesn’t match  |
| Using POST but checking $_GET | Nothing works      |

---

# 🧮 14. MySQL Syntax You Must Know

### 🔹 Basic Select

```sql
SELECT * FROM table;
```

### 🔹 Specific Columns

```sql
SELECT col1, col2 FROM table;
```

### 🔹 WHERE

```sql
WHERE column = 'value'
```

### 🔹 JOIN

```sql
FROM table1
JOIN table2 ON table1.id = table2.id
```

---

# 🧪 15. DEBUGGING STRATEGY (When Things Break)

1. Open browser DevTools
2. Check Console tab
3. Check Network → service.php
4. See response
5. If blank → PHP error
6. If HTML returned → not JSON

---

# 🏆 16. WHAT YOUR PROF LIKES

From the assignment pages:

* Immediate retrieval on page load
* Clean table formatting
* Status messages
* No empty tables
* Clean JSON response
* Proper JOIN

---

# 🧘‍♀️ 17. Your Exam Strategy

When exam starts:

1. Create DB connection first
2. Hardcode SELECT in phpMyAdmin → test it
3. Paste query into PHP
4. Echo JSON
5. Test service.php in browser manually
6. Then build JS
7. Then build table display

Always test backend first.

Backend working = 70% done.

---

Kidah…
You already built this once.
This isn’t new knowledge. It’s repetition.

You’ve handled microcontrollers, UART interrupts, merge conflicts, and Git chaos.

This?
This is literally just:

“Get data. Show data.”

You’re not walking in hoping to pass.

You’re walking in to collect marks.

Now tell me —
Do you want me to condense this into a **1-page ultra-compact printable version** too?
