using EF_Demo_NorthWind.Models;

namespace EF_Demo_NorthWind
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () => "Hello World!");

            app.MapGet("/RetData", () =>
            {
                using (var db = new Dkinganjatou1NorthwindContext())
                {
                    var results = db.Products
                                    .Where(x => x.UnitPrice < 10)
                                    .Select(x => new
                                    {
                                        PID = x.ProductId,
                                        Product = x.ProductName,
                                        Sum = x.OrderDetails.Sum(y => y.Quantity * y.UnitPrice)
                                    })
                                    .OrderByDescending(x => x.Product)
                                    .ToList();
                    return results;
                }
            });

            app.MapPost("/InsertCategory", () =>
            {

                Category c = new Category();

                c.CategoryName = "Test Category";
                c.Description = "Test Category for Demo";

                using (var db = new Dkinganjatou1NorthwindContext())
                {
                    try
                    {

                        db.Categories.Add(c);
                        db.SaveChanges();

                        return Results.Ok("Insert successful");

                    }
                    catch (Exception ex)
                    {
                        db.ChangeTracker.Clear();
                        return Results.Problem(ex.Message);
                    }
                }

            });

            app.MapPut("/UpdateCategory", () =>
            {
                int id = 12;
                using (var db = new Dkinganjatou1NorthwindContext())
                {
                    try
                    {
                        if (db.Categories.Find(id) is Category c)
                        {
                            c.CategoryName = "UpdatedName";
                            c.Description = "UpdtedDescription for Demo";

                            db.Categories.Update(c);
                            db.SaveChanges();

                            return Results.Ok("Updated Succesfully!");
                        }
                        else
                            return Results.NotFound("Category Not Found");
                    }
                    catch (Exception ex)
                    {
                        db.ChangeTracker.Clear();
                        return Results.Problem(ex.Message);
                    }
                }
            });


            app.MapDelete("/DeleteCategory", () =>
            {
                int id = 12;
                using (var db = new Dkinganjatou1NorthwindContext())
                {
                    try
                    {
                        if (db.Categories.Find(id) is Category c)
                        {
                            db.Categories.Remove(c);
                            db.SaveChanges();

                            return Results.Ok("Deleted Succesfully!");
                        }
                        else
                            return Results.NotFound("Category Not Found");
                    }
                    catch (Exception ex)
                    {
                        db.ChangeTracker.Clear();
                        return Results.Problem(ex.Message);
                    }
                }
            });

            app.Run();
        }
    }
}
}
