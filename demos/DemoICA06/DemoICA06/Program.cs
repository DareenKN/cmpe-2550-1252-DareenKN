var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true));
app.UseDeveloperExceptionPage();

app.MapGet("/", () => "Hello World!");
app.MapGet("/somePage", () => "This is at another URL");
app.MapGet("/register", (string name, string color, int age)
                        => $"{name}'s favourite colour is {color} and is {age} years old.");

app.MapPost("/registerPost", (Info inputData) =>
{
    return Results.Ok(new { output = $"{inputData.name}'s favourite colour is {inputData.color} and is {inputData.age} years old." });
});
app.Run();

record Info(string name, string color, int age);