using LogisticsBackend.Application.DTO.VehicleDTOs;

namespace LogisticsBackend.Application.Interfaces.Services;

public interface IVehicleService
{
    Task<List<VehicleResponseDTO>> GetVehicles();
    Task<List<VehicleResponseDTO>> GetHighlightedVehicles();
    Task<VehicleResponseDTO> CreateVehicle(CreateVehicleDTO dto);
    Task<int> UpdateVehicleStatus(UpdateVehicleStatusDTO dto);
}