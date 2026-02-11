using System.ComponentModel.DataAnnotations;

namespace LogisticsBackend.Application.DTO.VehicleDTOs;

public class UpdateVehicleStatusDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Status { get; set; } = string.Empty;

    public string? Location { get; set; }
}
