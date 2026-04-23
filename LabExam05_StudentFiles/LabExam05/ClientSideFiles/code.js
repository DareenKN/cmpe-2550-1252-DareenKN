// On Page load stuff
$(function () {
    $('#btnRetrieve').click(function () {
        $('#content').html('<h2>Retrieve Merchandise</h2><p>Data will load here...</p>');
        $("#statusMessage").html("");
		// Fetch data via AJAX and populate
        
		loadMerchandise();
    });

    $('#btnAdd').click(function () {
        $('#content').html(`
            <h2>Add Merchandise</h2>
            <div >
                <label>Name:</label><input type="text" id="name"><br>
                <label>Category:</label><input type="text" id="category"><br>
                <label>Price:</label><input type="text" id="price"><br>
                <label>Stock:</label><input type="text" id="stock"><br>
                <button type="button" id="addMerch">Add</button>
            </div>
        `);

        $('#addMerch').click(function () {
            // Clear Status messages
			$("#statusMessage").html("");
			// Collect data and make an AJAX call to insert the Merchandise
            let mrData={};
            mrData.mName = $("#name").val();
            mrData.mCategory = $("#category").val();
            mrData.mPrice = $("#price").val();
            mrData.mStock = $("#stock").val();
           
            console.log(mrData);
        
            //Make ajax call now
            $.ajax({
                url: 'https://localhost:7144/InsertMerchandise', 
                method: 'POST',
                data: JSON.stringify(mrData),
                contentType: "application/json",
                success: function (data) {
                    // Message
                    console.log(data);
                    $("#statusMessage").html(data.message);
                    if(data.status!="Error")
                        loadMerchandise(); // Reload Merchandise Data  
                },
                error: function (error) {
                    // Message
                    console.log(error);
                    $("#statusMessage").html(error);
                }
            });
        });
    });

    $('#btnUpdate').click(function () {
		// Clear Status messages
		$("#statusMessage").html("");
		
        $('#content').html(`
            <h2>Update Merchandise</h2>
            <div >
                <label>ID:</label><input type="text" id="mId"><br>
                <label>Name:</label><input type="text" id="name"><br>
                <label>Category:</label><input type="text" id="category"><br>
                <label>Price:</label><input type="text" id="price"><br>
                <label>Stock:</label><input type="text" id="stock"><br>
                <button type="button" id="updateMerch">Update</button>
            </div>
        `);

        $('#updateMerch').click(function () {
            // Collect data and make an AJAX call to update the Merchandise
            
            let mrData={};
            mrData.mId = $("#mId").val();
            mrData.mName = $("#name").val();
            mrData.mCategory = $("#category").val();
            mrData.mPrice = $("#price").val();
            mrData.mStock = ($("#stock").val());
           
            console.log(mrData);
           
            //Make ajax call now
            $.ajax({
                url: 'https://localhost:7144/UpdateMerchandise',
                method: 'PUT',
                data: JSON.stringify(mrData),
                contentType: "application/json",
                success: function (data) {
                    // Message
                    console.log(data);
                    $("#statusMessage").html(data.message);
                    if(data.status!="Error")
                        loadMerchandise(); // Reload Merchandise Data  
                },
                error: function (error) {
                    // Message
                    console.log(error);
                    $("#statusMessage").html(error);
                }
            });
        });
    });

    $('#btnDelete').click(function () {
		// Clear Status messages
		$("#statusMessage").html("");
		
        $('#content').html(`
            <h2>Delete Merchandise </h2>
            <div >
                <label>ID:</label><input type="text" id="mId"><br>
                
                <button type="button" id="delMerch">Update</button>
            </div>
        `);

        $('#delMerch').click(function () {
            // Collect data and make an AJAX call to delete the Merchandise
            
            mId= $("#mId").val();
            console.log(mId);
           
            //Make ajax call now
            $.ajax({
                url: "https://localhost:7144/DeleteMerchandise/"+mId,
                method: 'DELETE',
                contentType: "application/json",
                dataType:"JSON",
                success: function (data) {
                    // Message
                    console.log(data);
                    $("#statusMessage").html(data.message);
                    if(data.status!="Error")
                        loadMerchandise(); // Reload Merchandise Data  
                },
                error: function (error) {
                    // Message
                    console.log(error);
                    $("#statusMessage").html(error);
                }
            });
        });
    });
});

/************************************************* 
 * Function     : loadMerchandise
 * Use          : To load Merchandise information 
 * Paramerters  : N/A
 *************************************************/
function loadMerchandise() {
    $.ajax({
        url: 'https://localhost:7144/RetrieveMerchandise',
        method: 'GET',
        success: function (data) {
            // Populate table with Merchandise data
            console.log(data);
			
            // With Enhancement
            let MerchandiseTable="<table>";
            
            MerchandiseTable+="<tr>";
            MerchandiseTable+="<th>Id</th>";
            MerchandiseTable+="<th>Name</th>";
            MerchandiseTable+="<th>Category</th>";
            MerchandiseTable+="<th>Price</th>";
            MerchandiseTable+="<th>Stock</th>";
            MerchandiseTable+="</tr>";
			
			//Building table data
            data.forEach(element => {
              
                MerchandiseTable+= "<tr><td> "+ element.id +"</td>";
                MerchandiseTable+= "<td> "+ element.name +"</td>";
                MerchandiseTable+= "<td> "+ element.category +"</td>";
                MerchandiseTable+= "<td> "+ element.price +"</td>";
                MerchandiseTable+= "<td> "+ element.stock +"</td>";
               
            });
            MerchandiseTable+="</table>";
            $('#content').html(MerchandiseTable);
        }
    });
}