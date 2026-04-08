namespace NestStay.Application.DTOs.Bookings;

public class CreateBookingRequest
{
    public int PropertyId { get; set; }
    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }
}
