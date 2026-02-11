using System.ComponentModel.DataAnnotations;
using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Application.DTO.RouteDTO_s;

public class UpdateRouteDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string RouteNumber { get; set; } = null!;

    [Required]
    public int DriverId { get; set; }

    [Required]
    public int VehicleId { get; set; }

    [Required]
    public RouteStatus Status { get; set; }

    public double? EstimatedDistance { get; set; }

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    public string? Notes { get; set; }
    public List<StopDTO> Stops { get; set; } = new List<StopDTO>();
}
