using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            /*
             * NOTE: You will need to set this up to work with your own database 
             * if you want to run it yourself.
             * 
             * You could delete the Models folder and regerate it using your 
             * own connection string. Alternatively, create a new project,
             * set it up yourself, and then copy this code over 
             * (Either way, you will need to change the context 
             * constructor calls in this file).
             */
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers(); // needed for the UseCors below

            var app = builder.Build();

            // These are because I am choosing to serve the static index.html file from wwwroot
            app.UseDefaultFiles();
            app.UseStaticFiles();

            //CORS needed
            app.UseCors(x => x.AllowAnyMethod()
                            .AllowAnyHeader()
                            .SetIsOriginAllowed(origin => true));

            // Get Employees
            app.MapGet("/employees", () =>
            {
                using var db = new Dkinganjatou1NorthwindContext();

                // Notice the use of LINQ (Select)
                var results = db.Employees.Select(e => new
                {
                    e.EmployeeId,
                    e.FirstName,
                    e.LastName
                }).ToList(); // ToList (or something similar) is required here.

                // The format of the json output is determined here.
                return new
                {
                    Message = $"Found {results.Count} employees",
                    Data = results
                };

                // If you wanted to return as a json array directly instead:
                //return results;
            });

            // Get data for a specific employee (notice the parameter embedded in the path).
            app.MapGet("/employees/{employeeId}", (int employeeId) =>
            {
                using var db = new Dkinganjatou1NorthwindContext();

                // More LINQ here. Note that SingleOrDefault() is one way to get the employee here.
                // Single() / SingleOrDefault() can be a good choice when you are using the primary key
                // for a table since there should only ever be at most one record that corresponds.
                //
                // First() might work too, but it will silently allow this to work
                // even if 2 employees were returned (which would indicate a nasty bug, EmployeeId is our primary key after all...)
                var employee = db.Employees
                    .Include(e => e.Orders) // Include is ONE way of making sure we get the orders here. It requires the using statement at the top of this file.
                    .SingleOrDefault(e => e.EmployeeId == employeeId);

                if (employee is null)
                {
                    // Using Results here let's us return specific error codes, 404 in this case.
                    // Not strictly necessary, but definitely a good practice.
                    return Results.NotFound($"Employee {employeeId} not found");
                }

                // Since I am returning a result for the errors above, I need to return an Ok result at the end here.
                // Trying to return the anonymous type directly here will result in cryptic type errors...
                return Results.Ok(new
                {
                    employee.EmployeeId,
                    employee.FirstName,
                    employee.LastName,
                    NumberOfOrders = employee.Orders.Count
                });
            });

            // Orders for a specific employee.
            // startDate and endDate are *query params*, e.g. /employees/1/orders?startDate=2017-07-01&endDate=2017-08-01
            //
            // NOTE: This means I can mix path parameters and query parameters. Interestingly, the order does not matter.
            app.MapGet("/employees/{employeeId}/orders", (int employeeId, DateTime? startDate, DateTime? endDate) =>
            {
                // Validation
                if (startDate > endDate)
                {
                    // Once again, Results.BadRequest let's us return a 400 status code along with our message.
                    return Results.BadRequest("endDate must come after startDate");
                }

                using var db = new Dkinganjatou1NorthwindContext();

                var employee = db.Employees.Include(e => e.Orders).SingleOrDefault(e => e.EmployeeId == employeeId);

                if (employee is null)
                {
                    return Results.NotFound($"Employee {employeeId} not found");
                }

                IEnumerable<Order> orders = employee.Orders;

                // I decided to make these parameters optional, so I only add the filtering, i.e. the Where(), if either is defined.
                // This is a little more advanced, and there are many ways to accomplish this.
                // Wanted to demonstrate that we can treat these collections as IEnumerables.
                if (startDate != null || endDate != null)
                {
                    orders = orders.Where(o => o.OrderDate >= (startDate ?? DateTime.MinValue) && o.OrderDate < (endDate ?? DateTime.MaxValue));
                }

                var results = orders
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.ShipName,
                    o.Freight
                }).ToList();

                return Results.Ok(new
                {
                    Data = results,
                    Message = $"Found {results.Count} orders for Employee {employeeId}"
                });
            });

            // Insert employee
            // Notice that req is from the BODY of the post request
            app.MapPost("/employees", (CreateEmployeeRequest req) =>
            {
                // Validation
                if (string.IsNullOrWhiteSpace(req.FirstName))
                {
                    return Results.BadRequest("firstName must be provided");
                }

                if (string.IsNullOrWhiteSpace(req.LastName))
                {
                    return Results.BadRequest("lastName must be provided");
                }

                // To insert a new record, you start by creating a new class for the Entity (employee in this case)
                var employee = new Employee
                {
                    FirstName = req.FirstName,
                    LastName = req.LastName
                };

                using var db = new Dkinganjatou1NorthwindContext();

                try
                {
                    // We add a new row to the employees table by passing our new entity to Add()
                    db.Add(employee);
                    db.SaveChanges(); // Don't forget to save changes!
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }

                // The Created result is best practice, but not strictly required.
                return Results.Created($"/employees/{employee.EmployeeId}", new
                {
                    employee.EmployeeId,
                    employee.FirstName,
                    employee.LastName
                });
            });

            // Insert an order for an employee
            // Notice how employeeId is from the PATH, while req is from the BODY.
            // This is important! We can combine path parameters with a record built from the request body.
            app.MapPost("/employees/{employeeId}/orders", (int employeeId, CreateOrderRequest req) =>
            {
                // Validation
                if (string.IsNullOrWhiteSpace(req.ShipName))
                {
                    return Results.BadRequest("shipName must be provided");
                }

                if (req.OrderDate < DateTime.Now)
                {
                    return Results.BadRequest("orderDate must be in the future");
                }

                using var db = new Dkinganjatou1NorthwindContext();

                var order = new Order
                {
                    EmployeeId = employeeId,
                    ShipName = req.ShipName,
                    Freight = req.Freight,
                    OrderDate = req.OrderDate
                };

                try
                {
                    db.Add(order);
                    db.SaveChanges();
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }

                return Results.Created($"/employees/{employeeId}/orders/{order.OrderId}", new
                {
                    order.OrderId,
                    order.ShipName,
                    order.Freight,
                    order.OrderDate
                });
            });

            // Update employee
            app.MapPut("/employees/{employeeId}", (int employeeId, CreateEmployeeRequest req) =>
            {
                // Validation
                if (string.IsNullOrWhiteSpace(req.FirstName))
                {
                    return Results.BadRequest("firstName must be provided");
                }

                if (string.IsNullOrWhiteSpace(req.LastName))
                {
                    return Results.BadRequest("lastName must be provided");
                }

                using var db = new Dkinganjatou1NorthwindContext();

                // To update an employee we must first retrieve the entity (employee).
                var employee = db.Employees.SingleOrDefault(e => e.EmployeeId == employeeId);

                if (employee is null)
                {
                    return Results.NotFound($"Employee {employeeId} not found");
                }

                // To update, we start by literally changing the params of the entity's object.
                employee.FirstName = req.FirstName;
                employee.LastName = req.LastName;

                try
                {
                    db.Update(employee); // Similar to Add(), in that we pass in the entity
                    db.SaveChanges(); // Don't forget to save changes!
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }

                return Results.Ok();
            });

            // Delete employee
            app.MapDelete("/employees/{employeeId}", (int employeeId) =>
            {
                using var db = new Dkinganjatou1NorthwindContext();

                var employee = db.Employees.SingleOrDefault(e => e.EmployeeId == employeeId);

                if (employee is null)
                {
                    return Results.NotFound($"Employee {employeeId} not found");
                }

                try
                {
                    db.Employees.Remove(employee); // Similar to Add(), in that we pass in the entity
                    db.SaveChanges(); // Don't forget to save changes!
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.Message);
                }

                return Results.Ok();
            });

            app.Run();
        }
    }

    // Some records to make life easier
    public record CreateEmployeeRequest(string FirstName, string LastName);
    public record CreateOrderRequest(string ShipName, decimal Freight, DateTime OrderDate);
}
