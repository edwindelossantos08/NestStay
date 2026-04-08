namespace NestStay.Application.DTOs.Availability;

public class AvailabilityResponse
{
    public int PropertyId { get; set; }
    public List<DateOnly> BlockedDates { get; set; } = new();
    // Fechas de reservas con estado Confirmed
    public List<DateOnly> BookedDates { get; set; } = new();
    // Todas las fechas del mes que no están bloqueadas ni reservadas
    public List<DateOnly> AvailableDates { get; set; } = new();
}
