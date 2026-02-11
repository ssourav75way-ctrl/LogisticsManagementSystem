using LogisticsBackend.Application.DTO.RouteDTO_s;

namespace LogisticsBackend.Application.DTO.VehicleDTOs;

public class VehicleResponseDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Location { get; set; }


    public int? ActiveRouteId { get; set; }
    public string? ActiveRouteNumber { get; set; }
}
