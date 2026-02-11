using LogisticsBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LogisticsBackend.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            if (!await context.Users.AnyAsync())
            {
                var users = new List<User>
                {
                    new User { Name = "System Admin", Email = "admin@fleettrack.com", Password = "password123", Role = "ADMIN" },
                    new User { Name = "John Driver", Email = "john@driver.com", Password = "password123", Role = "DRIVER" },
                    new User { Name = "Sarah Dispatcher", Email = "sarah@dispatcher.com", Password = "password123", Role = "ADMIN" }
                };
                await context.Users.AddRangeAsync(users);
                await context.SaveChangesAsync();
            }

            if (!await context.Vehicles.AnyAsync())
            {
                var vehicles = new List<Vehicle>
                {
                    new Vehicle { Name = "T-1001", VehicleType = "Truck", Status = "Idle", Location = "Main Depot", IsActive = "true" },
                    new Vehicle { Name = "V-2002", VehicleType = "Van", Status = "Idle", Location = "North Side Depot", IsActive = "true" },
                    new Vehicle { Name = "T-1002", VehicleType = "Truck", Status = "Maintenance", Location = "Service Center", IsActive = "true" },
                    new Vehicle { Name = "V-2003", VehicleType = "Van", Status = "In Transit", Location = "Downtown", IsActive = "true" }
                };
                await context.Vehicles.AddRangeAsync(vehicles);
                await context.SaveChangesAsync();
            }
        }
    }
}
