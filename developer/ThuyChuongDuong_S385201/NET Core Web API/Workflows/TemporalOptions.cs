namespace TasksApi.Workflows;

public sealed class TemporalOptions
{
    public const string SectionName = "Temporal";

    public string TargetHost { get; init; } = "localhost:7233";
    public string Namespace { get; init; } = "default";
    public string TaskQueue { get; init; } = "tasks-email";
}
