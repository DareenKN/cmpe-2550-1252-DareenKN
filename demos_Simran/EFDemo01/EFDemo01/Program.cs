using EFDemo01.ModelsNWD;

namespace EFDemo01
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () => "EF Demo 01: 03 April 2025");

            // EF - Entitiy FrameWork is object -relation mapper
            // Step 1 : Install Package - Microsoft.EntityFrameworkCore.SqlServer 
            // Step 2 : Install a tool Tools-> NuGet Package Manager- Package Manager Console
            // install-package Microsoft.EntityFrameworkCore.Tools 

			// Reverse Engineering part
			/*
				Scaffold-DbContext "Server=data.cnt.sast.ca,24680;
				Database=demo_db2550_Northwind; User Id=USERIDhere;Password=PASSWORDHERE;
				Encrypt= False;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir ModelsNWD
			*/
            app.MapGet("/RetData", () =>
            {
                Console.WriteLine("In Ret Data Endpoint");
                // Create a object of DB
                var db = new DemoDb2550NorthwindContext();

                // LINQ queries
                // Query Style of LINQ queries
                //PART 1
                // select * from Products
                /*
                   var results = from p in db.Products
                                    join c in db.Categories
                                    on p.CategoryId equals c.CategoryId
                                 where p.ProductId <= 5 // Filtering
                                 orderby p.ProductId descending // By default it is ascending order Type full descending keyword
                                  //select p;  // similar to select *
                                   select new { p,c.CategoryName};  // All columns from p and Just Category Name from c
                
                return results.ToList();
                */
                // Method Style 

                
                var results = db.Products
                                        .Where(x=> x.CategoryId == x.Category.CategoryId)  // JOIN part
                                        .Where(x=>x.ProductId<= 5)
                                        //.OrderBy(x=>x.ProductId)  // ascending order
                                        .OrderByDescending(x=>x.ProductId)  // descending order
                                        .Select(x => new { x, x.Category.CategoryName});

                return results.ToList();
                
            });

            //DML part
            // For testing purpose MapGet only

            app.MapGet("/InsertCategory", () =>
            {
                Console.WriteLine("Inside Insert Category End point");

                // Creat an object of catergory class

                Category newCategory = new Category();

                // Populate the values for required properties
                newCategory.CategoryName = "Test Category";
                newCategory.Description = "Test Category desc";

                try
                {
                    var db = new DemoDb2550NorthwindContext();
                    // using Add method you can add new object into the list

                    db.Categories.Add(newCategory);

                    // Save the changes in DB
                    db.SaveChanges();  // Commit 

                    Console.WriteLine("Inserted Successfully");
                    return " Inserted Successfully";  // HTML response

                }
                catch (Exception e)
                {
                    Console.WriteLine("Error" + e.Message);
                    return "Error " + e.Message;
                }

            });

            app.MapGet("/DeleteCategory/{cid}", (string cid)=>
            {
                Console.WriteLine("Inside Delete one");

                try
                {
                    int id = int.Parse(cid); // converting value to int type

                    var db = new DemoDb2550NorthwindContext();

                    // Try to delete category from db

                    if (db.Categories.Find(id) is Category c)
                    {
                        // if match found it will return an object

                        // Remove that object from the LIST
                        db.Categories.Remove(c);


                        // FOR UPDATE PART  Make changes in the object and then update it

                        //c.CategoryName = "TimCoffee";

                        //db.Categories.Update(c);

                        db.SaveChanges();

                        Console.WriteLine("Deleted successfully");
                    

                    }
                    return "Deleted successfully";

                }
                catch (Exception e)
                {
                    Console.WriteLine("Error" + e.Message);
                    return "Error " + e.Message;
                }

            });

            app.Run();
        }
    }
}
