using ICA08_DareenKN.Classes;
using static ICA08_DareenKN.Classes.ClassTrakDAC;

namespace ICA08_DareenKN
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
                List<Student> students = ClassTrakDAC.GetEFStudents();
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

                return Results.Ok(new { StudClassInfo = StudClassInfo, message = message, error = error});
            });

            app.Run();
        }
    }
}
