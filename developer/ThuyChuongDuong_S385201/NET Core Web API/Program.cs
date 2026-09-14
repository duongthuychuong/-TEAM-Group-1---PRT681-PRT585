using TasksApi.Data;
using TasksApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);
var connectionString = Environment.GetEnvironmentVariable("TASKS_CONNECTION_STRING")
    ?? "Server=localhost,1433;Database=TasksDb;User Id=sa;Password=TaskManager!Dev123;TrustServerCertificate=True;";

if (builder.Environment.IsDevelopment())
{
    await EnsureDatabaseExists(connectionString);
}

builder.Services.AddDbContext<TasksDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy => policy
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
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

app.MapPut("/api/tasks/{id:guid}", async (Guid id, UpdateTaskRequest request, TasksDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { message = "Title is required." });
    }

    var task = await db.Tasks.FindAsync(id);
    if (task is null)
    {
        return Results.NotFound();
    }

    task.Title = request.Title.Trim();
    task.Description = request.Description?.Trim() ?? string.Empty;
    task.IsCompleted = request.IsCompleted;
    await db.SaveChangesAsync();

    return Results.Ok(task);
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
    var connectionBuilder = new SqlConnectionStringBuilder(connectionString);
    var databaseName = connectionBuilder.InitialCatalog;

    if (string.IsNullOrWhiteSpace(databaseName))
    {
        throw new InvalidOperationException("The local database name is missing from the connection string.");
    }

    connectionBuilder.InitialCatalog = "master";

    await using var connection = new SqlConnection(connectionBuilder.ConnectionString);
    await connection.OpenAsync();
    await using var command = connection.CreateCommand();
    command.CommandText = """
        IF DB_ID(@databaseName) IS NULL
        BEGIN
            DECLARE @statement nvarchar(max) = N'CREATE DATABASE ' + QUOTENAME(@databaseName);
            EXEC sp_executesql @statement;
        END
        """;
    command.Parameters.AddWithValue("@databaseName", databaseName);
    await command.ExecuteNonQueryAsync();
}
public sealed record CreateTaskRequest(string? Title, string? Description);
public sealed record UpdateTaskRequest(string? Title, string? Description, bool IsCompleted);
