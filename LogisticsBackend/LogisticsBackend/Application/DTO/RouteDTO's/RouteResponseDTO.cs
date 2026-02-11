using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Application.DTO.RouteDTO_s;

public class RouteResponseDTO
{
    public int Id { get; set; }
    public string RouteNumber { get; set; } = null!;
    public int DriverId { get; set; }
    public string DriverName { get; set; } = null!;
    public int VehicleId { get; set; }
    public string VehicleNumber { get; set; } = null!;
    public RouteStatus Status { get; set; }
    public double? EstimatedDistance { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Notes { get; set; }
    public List<StopDTO> Stops { get; set; } = new List<StopDTO>();
    public int StopsCount { get; set; }
}
