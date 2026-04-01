namespace NestStay.Domain.Entities;

public class BlockedDate
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public DateOnly Date { get; set; }

    public Property Property { get; set; } = null!;
}
