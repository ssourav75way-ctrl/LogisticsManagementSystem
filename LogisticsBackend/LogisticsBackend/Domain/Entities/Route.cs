using System.ComponentModel.DataAnnotations;
using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Domain.Entities;

public class Route :BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string RouteNumber { get; set; } = null!;

    
    [Required]
    public int DriverId { get; set; }
    public User Driver { get; set; } = null!;

    [Required]
    public int  VehicleId { get; set; }
    public Vehicle Vehicle { get; set; } = null!;

    [Required]
    public RouteStatus Status { get; set; } = RouteStatus.Created;

    public double? EstimatedDistance { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

 
    public string? Notes { get; set; }
    
    public ICollection<Stop> Stops { get; set; } = new List<Stop>();

    public ICollection<OperationalLogs> Logs { get; set; } = new List<OperationalLogs>();}