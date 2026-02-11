using System.ComponentModel.DataAnnotations;

namespace LogisticsBackend.Domain.Entities;

public class Vehicle :BaseEntity
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string VehicleType { get; set; } = string.Empty;
  
    
    public string Status { get; set; } = string.Empty;
    
    
    public string Location {get; set; } = string.Empty;

    [Required] 
    public string IsActive { get; set; } = string.Empty;
    public ICollection<Route>? Routes { get; set; }

}