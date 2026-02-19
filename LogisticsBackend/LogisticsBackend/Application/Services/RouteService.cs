using LogisticsBackend.Application.DTO.RouteDTO_s;
using LogisticsBackend.Application.Interfaces.Repository;
using LogisticsBackend.Application.Interfaces.Services;
using LogisticsBackend.Domain.Entities;
using LogisticsBackend.Domain.Enums;
using MiniExcelLibs;
using Route = LogisticsBackend.Domain.Entities.Route;


namespace LogisticsBackend.Application.Services;

public class RouteService : IRouteService
{
    private readonly IRouteRepository _routeRepository;
    private readonly IAuthRepository _authRepository;
    private readonly IVehicleRepository _vehicleRepository;

    private readonly IOperationalLogService _logService;
   
    public RouteService(
        IRouteRepository routeRepository,
        IAuthRepository authRepository,
        IVehicleRepository vehicleRepository,
        IOperationalLogService logService)
    {
        _routeRepository = routeRepository;
        _authRepository = authRepository;
        _vehicleRepository = vehicleRepository;
        _logService = logService;
    }

    public async Task<List<RouteResponseDTO>> GetAllRoutesDTO()
    {
        var routes = await _routeRepository.GetAllRoutesDB();
      
        return routes.Select(MapToDTO).ToList();
    }
    
    public async Task<RouteResponseDTO?> GetRouteById(int id)
    {
        try 
        {
            var route = await _routeRepository.GetRouteByIdDB(id);
            return MapToDTO(route);
        }
        catch (KeyNotFoundException)
        {
            return null;
        }
    }

    public async Task<object> CreateRoute(CreateRouteDTO dto)
    {
        var route = new Route
        {
            RouteNumber = dto.RouteNumber,
            DriverId = dto.DriverId,
            VehicleId = dto.VehicleId,
            EstimatedDistance = dto.EstimatedDistance,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Notes = dto.Notes,
            Status = RouteStatus.Created,
            Stops = dto.Stops.Select(s => new Stop
            {
                StopNumber = s.StopNumber,
                LocationName = s.LocationName,
                ExpectedArrival = s.ExpectedArrival,
                Status = s.Status,
                Notes = s.Notes
            }).ToList()
        };

        ValidateRoute(route);
        
        var conflict = await CheckConflicts(route.DriverId, route.VehicleId, route.StartTime, route.EndTime);
        if (conflict != null)
            return new { success = false, message = conflict };

        var id = await _routeRepository.CreateRouteDB(route);

        await _authRepository.UpdateUserStatusDB(route.DriverId, "Assigned");

        var vehicle = await _vehicleRepository.GetVehiclesDB().ContinueWith(t => t.Result.FirstOrDefault(v => v.Id == route.VehicleId));
        if (vehicle != null)
        {
            vehicle.Status = "In Transit";
            await _vehicleRepository.AssignVehicleDB(vehicle);
        }

        var driver = await _authRepository.GetUserByIdDB(route.DriverId);
        var driverName = driver?.Name ?? "Unknown";
        await _logService.LogEventAsync(route.Id, RouteStatusType.RouteStarted,
            $"Driver {driverName} assigned to route {route.RouteNumber} for {route.StartTime:MMM dd, yyyy} – {route.EndTime:MMM dd, yyyy}");

        return new { success = true, message = "Route created successfully", routeId = id };
    }

