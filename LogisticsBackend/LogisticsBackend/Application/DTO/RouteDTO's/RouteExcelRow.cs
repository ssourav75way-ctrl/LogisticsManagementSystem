namespace LogisticsBackend.Application.DTO.RouteDTO_s;

public class RouteExcelRow
{
    public string RouteNumber { get; set; } = null!;
    public int DriverId { get; set; }
    public int VehicleId { get; set; }
    public double EstimatedDistance { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Notes { get; set; }
}
