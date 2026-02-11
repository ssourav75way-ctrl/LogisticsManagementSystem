using System.ComponentModel.DataAnnotations;
using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Domain.Entities;

public class OperationalLogs:BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int RouteId { get; set; }
    public Route Route { get; set; } = null!;

    [Required]
    public int VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;

    [Required]
    public int  DriverId { get; set; }
    public User Driver { get; set; } = null!;

    [Required]
    public RouteStatusType EventType { get; set; }

    public string? Description { get; set; }

    public DateTime EventTime { get; set; } = DateTime.UtcNow;

 
}

