using System.Diagnostics;
using Exceptionless;
using MailKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using MimeKit;
using TasksApi.Data;
using TasksApi.Email;
using TasksApi.Health;
using TasksApi.Models;
using TasksApi.Workflows;
using Temporalio.Client;
using Temporalio.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
var connectionString = Environment.GetEnvironmentVariable("TASKS_CONNECTION_STRING")
    ?? "Server=localhost,1433;Database=TasksDb;User Id=sa;Password=TaskManager!Dev123;TrustServerCertificate=True;";
var temporalOptions = builder.Configuration
    .GetSection(TemporalOptions.SectionName)
    .Get<TemporalOptions>() ?? new TemporalOptions();
var exceptionlessApiKey = builder.Configuration["Exceptionless:ApiKey"];

if (string.IsNullOrWhiteSpace(temporalOptions.TargetHost)
    || string.IsNullOrWhiteSpace(temporalOptions.Namespace)
    || string.IsNullOrWhiteSpace(temporalOptions.TaskQueue))
{
    throw new InvalidOperationException("Temporal TargetHost, Namespace, and TaskQueue must be configured.");
}

builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(options =>
{
    options.IncludeScopes = false;
    options.SingleLine = true;
    options.TimestampFormat = "yyyy-MM-ddTHH:mm:ss.fffZ ";
    options.UseUtcTimestamp = true;
});
builder.Logging.AddSeq(builder.Configuration.GetSection("Seq"));

if (!string.IsNullOrWhiteSpace(exceptionlessApiKey))
{
    builder.AddExceptionless(configuration =>
    {
        configuration.ApiKey = exceptionlessApiKey;
        var serverUrl = builder.Configuration["Exceptionless:ServerUrl"];
        if (!string.IsNullOrWhiteSpace(serverUrl))
        {
            configuration.ServerUrl = serverUrl;
        }

        configuration.IncludePrivateInformation = builder.Configuration
            .GetValue("Exceptionless:IncludePrivateInformation", false);
    });
}

if (builder.Environment.IsDevelopment())
{
    await EnsureDatabaseExists(connectionString);
}

builder.Services.AddDbContext<TasksDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddProblemDetails(options => options.CustomizeProblemDetails = context =>
    context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier);
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"])
    .AddCheck<DatabaseHealthCheck>("database", tags: ["ready"]);
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection(SmtpOptions.SectionName));
builder.Services.Configure<TemporalOptions>(builder.Configuration.GetSection(TemporalOptions.SectionName));
builder.Services.AddScoped<IEmailSender, MailKitEmailSender>();
builder.Services.AddHttpContextAccessor();
builder.Services
    .AddTemporalClient(temporalOptions.TargetHost, temporalOptions.Namespace);
builder.Services
    .AddHostedTemporalWorker(temporalOptions.TaskQueue)
    .AddScopedActivities<EmailActivities>()
    .AddWorkflow<TaskCreatedEmailWorkflow>();
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy => policy
    .WithOrigins("http://localhost:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();

if (!string.IsNullOrWhiteSpace(exceptionlessApiKey))
{
    app.UseExceptionless(app.Services.GetRequiredService<ExceptionlessClient>());
    app.Logger.LogInformation("Exceptionless unhandled-exception reporting is enabled");
}
else
{
    app.Logger.LogInformation(
        "Exceptionless reporting is disabled; set Exceptionless__ApiKey to enable it");
}

app.Use(async (context, next) =>
{
    var requestLogger = context.RequestServices
        .GetRequiredService<ILoggerFactory>()
        .CreateLogger("TasksApi.HttpRequest");
    var stopwatch = Stopwatch.StartNew();

    try
    {
        await next();
        requestLogger.LogInformation(
            "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {ElapsedMilliseconds} ms",
            context.Request.Method,
            context.Request.Path.Value,
            context.Response.StatusCode,
            stopwatch.Elapsed.TotalMilliseconds);
    }
    catch (Exception exception)
    {
        requestLogger.LogError(
            exception,
            "Unhandled failure for HTTP {RequestMethod} {RequestPath} after {ElapsedMilliseconds} ms",
            context.Request.Method,
            context.Request.Path.Value,
            stopwatch.Elapsed.TotalMilliseconds);
        throw;
    }
});

if (Directory.Exists(app.Environment.WebRootPath))
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.UseCors("Frontend");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TasksDbContext>();
    await db.Database.EnsureCreatedAsync();
}

app.MapHealthChecks("/health/live", new()
{
    Predicate = registration => registration.Tags.Contains("live")
});
app.MapHealthChecks("/health/ready", new()
{
    Predicate = registration => registration.Tags.Contains("ready")
});

app.MapGet("/api/tasks", async (TasksDbContext db, CancellationToken cancellationToken) =>
    Results.Ok(await db.Tasks
    .AsNoTracking()
    .OrderByDescending(task => task.CreatedAt)
    .ToListAsync(cancellationToken)));

app.MapPost("/api/tasks", async (
    CreateTaskRequest request,
    TasksDbContext db,
    ITemporalClient temporalClient,
    IOptions<TemporalOptions> temporalConfiguration,
    IConfiguration configuration,
    ILoggerFactory loggerFactory,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { message = "Title is required." });
    }

    var recipient = request.NotificationEmail?.Trim()
        ?? configuration["Notifications:Recipient"]?.Trim();
    if (string.IsNullOrWhiteSpace(recipient) || !MailboxAddress.TryParse(recipient, out _))
    {
        return Results.BadRequest(new
        {
            message = "A valid notification email address is required."
        });
    }

    var task = new TaskItem
    {
        Title = request.Title.Trim(),
        Description = request.Description?.Trim() ?? string.Empty
    };
    db.Tasks.Add(task);
    await db.SaveChangesAsync(cancellationToken);

    var workflowId = $"task-created-email-{task.Id:N}";
    await temporalClient.StartWorkflowAsync(
        (TaskCreatedEmailWorkflow workflow) => workflow.RunAsync(new TaskCreatedNotification(
            task.Id,
            task.Title,
            task.Description,
            task.CreatedAt,
            recipient)),
        new(id: workflowId, taskQueue: temporalConfiguration.Value.TaskQueue));

    loggerFactory.CreateLogger("TasksApi.Tasks").LogInformation(
        "Created task {TaskId} and started notification workflow {WorkflowId}",
        task.Id,
        workflowId);

    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapPut("/api/tasks/{id:guid}", async (
    Guid id,
    UpdateTaskRequest request,
    TasksDbContext db,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { message = "Title is required." });
    }

    var task = await db.Tasks.FindAsync([id], cancellationToken);
    if (task is null)
    {
        return Results.NotFound();
    }

    task.Title = request.Title.Trim();
    task.Description = request.Description?.Trim() ?? string.Empty;
    task.IsCompleted = request.IsCompleted;
    await db.SaveChangesAsync(cancellationToken);

    return Results.Ok(task);
});

app.MapDelete("/api/tasks/{id:guid}", async (
    Guid id,
    TasksDbContext db,
    CancellationToken cancellationToken) =>
{
    var task = await db.Tasks.FindAsync([id], cancellationToken);
    if (task is null)
    {
        return Results.NotFound();
    }

    db.Tasks.Remove(task);
    await db.SaveChangesAsync(cancellationToken);
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
public sealed record CreateTaskRequest(
    string? Title,
    string? Description,
    string? NotificationEmail = null);
public sealed record UpdateTaskRequest(string? Title, string? Description, bool IsCompleted);
