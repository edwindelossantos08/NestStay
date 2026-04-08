namespace NestStay.Application.DTOs.Availability;

public class BlockDatesRequest
{
    public List<DateOnly> Dates { get; set; } = new();
}
