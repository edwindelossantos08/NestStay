using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NestStay.Application.Interfaces.Services;

namespace NestStay.Infrastructure.Services;

public class BrevoEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<BrevoEmailService> _logger;

    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public BrevoEmailService(HttpClient httpClient, IConfiguration configuration, ILogger<BrevoEmailService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        _apiKey = _configuration["Brevo:ApiKey"]!;
        _fromEmail = _configuration["Brevo:FromEmail"]!;
        _fromName = _configuration["Brevo:FromName"]!;
    }

    public async Task SendConfirmationEmailAsync(string toEmail, string userName, string confirmationToken)
    {
        try
        {
            var confirmUrl = $"http://localhost:5173/confirm-account?token={confirmationToken}";
            var subject = "Confirma tu cuenta en NestStay";
            var html = $"""
                <div style="font-family:sans-serif;max-width:600px;margin:auto">
                  <h2>¡Bienvenido a NestStay, {userName}!</h2>
                  <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:</p>
                  <a href="{confirmUrl}"
                     style="display:inline-block;padding:12px 24px;background:#FF5A5F;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold">
                    Confirmar cuenta
                  </a>
                  <p style="margin-top:16px;color:#666;font-size:13px">
                    Este enlace expira en 24 horas. Si no creaste esta cuenta, ignora este mensaje.
                  </p>
                </div>
                """;

            await SendEmailAsync(toEmail, userName, subject, html);
        }
        catch (Exception ex)
        {
            // Nunca lanzar excepción desde el servicio de email
            _logger.LogError(ex, "Error al enviar correo de confirmación a {Email}", toEmail);
        }
    }

    public async Task SendBookingCreatedEmailAsync(string toEmail, string hostName, string propertyTitle, DateOnly checkIn, DateOnly checkOut)
    {
        try
        {
            var subject = "Reserva confirmada en NestStay";
            var html = $"""
                <div style="font-family:sans-serif;max-width:600px;margin:auto">
                  <h2>¡Tu reserva ha sido confirmada!</h2>
                  <p>Hola <strong>{hostName}</strong>, tu reserva para <strong>{propertyTitle}</strong> está confirmada.</p>
                  <ul>
                    <li><strong>Check-in:</strong> {checkIn:dd/MM/yyyy}</li>
                    <li><strong>Check-out:</strong> {checkOut:dd/MM/yyyy}</li>
                  </ul>
                  <p>¡Esperamos que disfrutes tu estadía!</p>
                </div>
                """;

            await SendEmailAsync(toEmail, hostName, subject, html);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar correo de reserva creada a {Email}", toEmail);
        }
    }

    public async Task SendBookingCancelledEmailAsync(string toEmail, string userName, string propertyTitle)
    {
        try
        {
            var subject = "Tu reserva ha sido cancelada";
            var html = $"""
                <div style="font-family:sans-serif;max-width:600px;margin:auto">
                  <h2>Reserva cancelada</h2>
                  <p>Hola <strong>{userName}</strong>, tu reserva para <strong>{propertyTitle}</strong> ha sido cancelada.</p>
                  <p>Si tienes alguna duda, contáctanos.</p>
                </div>
                """;

            await SendEmailAsync(toEmail, userName, subject, html);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar correo de reserva cancelada a {Email}", toEmail);
        }
    }

    public async Task SendBookingCompletedEmailAsync(string toEmail, string guestName, string propertyTitle)
    {
        try
        {
            var subject = "¡Tu estadía ha finalizado!";
            var html = $"""
                <div style="font-family:sans-serif;max-width:600px;margin:auto">
                  <h2>Gracias por hospedarte en NestStay</h2>
                  <p>Hola <strong>{guestName}</strong>, esperamos que hayas disfrutado tu estadía en <strong>{propertyTitle}</strong>.</p>
                  <p>¡Tu opinión es importante! No olvides dejar una reseña.</p>
                </div>
                """;

            await SendEmailAsync(toEmail, guestName, subject, html);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar correo de estadía completada a {Email}", toEmail);
        }
    }

    private async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlContent)
    {
        var payload = new
        {
            sender = new { name = _fromName, email = _fromEmail },
            to = new[] { new { email = toEmail, name = toName } },
            subject,
            htmlContent
        };

        var json = JsonSerializer.Serialize(payload);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", _apiKey);
        request.Content = content;

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
}
