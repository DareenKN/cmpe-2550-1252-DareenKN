using ICA09_DareenKN.Classes;
using static ICA09_DareenKN.Classes.ClassTrakDAC;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ICA09_DareenKN
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            var app = builder.Build();

            app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true));


            app.MapGet("/EFStudents", () =>
            {
                var students = ClassTrakDAC.GetEFStudents();
                string message = $"Retrieved {students.Count} student(s)";
                return Results.Ok(new { StudentsEF = students, message = message });
            });

            app.MapGet("/StudentClassInfo", (int stid) =>
            {
                List<List<string>> StudClassInfo = ClassTrakDAC.GetStudentClassInfo(stid);
                string message = "";
                string error = "";
                if (StudClassInfo.Count == 0)
                    error = "No classes where retrieved";
                else
                    message = $"Retrieved {StudClassInfo.Count} class(es)";

                return Results.Ok(new { StudClassInfo = StudClassInfo, message = message, error = error });
            });

            app.MapDelete("/DeleteStudent/{id}", (int id) =>
            {
                int success = ClassTrakDAC.DeleteStudent(id);

                Console.WriteLine(success);
                string error = "";
                string message = "";
                if (success == -1)
                    error = "An Error occurred, student was not successfully deleted";
                else
                    message = $"Student was successfully deleted";
                return Results.Ok(new { message = message, error = error });
            });

            app.Run();
        }
    }
}
