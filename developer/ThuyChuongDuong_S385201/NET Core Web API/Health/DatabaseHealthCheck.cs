using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using TasksApi.Data;

namespace TasksApi.Health;

public sealed class DatabaseHealthCheck(IServiceScopeFactory scopeFactory) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<TasksDbContext>();
            return await db.Database.CanConnectAsync(cancellationToken)
                ? HealthCheckResult.Healthy("The tasks database is reachable.")
                : HealthCheckResult.Unhealthy("The tasks database is unreachable.");
        }
        catch (Exception exception)
        {
            return HealthCheckResult.Unhealthy(
                "The tasks database health check failed.",
                exception);
        }
    }
}
