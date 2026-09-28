using Temporalio.Common;
using Temporalio.Workflows;

namespace TasksApi.Workflows;

[Workflow]
public sealed class TaskCreatedEmailWorkflow
{
    [WorkflowRun]
    public async Task RunAsync(TaskCreatedNotification notification)
    {
        Workflow.Logger.LogInformation(
            "Starting task-created notification workflow for task {TaskId}",
            notification.TaskId);

        await Workflow.ExecuteActivityAsync(
            (EmailActivities activities) => activities.SendTaskCreatedEmailAsync(notification),
            new ActivityOptions
            {
                StartToCloseTimeout = TimeSpan.FromSeconds(30),
                RetryPolicy = new RetryPolicy
                {
                    InitialInterval = TimeSpan.FromSeconds(2),
                    BackoffCoefficient = 2,
                    MaximumInterval = TimeSpan.FromSeconds(30),
                    MaximumAttempts = 5
                }
            });
    }
}
