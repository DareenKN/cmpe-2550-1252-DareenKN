YES.
Perfect.
We’re isolating it.

No noise.
No PDO.
No new patterns.
Only **YOUR STRUCTURE**.

You can use your `db.php` as library — good. That means we focus only on:

* ✅ JS (frontend retrieval)
* ✅ service.php (backend retrieval only)

---

# 🟣 🔥 JS CHEAT SHEET (RETRIEVAL ONLY)

---

## 🧠 1️⃣ DOCUMENT READY

```js
$(document).ready(function () {
    $('.data-section').hide();
    GetAllAuthors();   // or whatever first retrieval is
});
```

---

## 🧠 2️⃣ GENERIC AJAX (YOUR STYLE)

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

DO NOT change parameter order.

---

## 🧠 3️⃣ FIRST RETRIEVAL (NO PARAMETERS)

```js
function GetAllAuthors() {

    let data = {};
    data["action"] = "GetAllAuthors";

    CallAJAX("service.php", "get",
        data, "json",
        GetAllAuthorsSuccess,
        ErrorMethod
    );
}
```

---

## 🧠 4️⃣ FIRST SUCCESS METHOD

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
                    <button class="btn btn-retrieve"
                        data-author="${author[0]}">
                        Retrieve
                    </button>
                </td>
                <td>${author[0]}</td>
                <td>${author[1]}</td>
                <td>${author[2]}</td>
            </tr>
        `;

        tbody.append(row);
    });

    $('#status').html(returnedData.message);
}
```

---

## 🧠 5️⃣ DYNAMIC BUTTON EVENT

```js
$(document).on('click', '.btn-retrieve', GetTitlesByAuthor);
```

ALWAYS use event delegation.

---

## 🧠 6️⃣ RETRIEVAL WITH PARAMETER

```js
function GetTitlesByAuthor() {

    let au_id = $(this).data("author");

    let data = {};
    data["action"] = "GetTitlesByAuthor";
    data["au_id"] = au_id;

    CallAJAX("service.php", "get",
        data, "json",
        GetTitlesByAuthorSuccess,
        ErrorMethod
    );
}
```

---

## 🧠 7️⃣ SECOND SUCCESS METHOD

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
                <td>${book[3]}</td>
            </tr>
        `;

        tbody.append(row);
    });

    $('#book-status').html(returnedData.message);
}
```

---

## 🧠 8️⃣ ERROR METHOD

```js
function ErrorMethod(req, status, error) {
    console.log("AJAX ERROR", status, error);
    $('#status').html("An error occurred.");
}
```

---

## 🚨 JS COMMON MISTAKES

* ❌ Forgetting `dataType: "json"`
* ❌ Forgetting `tbody.empty()`
* ❌ Mismatch action spelling
* ❌ Using wrong data key (ex: id instead of au_id)
* ❌ Not using $(document).on()

---

---

# 🔵 🔥 service.php CHEAT SHEET (YOUR STYLE ONLY)

This is EXACTLY how you write it.

---

## 🧠 1️⃣ TOP OF FILE

```php
require_once "db.php";

$output = array();

$clean_get = CleanCollection($_GET);
$clean_post = CleanCollection($_POST);

$action = isset($clean_get["action"]) ? $clean_get["action"] :
    (isset($clean_post["action"]) ? $clean_post["action"] : "");

$output = ["message" => ""];
```

---

## 🧠 2️⃣ SWITCH

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

---

## 🧠 3️⃣ BASIC SELECT FUNCTION

```php
function GetAllAuthors()
{
  global $output;

  $query = "SELECT * FROM authors
            ORDER BY au_lname";

  if ($queryOutput = mySqlQuery($query)) {

    $output["authors"] = $queryOutput->fetch_all();

  } else {
    $output["error"] = "Failed to retrieve authors.";
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

---

## 🧠 4️⃣ SELECT WITH PARAMETER

```php
function GetTitlesByAuthor()
{
  global $output, $clean_get;

  if (!isset($clean_get["au_id"])) {
    $output["error"] = "Missing author ID.";
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
    $output["error"] = "Failed to retrieve titles.";
    return;
  }

  switch (count($output["titles"])) {
    case 0:
      $output["message"] =
        "No titles found for this author.";
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

---

## 🧠 5️⃣ END OF FILE (DO NOT FORGET)

```php
echo json_encode($output);
die();
```

If you forget this, nothing displays.

---

# 🚨 service.php MISTAKES TO AVOID

* ❌ Forgetting `global $output`
* ❌ Using $_GET instead of $clean_get
* ❌ Not checking isset()
* ❌ Forgetting fetch_all()
* ❌ Forgetting echo json_encode
* ❌ Missing break in switch

---

# 🎯 FINAL EXAM STRATEGY

1. Write top service structure first.
2. Write switch.
3. Write first SELECT.
4. Test.
5. Then write second SELECT.

Don’t jump around.

Structure first.
Details second.

---

You are not behind.
You are not confused.
You just needed your own pattern back.

Now go in there and execute like it’s ICA 03 again.

You’ve done harder things this week.
