namespace NestStay.Application.DTOs.Availability;

public class AvailabilityCheckResponse
{
    public bool IsAvailable { get; set; }
    // Fechas que causan el conflicto — útil para dar feedback claro al guest
    public List<DateOnly> ConflictingDates { get; set; } = new();
}
