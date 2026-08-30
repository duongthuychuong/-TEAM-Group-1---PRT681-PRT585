using Microsoft.Data.Sqlite;

string dbPath = Path.Combine(
    AppContext.BaseDirectory,
    "tasks.db"
);
var connectionString = $"Data Source={dbPath}";

using var connection = new SqliteConnection(connectionString);
connection.Open();

InitializeDatabase(connection);

while (true)
{
    Console.WriteLine();
    Console.WriteLine("TASK MANAGER");
    Console.WriteLine("1. Add Task");
    Console.WriteLine("2. View Tasks");
    Console.WriteLine("3. Update Task");
    Console.WriteLine("4. Delete Task");
    Console.WriteLine("5. Exit");
    Console.Write("Choose an option: ");

    var choice = Console.ReadLine();

    switch (choice)
    {
        case "1":
            AddTask(connection);
            break;
        case "2":
            ViewTasks(connection);
            break;
        case "3":
            UpdateTask(connection);
            break;
        case "4":
            DeleteTask(connection);
            break;
        case "5":
            Console.WriteLine("Goodbye!");
            return;
        default:
            Console.WriteLine("Invalid option. Please try again.");
            break;
    }
}

static void InitializeDatabase(SqliteConnection connection)
{
    var command = connection.CreateCommand();
    command.CommandText = @"
        CREATE TABLE IF NOT EXISTS Tasks (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Title TEXT NOT NULL,
            Description TEXT,
            IsCompleted INTEGER NOT NULL DEFAULT 0,
            CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );";

    command.ExecuteNonQuery();
    Console.WriteLine($"Database ready at: {connection.DataSource}");
}

static void AddTask(SqliteConnection connection)
{
    Console.Write("Enter task title: ");
    var title = Console.ReadLine();

    Console.Write("Enter task description: ");
    var description = Console.ReadLine();

    if (string.IsNullOrWhiteSpace(title))
    {
        Console.WriteLine("Title cannot be empty.");
        return;
    }

    var command = connection.CreateCommand();
    command.CommandText = @"
        INSERT INTO Tasks (Title, Description, IsCompleted)
        VALUES (@title, @description, 0);";

    command.Parameters.AddWithValue("@title", title);
    command.Parameters.AddWithValue("@description", description ?? string.Empty);
    command.ExecuteNonQuery();

    Console.WriteLine("Task added successfully.");
}

static void ViewTasks(SqliteConnection connection)
{
    var command = connection.CreateCommand();
    command.CommandText = @"
        SELECT Id, Title, Description, IsCompleted, CreatedAt
        FROM Tasks
        ORDER BY CreatedAt DESC;";

    using var reader = command.ExecuteReader();

    var hasRows = false;
    while (reader.Read())
    {
        hasRows = true;
        var id = reader.GetInt32(0);
        var title = reader.GetString(1);
        var description = reader.IsDBNull(2) ? "" : reader.GetString(2);
        var isCompleted = reader.GetInt32(3) == 1;
        var createdAt = reader.GetString(4);

        Console.WriteLine($"[{id}] {title} | Completed: {(isCompleted ? "Yes" : "No")} | {createdAt}");
        if (!string.IsNullOrWhiteSpace(description))
        {
            Console.WriteLine($"    {description}");
        }
    }

    if (!hasRows)
    {
        Console.WriteLine("No tasks found.");
    }
}

static void UpdateTask(SqliteConnection connection)
{
    Console.Write("Enter task ID to update: ");
    var taskIdText = Console.ReadLine();

    if (!int.TryParse(taskIdText, out var taskId))
    {
        Console.WriteLine("Invalid ID.");
        return;
    }

    Console.Write("New title (leave blank to keep current): ");
    var newTitle = Console.ReadLine();

    Console.Write("New description (leave blank to keep current): ");
    var newDescription = Console.ReadLine();

    Console.Write("Mark as completed? (y/n): ");
    var completedInput = Console.ReadLine();
    var isCompleted = completedInput?.Trim().Equals("y", StringComparison.OrdinalIgnoreCase) == true;

    var command = connection.CreateCommand();
    command.CommandText = @"
        UPDATE Tasks
        SET Title = COALESCE(NULLIF(@title, ''), Title),
            Description = COALESCE(NULLIF(@description, ''), Description),
            IsCompleted = @isCompleted
        WHERE Id = @id;";

    command.Parameters.AddWithValue("@title", newTitle ?? string.Empty);
    command.Parameters.AddWithValue("@description", newDescription ?? string.Empty);
    command.Parameters.AddWithValue("@isCompleted", isCompleted ? 1 : 0);
    command.Parameters.AddWithValue("@id", taskId);

    var rows = command.ExecuteNonQuery();
    Console.WriteLine(rows > 0 ? "Task updated successfully." : "No task found with that ID.");
}

static void DeleteTask(SqliteConnection connection)
{
    Console.Write("Enter task ID to delete: ");
    var taskIdText = Console.ReadLine();

    if (!int.TryParse(taskIdText, out var taskId))
    {
        Console.WriteLine("Invalid ID.");
        return;
    }

    var command = connection.CreateCommand();
    command.CommandText = "DELETE FROM Tasks WHERE Id = @id;";
    command.Parameters.AddWithValue("@id", taskId);

    var rows = command.ExecuteNonQuery();
    Console.WriteLine(rows > 0 ? "Task deleted successfully." : "No task found with that ID.");
}
