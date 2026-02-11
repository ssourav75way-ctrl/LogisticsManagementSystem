using System.ComponentModel.DataAnnotations;
using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Application.DTO.RouteDTO_s;

public class StopDTO
{
    public int Id { get; set; }
    public int StopNumber { get; set; }
    [Required]
    public string LocationName { get; set; } = null!;
    public DateTime ExpectedArrival { get; set; }
    public DateTime? ActualArrival { get; set; }
    public StopStatus Status { get; set; }
    public string? Notes { get; set; }
}
