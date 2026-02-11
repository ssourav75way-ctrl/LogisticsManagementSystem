using LogisticsBackend.Application.DTO.VehicleDTOs;
using LogisticsBackend.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsBackend.Controller;

[Route("api/[controller]")]
[ApiController]
public class VehicleController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehicleController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVehicles()
    {
        var vehicles = await _vehicleService.GetVehicles();
        return Ok(vehicles);
    }

    [HttpGet("highlighted")]
    public async Task<IActionResult> GetHighlightedVehicles()
    {
        var vehicles = await _vehicleService.GetHighlightedVehicles();
        return Ok(vehicles);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]    
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDTO dto)

    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _vehicleService.CreateVehicle(dto);
        return CreatedAtAction(nameof(GetAllVehicles), new { id = result.Id }, result);
    }

    [HttpPost("assign")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> AssignVehicle([FromBody] UpdateVehicleStatusDTO dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _vehicleService.UpdateVehicleStatus(dto);
        return result > 0 ? Ok(new { message = "Vehicle updated successfully" }) : NotFound(new { message = "Vehicle not found" });
    }
}
