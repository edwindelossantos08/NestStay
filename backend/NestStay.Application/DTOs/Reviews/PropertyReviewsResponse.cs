namespace NestStay.Application.DTOs.Reviews;

public class PropertyReviewsResponse
{
    public int PropertyId { get; set; }
    public string PropertyTitle { get; set; } = null!;
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public List<ReviewResponse> Reviews { get; set; } = [];
}
