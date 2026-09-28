namespace TasksApi.Email;

public sealed class SmtpOptions
{
    public const string SectionName = "Smtp";

    public string Host { get; init; } = "localhost";
    public int Port { get; init; } = 1025;
    public bool UseSsl { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FromName { get; init; } = "Taskflow";
    public string FromAddress { get; init; } = "noreply@taskflow.local";
}
