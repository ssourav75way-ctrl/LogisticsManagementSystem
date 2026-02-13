using LogisticsBackend.Application.DTO.RouteDTO_s;
using LogisticsBackend.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsBackend.Controller;

[Route("api/[controller]")]
[ApiController]
public class RouteController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RouteController(IRouteService routeService)
    {
        _routeService = routeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRoutes()
    {
        var response = await _routeService.GetAllRoutesDTO();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRouteById(int id)
    {
        var route = await _routeService.GetRouteById(id);
        return route == null ? NotFound(new { message = "Route not found" }) : Ok(route);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRoute([FromBody] CreateRouteDTO dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _routeService.CreateRoute(dto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoute(int id, [FromBody] UpdateRouteDTO dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (id != dto.Id)
            return BadRequest(new { message = "Route ID mismatch" });

        try
        {
            var result = await _routeService.UpdateRoute(dto);
            return result.Success ? Ok(result) : NotFound(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoute(int id)
    {
        var result = await _routeService.DeleteRoute(id);
        return result ? Ok(new { message = "Route deleted successfully" }) : NotFound(new { message = "Route not found" });
    }

    [HttpPost("{id}/stop/{stopId}/reached")]
    public async Task<IActionResult> StopReached(int id, int stopId)
    {
        await _routeService.StopReached(id, stopId);
        return Ok(new { message = "Stop marked as reached" });
    }

    [HttpPost("{id}/stop/{stopId}/update")]
    public async Task<IActionResult> UpdateStopStatus(int id, int stopId, [FromBody] StopStatusUpdateModel model)
    {
        await _routeService.UpdateStopStatus(id, stopId, model.Status, model.Notes);
        return Ok(new { message = "Stop status updated" });
    }

    [HttpPost("{id}/report-issue")]
    public async Task<IActionResult> ReportIssue(int id, [FromBody] ReportIssueModel model)
    {
        await _routeService.ReportIssue(id, model.Description);
        return Ok(new { message = "Issue reported" });
    }

    public class StopStatusUpdateModel {
        public LogisticsBackend.Domain.Enums.StopStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class ReportIssueModel {
        public string Description { get; set; } = null!;
    }

    [HttpPost("bulk-upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> BulkUploadRoutes(IFormFile file)
    {
        if (file == null)
            return BadRequest(new { message = "No file uploaded" });

        var result = await _routeService.BulkUploadRoutes(file);
        return Ok(result);
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteRoute(int id)
    {
        var result = await _routeService.CompleteRoute(id);
        return result.Success ? Ok(result.Response) : BadRequest(result.Response);
    }
}
