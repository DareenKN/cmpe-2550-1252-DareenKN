using LabExam05.Models;
using System.Text.RegularExpressions;

namespace LabExam05
{
    public class Program
    {

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();

            var app = builder.Build();

            // CORS needed
            app.UseCors(x => x.AllowAnyHeader()
                            .AllowAnyMethod()
                            .SetIsOriginAllowed(origin => true)
                        );

            app.MapGet("/", () => "LE05");

            app.MapGet("/RetrieveMerchandise", () =>
            {
                Console.WriteLine("Inside Getmerchandise");

                using (var db = new LabExam05Dkinganjatou1Context())
                {
                    var merchandise = db.Merchandises
                                    .Select(x => new
                                    {
                                        id = x.Id,
                                        name = x.Name,
                                        category = x.Category,
                                        price = x.Price,
                                        stock = x.Stock
                                    }).OrderByDescending(x=>x.id)
                                    .ToList();

                    return Results.Ok(merchandise);
                }
            });


            app.MapPost("/InsertMerchandise", (Info i) =>
            {
                Console.WriteLine("Inside InsertMerchandise");

                if (string.IsNullOrEmpty(i.mName) || string.IsNullOrEmpty(i.mCategory) || !(decimal.TryParse(i.mPrice, out decimal price)) || !(int.TryParse(i.mStock, out int stock)))
                    return Results.Ok(new { message = "No valid values. Please provide valid values", status = "Error" });

                if (price < 0 || stock < 0)
                    return Results.Ok(new { message = "Price and Stock must be a positive number.", status = "Error" });


                using (var db = new LabExam05Dkinganjatou1Context())
                {

                    var o = new Merchandise
                    {
                        Name = i.mName,
                        Category = i.mCategory,
                        Price = price,
                        Stock = stock

                    };

                    try
                    {
                        db.Merchandises.Add(o);
                        db.SaveChanges();
                    }
                    catch (Exception ex) { return Results.Problem(ex.Message); }

                    return Results.Ok(new { message = $"New Merchandise with id {o.Id} has been inserted successfully" });
                }
;
            });

            app.MapPut("/UpdateMerchandise", (Info i) =>
            {
                Console.WriteLine("Inside UpdateMerchandise");

                if (string.IsNullOrEmpty(i.mName) || string.IsNullOrEmpty(i.mCategory) || !(decimal.TryParse(i.mPrice, out decimal price)) || !(int.TryParse(i.mStock, out int stock)) || !(int.TryParse(i.mId, out int id)))
                    return Results.Ok(new { message = "No valid values. Please provide valid values", status = "Error" });

                if (price < 0 || stock < 0 || id < 0)
                    return Results.Ok(new { message = "ID, Price and Stock must be a positive number.", status = "Error" });

                using (var db = new LabExam05Dkinganjatou1Context())
                {
                    var merch = db.Merchandises.FirstOrDefault(o => o.Id == id);
                    if (merch == null)
                        return Results.Ok(new { message = $"Merchandise not found", status = "Error"});

                    merch.Name = i.mName;
                    merch.Category = i.mCategory;
                    merch.Price = price;
                    merch.Stock = stock;

                    try
                    {
                        db.Merchandises.Update(merch);
                        db.SaveChanges();
                    }
                    catch (Exception ex)
                    {
                        return Results.Ok(new { message = $"An error occurred while updating the merchandise: {ex.Message}" });
                    }

                    return Results.Ok(new { message = $"Merchandise with id {merch.Id} has been updated successfully" });
                }
            });

            app.MapDelete("/DeleteMerchandise/{strID}", (string strID) =>
            {
                Console.WriteLine("Inside DeleteMerchandise");

                if (!(int.TryParse(strID, out int id)))
                    return Results.Ok(new { message = "ID Must be an interger value", status = "Error" });

                if(id < 0) return Results.Ok(new { message = "ID Must be a positive value", status = "Error" });

                using (var db = new LabExam05Dkinganjatou1Context())
                {
                    var merch = db.Merchandises.FirstOrDefault(o => o.Id == id);
                    if (merch == null)
                        return Results.Ok(new { message = $"Merchandise not found in DB", status = "Error" });

                    try
                    {
                        db.Merchandises.Remove(merch);
                        db.SaveChanges();
                    }
                    catch (Exception ex)
                    {
                        return Results.Ok(new { message = $"An error occurred while deleting the merchandise: {ex.Message}" });
                    }

                    return Results.Ok(new { message = $"Merchandise with id {id} has been deleted successfully" });
                }
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

        record Info(string mName, string mCategory, string mPrice, string mStock, string mId);
    }
}

