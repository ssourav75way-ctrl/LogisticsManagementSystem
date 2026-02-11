using LogisticsBackend.Application.Interfaces.Repository;
using LogisticsBackend.Domain.Entities;
using LogisticsBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsBackend.Infrastructure.Repositories;

public class VehicleRepository:IVehicleRepository
{
        private readonly AppDbContext _dbContext;

        public VehicleRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ICollection<Vehicle>>  GetVehiclesDB()
        {
            return await _dbContext.Vehicles
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ICollection<Vehicle>> GetHighlightedVehiclesDB()
        {
            return await _dbContext.Vehicles
                .AsNoTracking()
                .Where(v => v.Status == "Maintenance" || v.Status == "Idle")
                .ToListAsync();
        }

        public async Task<int> CreateVehicleDB(Vehicle vehicle)
        {
            await _dbContext.Vehicles.AddAsync(vehicle);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> AssignVehicleDB(Vehicle vehicle)
        {
            var existingVehicle = await _dbContext.Vehicles
                .FirstOrDefaultAsync(v => v.Id == vehicle.Id);

            if (existingVehicle == null)
                return 0;

            existingVehicle.Status = vehicle.Status; 
            existingVehicle.Location = vehicle.Location;

            _dbContext.Vehicles.Update(existingVehicle);
            return await _dbContext.SaveChangesAsync();
        }
    }
