using TasksApi.Data;
using TasksApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);
var connectionString = Environment.GetEnvironmentVariable("TASKS_CONNECTION_STRING")
    ?? "Server=localhost,1433;Database=TasksDb;User Id=sa;Password=TaskManager!Dev123;TrustServerCertificate=True;";

await EnsureDatabaseExists(connectionString);
builder.Services.AddDbContext<TasksDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy => policy
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();
app.UseCors("Frontend");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TasksDbContext>();
    await db.Database.EnsureCreatedAsync();
}

app.MapGet("/api/tasks", async (TasksDbContext db) => Results.Ok(await db.Tasks
    .AsNoTracking()
    .OrderByDescending(task => task.CreatedAt)
    .ToListAsync()));

app.MapPost("/api/tasks", async (CreateTaskRequest request, TasksDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { message = "Title is required." });
    }

    var task = new TaskItem
    {
        Title = request.Title.Trim(),
        Description = request.Description?.Trim() ?? string.Empty
    };
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapDelete("/api/tasks/{id:guid}", async (Guid id, TasksDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null)
    {
        return Results.NotFound();
    }

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

static async Task EnsureDatabaseExists(string connectionString)
{
    var connectionBuilder = new SqlConnectionStringBuilder(connectionString)
    {
        InitialCatalog = "master"
    };

    await using var connection = new SqlConnection(connectionBuilder.ConnectionString);
    await connection.OpenAsync();
    await using var command = connection.CreateCommand();
    command.CommandText = "IF DB_ID('TasksDb') IS NULL CREATE DATABASE TasksDb";
    await command.ExecuteNonQueryAsync();
}
public sealed record CreateTaskRequest(string? Title, string? Description);
