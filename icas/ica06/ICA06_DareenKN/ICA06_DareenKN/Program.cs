using System.Text.RegularExpressions;

namespace ICA06_DareenKN
{
    public class Program
    {
        public static string CleanInput(string input)
        {
            string cleanInput = Regex.Replace(input, "<.*?|&.*?;", string.Empty);
            return cleanInput;
        }




        public static void Main(string[] args)
        {
            Console.WriteLine("ICA06 DareenKN For Debbuging Purposes");

            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            var app = builder.Build();

            app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true));

            app.MapGet("/", () => "ASP.NET CORE ICA06 DareenKN");

            app.MapGet("/Welcome", () => "Welcome to Tim Hortons");

            app.MapPost("/Location", (Info l) =>
            {
                Console.WriteLine("Inside Locations");

                var locations = new string[]
                {
                    "NAIT Campus",
                    "Downtown Edmonton",
                    "Kingsway Mall",
                    "University Area"
                };

                //var menu = new string[]
                //{
                //    "Iced Capp",
                //    "Double Double Coffee",
                //    "Timbits",
                //    "Bagel with Cream Cheese"
                //};

                return Results.Ok(new { locations = locations });


            });

            app.MapPost("/Menu", (Info i) =>
            {
                Console.WriteLine("Inside Menu");
                var menu = new string[] { };
                string message = "";
                if (i.location == "NAIT Campus")
                {
                    menu =
                    [
                    "Muffins: $2.29",
                    "Croissants: $2.19",
                    "Cookies: $1.49",
                    "Pumpkin Spice Iced Capp: $4.29",
                    "Caramel Toffee cold Brew: $3.99"
                    ];

                    message = "Select your items from the Menu";
                }
                else
                    message = "No menu at this location for the moment sorry!";

                return Results.Ok(new { menu = menu, message = message });
            });

            app.MapPost("/Order", (Info i) =>
            {
                Console.WriteLine("Inside Order");

                string message = "";
                var orderPlaced = new string[] { };

                if (string.IsNullOrEmpty(i.name))
                    return Results.Ok(new { message = "No name has been provided" });

                if (string.IsNullOrEmpty(i.item))
                    return Results.Ok(new { message = "No item was selected" });

                if (i.itemsNum == 0)
                    return Results.Ok(new { message = "The number of items can't be equal to zero" });

                if (string.IsNullOrEmpty(i.payment))
                    return Results.Ok(new { message = "No payment method has been provided" });


                orderPlaced =
                [
                    $"Pick up Location: {i.location}",
                    $"Item Ordered: {i.item}",
                    $"Number of Items: {i.itemsNum}",
                    $"Method of Payment: {i.payment}"
                ];

                return Results.Ok(new { message = message, order = orderPlaced});
            });

            app.Run();
        }

        record Info(string location, string name, string item, int itemsNum, string payment);
    }
}
