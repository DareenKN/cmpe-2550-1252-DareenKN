using ADO_DEMO.Classes;

namespace ADO_DEMO
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.MapGet("/", () =>
            {
                return Results.Ok(new { Employees = NorthwindDAC.GetEmployees() });
            });

            app.MapGet("/product", (int product) =>
            {
                return Results.Ok(new { productInfo = NorthwindDAC.GetProductInfo(product) });
            });

            app.Run();
        }
    }
}