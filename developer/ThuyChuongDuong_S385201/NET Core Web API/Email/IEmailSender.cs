using TasksApi.Workflows;

namespace TasksApi.Email;

public interface IEmailSender
{
    Task SendTaskCreatedAsync(TaskCreatedNotification notification, CancellationToken cancellationToken);
}
