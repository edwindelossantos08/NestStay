using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using NestStay.Application.Interfaces.Services;

namespace NestStay.Infrastructure.Services;

public class GmailEmailService : IEmailService
{
    private readonly ILogger<GmailEmailService> _logger;

    private readonly string _host;
    private readonly int _port;
    private readonly string _email;
    private readonly string _password;
    private readonly string _fromName;

    public GmailEmailService(IConfiguration configuration, ILogger<GmailEmailService> logger)
    {
        _logger = logger;

        _host     = configuration["EmailSettings:Host"]!;
        _port     = int.Parse(configuration["EmailSettings:Port"]!);
        _email    = configuration["EmailSettings:Email"]!;
        _password = configuration["EmailSettings:Password"]!;
        _fromName = configuration["EmailSettings:FromName"]!;
    }

    public async Task SendConfirmationEmailAsync(string toEmail, string userName, string confirmationToken)
    {
        var subject = "Confirma tu cuenta en NestStay 🏠";
        var html = $"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1e3a5f;">🏠 NestStay</h1>
              <h2>Confirma tu cuenta</h2>
              <p>Hola <strong>{userName}</strong>,</p>
              <p>Gracias por registrarte en NestStay.
                 Haz click en el botón para confirmar tu cuenta:</p>
              <a href="http://localhost:5173/confirm-account?token={confirmationToken}"
                 style="background-color: #1e3a5f; color: white; padding: 12px 24px;
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        margin: 16px 0;">
                Confirmar mi cuenta
              </a>
              <p style="color: #888; font-size: 12px;">
                Este enlace expira en 24 horas.
              </p>
            </body>
            </html>
            """;

        await SendAsync(toEmail, userName, subject, html);
    }

    public async Task SendBookingCreatedEmailAsync(string toEmail, string hostName, string propertyTitle, DateOnly checkIn, DateOnly checkOut)
    {
        var subject = "Nueva reserva recibida — NestStay 📅";
        var html = $"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1e3a5f;">🏠 NestStay</h1>
              <h2>Nueva reserva recibida</h2>
              <p>Hola <strong>{hostName}</strong>,</p>
              <p>Has recibido una nueva reserva para tu propiedad.</p>
              <ul>
                <li><strong>Propiedad:</strong> {propertyTitle}</li>
                <li><strong>Check-in:</strong> {checkIn:dd/MM/yyyy}</li>
                <li><strong>Check-out:</strong> {checkOut:dd/MM/yyyy}</li>
              </ul>
              <p>Accede a tu panel de NestStay para más detalles.</p>
            </body>
            </html>
            """;

        await SendAsync(toEmail, hostName, subject, html);
    }

    public async Task SendBookingCancelledEmailAsync(string toEmail, string userName, string propertyTitle)
    {
        var subject = "Reserva cancelada — NestStay ❌";
        var html = $"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1e3a5f;">🏠 NestStay</h1>
              <h2>Reserva cancelada</h2>
              <p>Hola <strong>{userName}</strong>,</p>
              <p>Tu reserva para <strong>{propertyTitle}</strong> ha sido cancelada.</p>
              <p>Si tienes alguna pregunta, contáctanos.</p>
            </body>
            </html>
            """;

        await SendAsync(toEmail, userName, subject, html);
    }

    public async Task SendBookingCompletedEmailAsync(string toEmail, string guestName, string propertyTitle)
    {
        var subject = "¡Estancia completada! — NestStay ✅";
        var html = $"""
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1e3a5f;">🏠 NestStay</h1>
              <h2>¡Gracias por hospedarte con NestStay!</h2>
              <p>Hola <strong>{guestName}</strong>,</p>
              <p>Esperamos que hayas disfrutado tu estadía en <strong>{propertyTitle}</strong>.</p>
              <p>¡Tu opinión es importante! No olvides dejar una reseña.</p>
            </body>
            </html>
            """;

        await SendAsync(toEmail, guestName, subject, html);
    }

    // Centraliza toda la lógica SMTP para no repetir código en cada método público
    private async Task SendAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _email));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlBody };
            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();

            // Puerto 587 usa STARTTLS
            await client.ConnectAsync(_host, _port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_email, _password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            // Si falla el email solo loguea, nunca lanza excepción
            _logger.LogError(ex, "Error al enviar email a {Email}", toEmail);
        }
    }
}
