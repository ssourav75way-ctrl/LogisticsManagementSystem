using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Application.DTO.LogDTOs;

public class LogResponseDTO
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public string RouteNumber { get; set; } = string.Empty;
    public int VehicleId { get; set; }
   
    public int DriverId { get; set; }
    public string DriverName { get; set; } = string.Empty;
    public RouteStatusType EventType { get; set; }
    public string? Description { get; set; }
    public DateTime EventTime { get; set; }
}
