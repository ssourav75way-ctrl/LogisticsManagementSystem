namespace LogisticsBackend.Application.DTO.RouteDTO_s;

public class BulkRouteUploadResponseDTO
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
    public int TotalRows { get; set; }
    public int SuccessfulRows { get; set; }
    public int FailedRows { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<RouteAssignmentSummary> Summary { get; set; } = new();
}

public class RouteAssignmentSummary
{
    public string RouteNumber { get; set; } = null!;
    public string DriverName { get; set; } = null!;
    public string VehicleNumber { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = null!;
}
