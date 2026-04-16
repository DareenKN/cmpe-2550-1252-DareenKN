using Microsoft.Data.SqlClient;
using System.Data;
using System.Runtime;
using System.Text.RegularExpressions;

namespace Exam041251
{
    
    public class Program
    {
        
        public static void Main(string[] args)
        {
           
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            var app = builder.Build();

            //CORS needed
            app.UseCors(x => x
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .SetIsOriginAllowed(origin => true) // Allow any origin
                            );// allow calling from any website

            app.UseDeveloperExceptionPage(); // developer error messages displayed

           

            app.MapGet("/", () => "Exam 04 ");
            // Write your code here for all parts
            app.MapGet("/RetrieveItems/{stDate}/{endDate}", (string stDate, string endDate) =>
            {
                var items = RestaurantDAC.GetItemsInfo(stDate, endDate);
                return Results.Ok(items);
            });


            app.MapDelete("/DeleteItem/{id}", (int id) =>
            {
                int success = RestaurantDAC.DeleteItem(id, out string message);

                Console.WriteLine(success);
                string error = "";
                message = "";
                if (success == -1)
                    message = "An Error occurred, item was not successfully deleted";
                else
                    message = $"item has been successfully deleted from the database";
                return Results.Ok(new { message = message, error = error });
            });

            app.MapPut("/UpdateItem", (Item st) =>
            {
                Console.WriteLine("Inside Update item");

                Console.WriteLine($"{st.id}, {st.name}, {st.price}");

                if (st.id == null)
                    return Results.Ok(new { message = "No id was provided" });

                if (st.price == null)
                    return Results.Ok(new { message = "No price was provided" });

                if (string.IsNullOrEmpty(st.name))
                    return Results.Ok(new { message = "No name was provided" });

                if (st.id < 0)
                    return Results.Ok(new { message = "The item ID must be greater than zero" });

                if (st.price <= 0)
                    return Results.Ok(new { message = "The item price must be greater than zero" });


                int success = RestaurantDAC.UpdateItem((int)st.id, st.name, (double)st.price);
                Console.WriteLine(success);

                string error = "";
                string message = "";

                if (success == -1)
                    message = "An Error occurred, item does not exist";
                else
                    message = $"item Information has been updated successfully";

                return Results.Ok(new { error = error, message = message });
            });

            app.MapPost("/InsertItem", (Item st) =>
            {
                Console.WriteLine("Inside of Additem");

                Console.WriteLine($"{st.id}, {st.name}, {st.price}");


                if (st.id == null)
                    return Results.Ok(new { message = "No id was provided" });

                if (st.price == null)
                    return Results.Ok(new { message = "No price was provided" });

                if (string.IsNullOrEmpty(st.name))
                    return Results.Ok(new { message = "No name was provided" });

                if (st.id < 0)
                    return Results.Ok(new { message = "The item ID must be greater than zero" });

                if (st.price <= 0)
                    return Results.Ok(new { message = "The item price must be greater than zero" });

                string error = "";
                string message = "";

                var success = RestaurantDAC.AddItem((int)st.id, st.name, (double)st.price);

                if (success == -1)
                    message = "An Error occurred, item was not successfully added";
                else
                    message = $"item has been successfully inserted into the database";

                return Results.Ok(new { status = error, message = message});
            });



            app.Run();
        }


        // Method for easy troubleshooting
        static Exception GetInnerMostException(Exception ex)
        {
            while (ex.InnerException != null)
                ex = ex.InnerException;

            return ex;
        }
    }
}


record Item(int? id, string name, double? price);