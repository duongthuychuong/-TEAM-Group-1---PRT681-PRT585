using TasksApi.Email;
using Temporalio.Activities;

namespace TasksApi.Workflows;

public sealed class EmailActivities(IEmailSender emailSender, ILogger<EmailActivities> logger)
{
    [Activity]
    public async Task SendTaskCreatedEmailAsync(TaskCreatedNotification notification)
    {
        var context = ActivityExecutionContext.Current;

        logger.LogInformation(
            "Executing email activity for task {TaskId}; Temporal attempt {Attempt}",
            notification.TaskId,
            context.Info.Attempt);

        await emailSender.SendTaskCreatedAsync(notification, context.CancellationToken);
    }
}
