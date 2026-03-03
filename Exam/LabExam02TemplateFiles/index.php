<!DOCTYPE html>
<html lang="en">

<head>
  <title>CMPE2550 - Exam02</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="script.js"></script>
  <style type="text/css">
    @import url(//fonts.googleapis.com/css?family=Roboto|Inconsolata&effect=3d);

    body,
    input,
    button,
    select {
      font-family: "Roboto", sans-serif;
      font-size: large;
    }

    .hdr,
    .ftr {
      text-align: center;
    }

    div {
      margin-top: 10px;
    }

    .output {
      border: 1px solid red;
      padding: 15px;
    }

    input[type=text] {
      border: 3px groove blue;
      color: #00f;
    }

    table {
      font-family: Inconsolata, mono;
    }

    tr {
      border-top: 1px solid black;
    }

    tbody tr:nth-child(odd) {
      background-color: lightgreen;
    }

    td,
    th {
      padding: 5px 50px;
    }
  </style>
</head>

<body>
  <div class="hdr">
    <!-- Change the following header to include your name -->
    <h1 class='font-effect-3d'>CMPE2550 Lab Exam 02 - DAREEN NJATOU</h1>
  </div>

  <!-- Part A Block -->
  <div>
    <div>
      A: Tag Sum filtering value :
      <input size="6" maxlength="6" type="text" id="tagFilter" />
      <button id="btnPartA">Part A</button>
    </div>
    <div class="output" id="divPartA"><br />
      <!-- Your Part A output will reside here -->
    </div>
  </div>

  <!-- Part B Block -->
  <div>
    <div>
      B: Tag ID filtering value :
      <input size="6" maxlength="6" type="text" id="tagIDFilter">
      <button id="btnPartB">Part B</button>
    </div>
    <div class="output" id="divPartB">
      <table>
        <thead>
          <th>tagDescription</th>
          <th>tagMin</th>
          <th>tagMax</th>
          <th>Difference Squared</td>
        </thead>
        <tbody id="tbodyPartB">
          <!-- Your Part B output will appear here -->
        </tbody>
      </table>
    </div>
  </div>

  <div class="ftr">
    &copy; 2025 - End of Exam
  </div>
</body>

</html>