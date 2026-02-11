using LogisticsBackend.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsBackend.Controller;

[Route("api/[controller]")]
[ApiController]
public class LogController : ControllerBase
{
    private readonly IOperationalLogService _logService;

    public LogController(IOperationalLogService logService)
    {
        _logService = logService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs([FromQuery] int? vehicleId, [FromQuery] int? driverId, [FromQuery] int? routeId)
    {
        var logs = await _logService.GetLogsAsync(vehicleId, driverId, routeId);
        return Ok(logs);
    }
}
