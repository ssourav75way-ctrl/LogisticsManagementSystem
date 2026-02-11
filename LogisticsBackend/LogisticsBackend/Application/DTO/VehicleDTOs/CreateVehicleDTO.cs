using System.ComponentModel.DataAnnotations;

namespace LogisticsBackend.Application.DTO.VehicleDTOs;

public class CreateVehicleDTO
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string VehicleType { get; set; } = string.Empty;

    public string? Status { get; set; } = "Idle";
    
    public string? Location { get; set; }
}