    public async Task<(bool Success, object Response)> UpdateRoute(UpdateRouteDTO dto)
    {
        var route = new Route
        {
            Id = dto.Id,
            RouteNumber = dto.RouteNumber,
            DriverId = dto.DriverId,
            VehicleId = dto.VehicleId,
            Status = dto.Status,
            EstimatedDistance = dto.EstimatedDistance,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Notes = dto.Notes,
            Stops = dto.Stops.Select(s => new Stop
            {
                Id = s.Id,
                RouteId = dto.Id,
                StopNumber = s.StopNumber,
                LocationName = s.LocationName,
                ExpectedArrival = s.ExpectedArrival,
                ActualArrival = s.ActualArrival,
                Status = s.Status,
                Notes = s.Notes
            }).ToList()
        };
        ValidateRoute(route);
        
        var conflict = await CheckConflicts(route.DriverId, route.VehicleId, route.StartTime, route.EndTime, route.Id);
        if (conflict != null)
            return (false, new { message = conflict });

        try
        {
            var existingRoute = await _routeRepository.GetRouteByIdDB(dto.Id);
            var oldStatus = existingRoute.Status;

            var updated = await _routeRepository.UpdateRouteDB(route);
            if (updated > 0 && oldStatus != dto.Status)
            {
                RouteStatusType eventType = dto.Status switch
                {
                    RouteStatus.Started => RouteStatusType.RouteStarted,
                    RouteStatus.InProgress => RouteStatusType.RouteStarted, 
                    RouteStatus.Arrived => RouteStatusType.StopReached,  
                    RouteStatus.Completed => RouteStatusType.RouteCompleted,
                    RouteStatus.Cancelled => RouteStatusType.RouteCancelled,
                    _ => RouteStatusType.RouteStarted
                };
                

                await _logService.LogEventAsync(dto.Id, eventType, $"Route status changed from {oldStatus} to {dto.Status}");

                var vehicle = await _vehicleRepository.GetVehiclesDB().ContinueWith(t => t.Result.FirstOrDefault(v => v.Id == route.VehicleId));
                if (vehicle != null)
                {
                    if (dto.Status == RouteStatus.Created || dto.Status == RouteStatus.Assigned || dto.Status == RouteStatus.Started || dto.Status == RouteStatus.InProgress)
                    {
                        vehicle.Status = "In Transit";
                        await _vehicleRepository.AssignVehicleDB(vehicle);
                    }
                    else if (dto.Status == RouteStatus.Completed || dto.Status == RouteStatus.Cancelled)
                    {
                        vehicle.Status = "Idle";
                        await _vehicleRepository.AssignVehicleDB(vehicle);
                    }
                }

                if (dto.Status == RouteStatus.Started || dto.Status == RouteStatus.InProgress)
                {
                    await _authRepository.UpdateUserStatusDB(route.DriverId, "OnRoute");
                }
                else if (dto.Status == RouteStatus.Completed || dto.Status == RouteStatus.Cancelled)
                {
                    await _authRepository.UpdateUserStatusDB(route.DriverId, "Idle");
                }
            }

            return updated == 0
                ? (false, new { message = "Route update failed" })
                : (true, new { message = "Route updated successfully" });
        }
        catch (KeyNotFoundException)
        {
            return (false, new { message = "Route not found" });
        }
    }

    public async Task<bool> DeleteRoute(int id)
    {
        return await _routeRepository.DeleteRouteDB(id);
    }


    public async Task StopReached(int routeId, int stopId)
    {
        var route = await _routeRepository.GetRouteByIdDB(routeId);
        var stop = route.Stops.FirstOrDefault(s => s.Id == stopId);
        if (stop != null)
        {
            stop.Status = StopStatus.Reached;
            stop.ActualArrival = DateTime.Now;
            await _routeRepository.UpdateRouteDB(route);
            await _logService.LogEventAsync(routeId, RouteStatusType.StopReached, $"Stop {stop.LocationName} reached");
        }
    }

    public async Task UpdateStopStatus(int routeId, int stopId, StopStatus status, string? notes = null)
    {
        var route = await _routeRepository.GetRouteByIdDB(routeId);
        var stop = route.Stops.FirstOrDefault(s => s.Id == stopId);
        if (stop != null)
        {
            stop.Status = status;
            if (status == StopStatus.Reached) stop.ActualArrival = DateTime.Now;
            if (notes != null) stop.Notes = notes;
            await _routeRepository.UpdateRouteDB(route);
            await _logService.LogEventAsync(routeId, RouteStatusType.StopReached, $"Stop {stop.LocationName} status updated to {status}");
        }
    }

