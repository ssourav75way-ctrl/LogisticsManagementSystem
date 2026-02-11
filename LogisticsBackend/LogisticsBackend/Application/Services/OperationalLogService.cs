using LogisticsBackend.Application.DTO.LogDTOs;
using LogisticsBackend.Application.Interfaces.Services;
using LogisticsBackend.Domain.Entities;
using LogisticsBackend.Domain.Enums;
using LogisticsBackend.Hubs;
using LogisticsBackend.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LogisticsBackend.Application.Services;

public class OperationalLogService : IOperationalLogService
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<LogHub> _hubContext;

    public OperationalLogService(AppDbContext dbContext, IHubContext<LogHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    public async Task LogEventAsync(int routeId, RouteStatusType eventType, string? description = null)
    {
        var route = await _dbContext.Routes
            .Include(r => r.Driver)
            .Include(r => r.Vehicle)
            .FirstOrDefaultAsync(r => r.Id == routeId);

        if (route == null) return;

        var log = new OperationalLogs
        {
            RouteId = route.Id,
            VehicleId = route.VehicleId,
            DriverId = route.DriverId,
            EventType = eventType,
            Description = description,
            EventTime = DateTime.UtcNow
        };

        _dbContext.OperationalLogs.Add(log);
        await _dbContext.SaveChangesAsync();

        var logDto = new LogResponseDTO
        {
            Id = log.Id,
            RouteId = log.RouteId,
            RouteNumber = route.RouteNumber,
            VehicleId = log.VehicleId,
            VehicleNumber = route.Vehicle?.Name ?? "Unknown",
            DriverId = log.DriverId,
            DriverName = route.Driver?.Name ?? "Unknown",
            EventType = log.EventType,
            Description = log.Description,
            EventTime = log.EventTime
        };

        await _hubContext.Clients.All.SendAsync("ReceiveLog", logDto);
        
        await _hubContext.Clients.Group($"Vehicle_{log.VehicleId}").SendAsync("ReceiveLog", logDto);
        await _hubContext.Clients.Group($"Driver_{log.DriverId}").SendAsync("ReceiveLog", logDto);
        await _hubContext.Clients.Group($"Route_{log.RouteId}").SendAsync("ReceiveLog", logDto);
    }

    public async Task<List<LogResponseDTO>> GetLogsAsync(int? vehicleId = null, int? driverId = null, int? routeId = null)
    {
        var query = _dbContext.OperationalLogs
            .Include(l => l.Route)
            .Include(l => l.Vehicle)
            .Include(l => l.Driver)
            .AsQueryable();

        if (vehicleId.HasValue)
            query = query.Where(l => l.VehicleId == vehicleId.Value);
        
        if (driverId.HasValue)
            query = query.Where(l => l.DriverId == driverId.Value);
            
        if (routeId.HasValue)
            query = query.Where(l => l.RouteId == routeId.Value);

        return await query
            .OrderByDescending(l => l.EventTime)
            .Select(l => new LogResponseDTO
            {
                Id = l.Id,
                RouteId = l.RouteId,
                RouteNumber = l.Route.RouteNumber,
                VehicleId = l.VehicleId,
                VehicleNumber = l.Vehicle.Name,
                DriverId = l.DriverId,
                DriverName = l.Driver.Name,
                EventType = l.EventType,
                Description = l.Description,
                EventTime = l.EventTime
            })
            .ToListAsync();
    }
}
