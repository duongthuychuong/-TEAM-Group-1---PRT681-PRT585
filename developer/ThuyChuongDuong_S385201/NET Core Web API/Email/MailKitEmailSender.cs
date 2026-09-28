using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using TasksApi.Workflows;

namespace TasksApi.Email;

public sealed class MailKitEmailSender(
    IOptions<SmtpOptions> smtpOptions,
    ILogger<MailKitEmailSender> logger) : IEmailSender
{
    private readonly SmtpOptions _smtpOptions = smtpOptions.Value;

    public async Task SendTaskCreatedAsync(
        TaskCreatedNotification notification,
        CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_smtpOptions.FromName, _smtpOptions.FromAddress));
        message.To.Add(MailboxAddress.Parse(notification.Recipient));
        message.Subject = $"Task created: {notification.Title}";
        message.Body = new TextPart("plain")
        {
            Text = $"""
                A new Taskflow item was created.

                Title: {notification.Title}
                Description: {notification.Description}
                Task ID: {notification.TaskId}
                Created (UTC): {notification.CreatedAtUtc:O}
                """
        };

        using var smtpClient = new SmtpClient();
        var socketOptions = _smtpOptions.UseSsl
            ? SecureSocketOptions.Auto
            : SecureSocketOptions.None;

        logger.LogInformation(
            "Sending task notification {TaskId} through SMTP host {SmtpHost}:{SmtpPort}",
            notification.TaskId,
            _smtpOptions.Host,
            _smtpOptions.Port);

        await smtpClient.ConnectAsync(
            _smtpOptions.Host,
            _smtpOptions.Port,
            socketOptions,
            cancellationToken);

        if (!string.IsNullOrWhiteSpace(_smtpOptions.Username))
        {
            await smtpClient.AuthenticateAsync(
                _smtpOptions.Username,
                _smtpOptions.Password,
                cancellationToken);
        }

        await smtpClient.SendAsync(message, cancellationToken);
        await smtpClient.DisconnectAsync(true, cancellationToken);

        logger.LogInformation("Sent task notification {TaskId}", notification.TaskId);
    }
}
