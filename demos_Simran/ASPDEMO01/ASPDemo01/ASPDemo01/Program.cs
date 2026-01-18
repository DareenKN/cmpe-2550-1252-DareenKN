using System.Reflection.Metadata.Ecma335;
using System.Text.RegularExpressions;

namespace ASPDemo01
{
    public class Program
    {
        /*************************************************
         * Function Name       : CleanInput
         * Purpose             : To sanitize inputs
         * Input               : String
         * Output              : string - cleaned input
         * ***********************************************/
        public static string CleanInput(string input)
        {
            // clean your inputs here
            string clearnInput = Regex.Replace(input, "<.*?|&.*?;", string.Empty);
            
            return clearnInput;

        }
        public static void Main(string[] args)
        {
            Console.WriteLine("for debugging purpose");

            // WebApplication is a special class provided by MicroSoft:
            // used to configure the HTTP Pipeline and routes
            
            var builder = WebApplication.CreateBuilder(args);
            // CORS issue  
            builder.Services.AddControllers();

            var app = builder.Build();

            // Without CORS services will fail upon attempted activatio/ missing addCors internal exception

            // Need to fix CORS problem encountered with POST AJAX call
            // CORS: Cross origin Resource sharing

            app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(orgin => true));


            // MapGet will handle all GET requests from client side
            // Form submits may be used for GET request
            // Simple Lamda statements are used below for demo purpose only
            //Default 
            app.MapGet("/", () => "ASP.NET CORE Demo 01");

            //Specific end points are possible
            app.MapGet("/Special", () => "New Change When you ask for something special, I will provide it you.");


            // Specific end point for processing form
            // 
            app.MapGet("/registerGet", (string getName, string getAge) => 
            $"Client Data: {getName}'s age is {getAge}");


            // Specific end point for processing form
            // One would think that passing for POST would be the same as the GET, one might be wrong
            app.MapPost("/registerPost", (ClientData cl) =>
            {
                Console.WriteLine("Inside registerPOST");
                
                int countChar = cl.postName.Length;
                // validate and sanitize your data

                // Returning String values
                //return $"Client Data: {cl.postName}'s age is {cl.postName}";

                // For something complex I need to return JSON data
                var response = new { 
                    name = "Harsimran",
                    count= countChar

                };
                return response; // JSON data object

            });

            // AJAX Calls

            app.Run();  // Running your app
        }

        record class ClientData (string postName, string postAge);
        // class keyword is optional here
    }
}
