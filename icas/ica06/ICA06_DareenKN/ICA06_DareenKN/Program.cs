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

            app.MapPost("/Locations", (Locations l) =>
            {
                Console.WriteLine("Inside Locations");

                var locations = new string[]
                {
                    "Downtown Edmonton",
                    "Kingsway Mall",
                    "University Area"
                };

                var menu = new string[]
                {
                    "Iced Capp",
                    "Double Double Coffee",
                    "Timbits",
                    "Bagel with Cream Cheese"
                };


            });

            app.Run();
        }

        record Locations();
    }
}
