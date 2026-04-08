namespace NestStay.Application.DTOs.Bookings;

public class CompleteBookingResponse
{
    public int BookingId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
