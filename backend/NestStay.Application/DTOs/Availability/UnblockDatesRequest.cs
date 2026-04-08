namespace NestStay.Application.DTOs.Availability;

public class UnblockDatesRequest
{
    public List<DateOnly> Dates { get; set; } = new();
}
