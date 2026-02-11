using System.ComponentModel.DataAnnotations;
using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Domain.Entities;

public class Stop:BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int RouteId { get; set; }
    public Route Route { get; set; } = null!;

    public int StopNumber { get; set; }

    [Required]
    public string LocationName { get; set; } = null!;

    public DateTime ExpectedArrival { get; set; }
    public DateTime? ActualArrival { get; set; }

    [Required]
    public StopStatus Status { get; set; } = StopStatus.Pending;

    public string? Notes { get; set; }
    
}