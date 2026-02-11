using LogisticsBackend.Application.DTO.VehicleDTOs;
using LogisticsBackend.Application.Interfaces.Repository;
using LogisticsBackend.Application.Interfaces.Services;
using LogisticsBackend.Domain.Entities;

namespace LogisticsBackend.Application.Services;

public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;

    public VehicleService(IVehicleRepository vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    public async Task<List<VehicleResponseDTO>> GetVehicles()
    {
        var vehicles = await _vehicleRepository.GetVehiclesDB();
        return vehicles.Select(MapToDTO).ToList();
    }

    public async Task<List<VehicleResponseDTO>> GetHighlightedVehicles()
    {
        var vehicles = await _vehicleRepository.GetHighlightedVehiclesDB();
        return vehicles.Select(MapToDTO).ToList();
    }

    public async Task<VehicleResponseDTO> CreateVehicle(CreateVehicleDTO dto)
    {
        var vehicle = new Vehicle
        {
            Name = dto.Name,
            VehicleType = dto.VehicleType,
            Status = dto.Status ?? "Idle",
            Location = dto.Location ?? "Warehouse",
            IsActive = "True"
        };

        await _vehicleRepository.CreateVehicleDB(vehicle);
        return MapToDTO(vehicle);
    }

    public async Task<int> UpdateVehicleStatus(UpdateVehicleStatusDTO dto)
    {
        var vehicle = new Vehicle
        {
            Id = dto.Id,
            Status = dto.Status,
            Location = dto.Location ?? "Unknown"
        };

        return await _vehicleRepository.AssignVehicleDB(vehicle);
    }

    private VehicleResponseDTO MapToDTO(Vehicle v)
    {
        var activeRoute = v.Routes?.FirstOrDefault(r => r.Status == Domain.Enums.RouteStatus.InProgress || r.Status == Domain.Enums.RouteStatus.Started);

        return new VehicleResponseDTO
        {
            Id = v.Id,
            Name = v.Name,
            VehicleType = v.VehicleType,
            Status = v.Status,
            Location = v.Location,
            ActiveRouteId = activeRoute?.Id,
            ActiveRouteNumber = activeRoute?.RouteNumber
        };
    }
}

