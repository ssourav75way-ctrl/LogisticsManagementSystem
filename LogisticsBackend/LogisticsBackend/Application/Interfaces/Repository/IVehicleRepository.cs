using LogisticsBackend.Domain.Entities;

namespace LogisticsBackend.Application.Interfaces.Repository;

public interface IVehicleRepository
{
    public Task<ICollection<Vehicle>> GetVehiclesDB();
    public Task<ICollection<Vehicle>> GetHighlightedVehiclesDB();
    public Task<int> CreateVehicleDB(Vehicle vehicle);
    public Task<int> AssignVehicleDB(Vehicle vehicle);
}

