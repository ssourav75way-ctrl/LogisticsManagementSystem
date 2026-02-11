using LogisticsBackend.Domain.Entities;
using Route = LogisticsBackend.Domain.Entities.Route;

namespace LogisticsBackend.Application.Interfaces.Repository;

public interface IRouteRepository
{
    public Task<ICollection<Route>> GetAllRoutesDB();
    public Task<Route> GetRouteByIdDB(int routeId);
    public Task<int> CreateRouteDB(Route route);
    public Task<int> UpdateRouteDB(Route route);
    public Task<string> BulkImportOfRouteDB(Route[] routes);
    public Task<bool> DeleteRouteDB(int routeId);
}