    public async Task ReportDelay(int routeId, string reason)
    {
        await _logService.LogEventAsync(routeId, RouteStatusType.DelayReported, $"Delay reported: {reason}");
    }

    public async Task ReportIssue(int routeId, string description)
    {
        await _logService.LogEventAsync(routeId, RouteStatusType.IssueReported, description);
    }

    public async Task<(bool Success, object Response)> CompleteRoute(int routeId)
    {
        try
        {
            var route = await _routeRepository.GetRouteByIdDB(routeId);

            if (route.Status == RouteStatus.Completed)
                return (false, new { message = "Route is already completed" });

            route.Status = RouteStatus.Completed;
            var updated = await _routeRepository.UpdateRouteDB(route);
            if (updated == 0)
                return (false, new { message = "Failed to complete route" });

            await _authRepository.UpdateUserStatusDB(route.DriverId, "Idle");

            var vehicle = await _vehicleRepository.GetVehiclesDB()
                .ContinueWith(t => t.Result.FirstOrDefault(v => v.Id == route.VehicleId));
            if (vehicle != null)
            {
                vehicle.Status = "Idle";
                await _vehicleRepository.AssignVehicleDB(vehicle);
            }

            await _logService.LogEventAsync(routeId, RouteStatusType.RouteCompleted,
                $"Route {route.RouteNumber} completed. Driver and vehicle set to Idle.");

            return (true, new { message = "Route completed successfully" });
        }
        catch (KeyNotFoundException)
        {
            return (false, new { message = "Route not found" });
        }
    }

    public async Task<BulkRouteUploadResponseDTO> BulkUploadRoutes(IFormFile file)
    {
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        var rows = stream.Query<RouteExcelRow>().ToList();
        if (!rows.Any())
            return new BulkRouteUploadResponseDTO { Success = false, Message = "Excel file is empty" };

        var routes = new List<Route>();
        var errors = new List<string>();
        var summary = new List<RouteAssignmentSummary>();

        var vehicles = await _vehicleRepository.GetVehiclesDB();

        for (int i = 0; i < rows.Count; i++)
        {
            var row = rows[i];
            var rowNumber = i + 2;

            try
            {
                var driver = await _authRepository.GetUserByIdDB(row.DriverId);
                var vehicle = vehicles.FirstOrDefault(v => v.Id == row.VehicleId);

                if (string.IsNullOrWhiteSpace(row.RouteNumber))
                    throw new Exception("Route number is required");

                if (driver == null)
                    throw new Exception($"Driver with ID {row.DriverId} not found");

                if (vehicle == null)
                    throw new Exception($"Vehicle with ID {row.VehicleId} not found");

                if (row.StartTime >= row.EndTime)
                    throw new Exception("Start time must be before end time");

                var conflict = await CheckConflicts(row.DriverId, row.VehicleId, row.StartTime, row.EndTime);
                if (conflict != null)
                    throw new Exception(conflict);

                var route = new Route
                {
                    RouteNumber = row.RouteNumber,
                    DriverId = row.DriverId,
                    VehicleId = row.VehicleId,
                    EstimatedDistance = row.EstimatedDistance,
                    StartTime = row.StartTime,
                    EndTime = row.EndTime,
                    Notes = row.Notes,
                    Status = RouteStatus.Created
                };

                routes.Add(route);

                summary.Add(new RouteAssignmentSummary
                {
                    RouteNumber = row.RouteNumber,
                    DriverName = driver.Name,
                    VehicleNumber = vehicle.Name,
                    StartTime = row.StartTime,
                    EndTime = row.EndTime,
                    Status = "Imported Successfully"
                });
            }
            catch (Exception ex)
            {
                errors.Add($"Row {rowNumber}: {ex.Message}");
            }
        }

        string resultMessage = routes.Any()
            ? await _routeRepository.BulkImportOfRouteDB(routes.ToArray())
            : "No valid routes found";

        return new BulkRouteUploadResponseDTO
        {
            TotalRows = rows.Count,
            SuccessfulRows = routes.Count,
            FailedRows = errors.Count,
            Errors = errors,
            Summary = summary,
            Success = routes.Any(),
            Message = resultMessage
        };
    }

