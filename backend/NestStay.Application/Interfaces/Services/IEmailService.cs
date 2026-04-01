namespace NestStay.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendConfirmationEmailAsync(string toEmail, string userName, string confirmationToken);
    Task SendBookingCreatedEmailAsync(string toEmail, string hostName, string propertyTitle, DateOnly checkIn, DateOnly checkOut);
    Task SendBookingCancelledEmailAsync(string toEmail, string userName, string propertyTitle);
    Task SendBookingCompletedEmailAsync(string toEmail, string guestName, string propertyTitle);
}
