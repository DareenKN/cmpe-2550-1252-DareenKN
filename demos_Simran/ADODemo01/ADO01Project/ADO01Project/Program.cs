using Microsoft.Data.SqlClient;
using System.Transactions;

namespace ADO01Project
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();
            
            //Default End point
            app.MapGet("/", () => "ADO Project 01");

            // Define connection string 

            string connectionString = "Server = data.cnt.sast.ca,24680;" +
                                      "Database = demoUser_ClassTrak;" +
                                      "User Id = demoUser;" +
                                      "Password= temP2020#;" +
                                      "Encrypt = false;";

            // Specific end point for Ret Data
            app.MapGet("/RetrieveData", () => {
                Console.WriteLine("Inside Ret Data part");

                try  // Try to do everything inside a try catch block to handle exceptions nicely
                {
                    //Step 1: Establish connection to Database
                    // Use SQLConnection class to do that

                    SqlConnection connection = new SqlConnection(connectionString);

                    //Step 2: Open the connection
                    connection.Open(); // Open the connection

                    Console.WriteLine("Connection is open now");
                    // Step 3: Prepare query 

                    string query = "select * from Students where student_id = @stid";

                    // Step 4: Execute your query
                    // SqlCommand class is required to run your query

                    SqlCommand command = new SqlCommand(query, connection);

                    command.Parameters.AddWithValue("@stid", 254);  // Hard coded the value, you can use the value coming from client

                    // Step 5: Run your Query Iterate through the result set
                    SqlDataReader reader = command.ExecuteReader();  // return result set or false

                    int count = 0;
                    while (reader.Read())  // false if no data or end of data set
                    { // Access data using reader ['ColumnName']
                        Console.WriteLine($" {reader["student_id"]}  {reader["last_name"]}");
                        count++;

                        // You have data, you can return it back to user using JSON object or string
                        // LIST, Dictionary, Class, Array

                    }
                    Console.WriteLine($"Total number of Students {count}");

                }
                catch (Exception e)
                {
                    Console.WriteLine("Error while working with database " + e.Message);
                }

            });



            // Demo 02 - For DML part  [Insert, Update and Delete]
            // End Points for managing Delete operation
            // Make sure to REST methods - GET, POST, PUT, DELETE
            app.MapGet("/DeleteEmployee", () => {
            //app.MapDelete("/DeleteEmployee", () => {
                Console.WriteLine("Inside Delete Emp");

                // Trying to get connection information from appsettings.json file
                SqlConnection con = new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));

                con.Open(); // To open the actual connection

                SqlTransaction transaction = con.BeginTransaction(); // Start a transaction

                try
                {   
                   

                    //Prepare our query 

                    string query = "Delete from Employees where EmployeeID = @empId";

                    SqlCommand command = new SqlCommand(query, con, transaction); // NEW PART for transaction - using new Constructor

                    command.Parameters.AddWithValue("@empId", 19); // hard coded value, change it to value coming from client side
                    // Make sure to add new employee with id 19 or change the id

                    // Exceute your query 
                    //ExecuteNonQuery() -- return the number of rows affected

                    int rowsAffected= command.ExecuteNonQuery();  // For DML queries [Data manipulation language]

                    transaction.Commit();  // Making changes permanent in the DB
                    Console.WriteLine($" Number of employees deleted = {rowsAffected}");
                    return $" Number of employees deleted = {rowsAffected}";

                }
                catch (Exception e)
                {
                    transaction.Rollback();  // ROllback 
                    Console.WriteLine("Error while doing DML operations" + e.Message);
                    return "Error while doing DML operations" + e.Message;
                }

            
            });
            app.Run();
        }
    }
}
