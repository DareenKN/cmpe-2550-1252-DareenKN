<!DOCTYPE html>
<html lang="en">
	<head>
		<title>CMPE2550 - Exam03</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="script.js"></script>
		<style type="text/css">
      @import url(//fonts.googleapis.com/css?family=Roboto|Inconsolata&effect=3d);
 			body, input, button, select {
				font-family: "Roboto", sans-serif;
				font-size: large;
      }
      .hdr, .ftr { text-align : center; }
      div { margin-top: 10px; }
			.output {
        border : 1px solid red;
				padding : 15px;
			}
			input[type=text] {
				border: 3px groove blue;
				color: #00f;
      }
      table { font-family : Inconsolata, mono; }
      tr { border-top: 1px solid black; }
      tbody tr:nth-child(odd) { background-color: lightgreen;}
      td, th { padding : 5px 50px; }
    </style>
	</head>
	<body>
    <div class="hdr">
      <!-- Change the following header to include your name -->
      <h1 class='font-effect-3d'>CMPE2550 Lab Exam 03 - Dareen Njatou</h1>
    </div>
 
    <!-- DO NOT CHANGE ANYTHING BELOW THIS COMMENT -->
    <div>
      <div>
        <h4><u>Tag ID Viewer</u></h4>
				Tag ID value :
				<input size="6" maxlength="6" type="text" id="tagID">
        <button id="btnGetTag">Get Tag</button>
      </div>
      <div class="output" id="divGetTag">
        <table>
          <thead><th>tagID</th><th>tagMin</th><th>tagMax</th></thead>
          <tbody id="tbodyGetTag">
				    <!-- Selected tag output will occur here -->
          </tbody>
        </table>
      </div>
    </div>

    <br/><hr/>

    <!-- Tag Data Manipulation Block -->
    <div>
      <div>
        <h4><u>Tag ID Adder/Updater/Remover</u></h4>
        Tag ID value : <input size="6" maxlength="6" type="text" id="tagIDManip"><br/>
				<label><input type="radio" name="rTagManip" value="insert" checked="checked" />Insert</label><br/>
				<label><input type="radio" name="rTagManip" value="delete" />Delete</label><br/>
        <label><input type="radio" name="rTagManip" value="update" />Update</label><br/>
        <button id="btnManipulateTag">Manipulate Tag Data</button>
      </div>
      <div class="output" id="divManipulateTag"><br/>
				<!-- Your Tag Data Manipulation output will appear here -->
      </div>
    </div>


		<div class="ftr">
			&copy; 2026 - End of Exam
		</div>
	</body>
</html>
