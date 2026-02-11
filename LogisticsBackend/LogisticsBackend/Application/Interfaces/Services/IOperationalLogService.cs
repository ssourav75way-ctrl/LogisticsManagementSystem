using LogisticsBackend.Application.DTO.LogDTOs;
using LogisticsBackend.Domain.Enums;

namespace LogisticsBackend.Application.Interfaces.Services;

public interface IOperationalLogService
{
    Task LogEventAsync(int routeId, RouteStatusType eventType, string? description = null);
    Task<List<LogResponseDTO>> GetLogsAsync(int? vehicleId = null, int? driverId = null, int? routeId = null);
}
