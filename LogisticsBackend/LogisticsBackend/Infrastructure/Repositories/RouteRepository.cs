using LogisticsBackend.Application.Interfaces.Repository;
using LogisticsBackend.Domain.Entities;
using LogisticsBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Route = LogisticsBackend.Domain.Entities.Route;

namespace LogisticsBackend.Infrastructure.Repositories;

public class RouteRepository : IRouteRepository
{
    private readonly AppDbContext _dbContext;

    public RouteRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ICollection<Route>> GetAllRoutesDB()
    {
        var routes = await _dbContext.Routes
            .Include(r => r.Driver)
            .Include(r => r.Vehicle)
            .Include(r => r.Stops)
            .AsNoTracking()
            .ToListAsync();
            
        foreach(var route in routes)
        {
            route.Stops = route.Stops.OrderBy(s => s.StopNumber).ToList();
        }
        return routes;
    }

    public async Task<Route> GetRouteByIdDB(int routeId)
    {
        var route = await _dbContext.Routes
            .Include(r => r.Driver)
            .Include(r => r.Vehicle)
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.Id == routeId);

        if (route != null)
        {
            route.Stops = route.Stops.OrderBy(s => s.StopNumber).ToList();
        }

        return route ?? throw new KeyNotFoundException($"Route with ID {routeId} not found");
    }

    public async Task<int> CreateRouteDB(Route route)
    {
        await _dbContext.Routes.AddAsync(route);
        return await _dbContext.SaveChangesAsync();
    }

    public async Task<int> UpdateRouteDB(Route route)
    {
        var existingRoute = await _dbContext.Routes
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.Id == route.Id);

        if (existingRoute == null)
            return 0;

        existingRoute.RouteNumber = route.RouteNumber;
        existingRoute.DriverId = route.DriverId;
        existingRoute.VehicleId = route.VehicleId;
        existingRoute.Status = route.Status;
        existingRoute.EstimatedDistance = route.EstimatedDistance;
        existingRoute.StartTime = route.StartTime;
        existingRoute.EndTime = route.EndTime;
        existingRoute.Notes = route.Notes;

        foreach (var stop in route.Stops)
        {
            var existingStop = existingRoute.Stops.FirstOrDefault(s => s.Id == stop.Id && s.Id != 0);
            if (existingStop != null)
            {
                existingStop.StopNumber = stop.StopNumber;
                existingStop.LocationName = stop.LocationName;
                existingStop.ExpectedArrival = stop.ExpectedArrival;
                existingStop.ActualArrival = stop.ActualArrival;
                existingStop.Status = stop.Status;
                existingStop.Notes = stop.Notes;
            }
            else if (stop.Id == 0)
            {
                existingRoute.Stops.Add(stop);
            }
        }

        var stopIdsToKeep = route.Stops.Where(s => s.Id != 0).Select(s => s.Id).ToList();
        var stopsToRemove = existingRoute.Stops.Where(s => s.Id != 0 && !stopIdsToKeep.Contains(s.Id)).ToList();
        foreach (var stopToRemove in stopsToRemove)
        {
            _dbContext.RouteStops.Remove(stopToRemove);
        }

        _dbContext.Routes.Update(existingRoute);
        return await _dbContext.SaveChangesAsync();
    }

    public async Task<string> BulkImportOfRouteDB(Route[] routes)
    {
        if (routes == null || routes.Length == 0)
            return "No routes to import";

        try
        {
            await _dbContext.Routes.AddRangeAsync(routes);
            var savedCount = await _dbContext.SaveChangesAsync();
            return $"Successfully imported {savedCount} routes";
        }
        catch (Exception ex)
        {
            return $"Error importing routes: {ex.Message}";
        }
    }

    public async Task<bool> DeleteRouteDB(int routeId)
    {
        var route = await _dbContext.Routes
            .Include(r => r.Stops)
            .FirstOrDefaultAsync(r => r.Id == routeId);

        if (route == null)
            return false;

        _dbContext.Routes.Remove(route);
        return await _dbContext.SaveChangesAsync() > 0;
    }
}