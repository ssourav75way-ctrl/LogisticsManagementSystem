using System.ComponentModel.DataAnnotations;

namespace LogisticsBackend.Domain.Entities;

public class User:BaseEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required] 
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
    [Required]
    public string Role { get; set; } = string.Empty;

    public string Status { get; set; } = "Idle";
   
    public ICollection<Route>? AssignedRoutes { get; set; }

}