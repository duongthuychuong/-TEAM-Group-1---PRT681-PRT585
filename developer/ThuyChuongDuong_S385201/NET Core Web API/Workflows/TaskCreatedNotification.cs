namespace TasksApi.Workflows;

public sealed record TaskCreatedNotification(
    Guid TaskId,
    string Title,
    string Description,
    DateTime CreatedAtUtc,
    string Recipient);