    private void ValidateRoute(Route route)
    {
        if (string.IsNullOrWhiteSpace(route.RouteNumber))
            throw new ArgumentException("Route number is required");

        if (route.DriverId <= 0)
            throw new ArgumentException("Valid driver ID is required");

        if (route.VehicleId <= 0)
            throw new ArgumentException("Valid vehicle ID is required");

        if (route.StartTime >= route.EndTime)
            throw new ArgumentException("Start time must be before end time");

        if (route.StartTime < DateTime.Now.AddMinutes(-10))
            throw new ArgumentException("Start time cannot be significantly in the past");

        foreach (var stop in route.Stops)
        {
            if (stop.ExpectedArrival < route.StartTime)
                throw new ArgumentException($"Stop '{stop.LocationName}' expected arrival ({stop.ExpectedArrival:g}) cannot be before the route start time ({route.StartTime:g})");
            if (stop.ExpectedArrival > route.EndTime)
                throw new ArgumentException($"Stop '{stop.LocationName}' expected arrival ({stop.ExpectedArrival:g}) cannot be after the route end time ({route.EndTime:g})");
        }
    }

    private async Task<string?> CheckConflicts(int driverId, int vehicleId, DateTime startTime, DateTime endTime, int? excludeRouteId = null)
    {
        var routes = await _routeRepository.GetAllRoutesDB();
        
        var driverConflict = routes.FirstOrDefault(r => 
            r.DriverId == driverId && 
            r.Id != excludeRouteId && 
            r.Status != RouteStatus.Completed && r.Status != RouteStatus.Cancelled &&
            startTime < r.EndTime && r.StartTime < endTime);

        if (driverConflict != null)
            return $"Driver is already assigned to route {driverConflict.RouteNumber} ({driverConflict.StartTime:HH:mm} - {driverConflict.EndTime:HH:mm})";

        var vehicleConflict = routes.FirstOrDefault(r => 
            r.VehicleId == vehicleId && 
            r.Id != excludeRouteId &&
            r.Status != RouteStatus.Completed && r.Status != RouteStatus.Cancelled &&
            startTime < r.EndTime && r.StartTime < endTime);

        if (vehicleConflict != null)
            return $"Vehicle is already assigned to route {vehicleConflict.RouteNumber} ({vehicleConflict.StartTime:HH:mm} - {vehicleConflict.EndTime:HH:mm})";

        return null;
    }

    private RouteResponseDTO MapToDTO(Route r) => new RouteResponseDTO
    {
        Id = r.Id,
        RouteNumber = r.RouteNumber,
        DriverId = r.DriverId,
        DriverName = r.Driver?.Name ?? "Unknown",
        VehicleId = r.VehicleId,
        VehicleNumber = r.Vehicle?.Name ?? "Unknown",
        Status = r.Status,
        EstimatedDistance = r.EstimatedDistance,
        StartTime = r.StartTime,
        EndTime = r.EndTime,
        Notes = r.Notes,
        StopsCount = r.Stops?.Count ?? 0,
        Stops = r.Stops?.Select(s => new StopDTO
        {
            Id = s.Id,
            StopNumber = s.StopNumber,
            LocationName = s.LocationName,
            ExpectedArrival = s.ExpectedArrival,
            ActualArrival = s.ActualArrival,
            Status = s.Status,
            Notes = s.Notes
        }).ToList() ?? new List<StopDTO>()
    };
}