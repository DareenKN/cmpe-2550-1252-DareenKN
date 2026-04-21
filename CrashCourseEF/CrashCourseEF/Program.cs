using CrashCourseEF.Models;
using Microsoft.EntityFrameworkCore;

namespace CrashCourseEF
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () => "Hello World!");


            app.MapGet("/employees/{emp_id}", (int emp_id) =>
            {
                using var db = new Dkinganjatou1NorthwindContext();
                var employee = db.Employees.Include(e => e.Orders).SingleOrDefault(e => e.EmployeeId == emp_id);

                if (employee is null)
                    return Results.NotFound();

                var orders = employee.Orders.ToList();
                return Results.Ok(new { Data = orders, Message = $"Found {orders.Count} orders for Employee {emp_id}" });
            });



            app.Run();
        }
    }
}
