using LogisticsBackend.Application.DTO.RouteDTO_s;
using LogisticsBackend.Domain.Entities;
using LogisticsBackend.Domain.Enums;
using Route = LogisticsBackend.Domain.Entities.Route;

namespace LogisticsBackend.Application.Interfaces.Services;

public interface IRouteService
{
    Task<List<RouteResponseDTO>> GetAllRoutesDTO();
    Task<RouteResponseDTO?> GetRouteById(int id);
    Task<object> CreateRoute(CreateRouteDTO dto);
    Task<(bool Success, object Response)> UpdateRoute(UpdateRouteDTO dto);
    Task<bool> DeleteRoute(int id);
    Task StopReached(int routeId, int stopId);
    Task UpdateStopStatus(int routeId, int stopId, StopStatus status, string? notes = null);
    Task ReportDelay(int routeId, string reason);
    Task ReportIssue(int routeId, string description);
    Task<BulkRouteUploadResponseDTO> BulkUploadRoutes(IFormFile file);
}