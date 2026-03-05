using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Xml.Linq;

namespace ASPCoreIntro
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader()
                                .SetIsOriginAllowed(origin => true));

            app.UseDeveloperExceptionPage();



            app.MapGet("/", () => "Hello World!");
            app.MapGet("/someStuff", () =>
                                        "This is another piece of functionality");
            app.MapGet("/withData", (string name, string location, int age) =>
                                $"{name} is {age} years old and lives in {location}");

            app.MapPost("/withDataPost", (Info inputData) => {

                return Results.Ok(new { output = $"{inputData.name} is {inputData.age} years old and lives in {inputData.location}"});
                
                });


			app.Run();
        }

        record Info(string name, string location, int age);
    }
}
