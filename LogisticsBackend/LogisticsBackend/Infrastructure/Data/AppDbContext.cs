using LogisticsBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Route = LogisticsBackend.Domain.Entities.Route;

namespace LogisticsBackend.Infrastructure.Data;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Route> Routes => Set<Route>();
        public DbSet<Stop> RouteStops => Set<Stop>();
        public DbSet<OperationalLogs> OperationalLogs => Set<OperationalLogs>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Vehicle>()
                .HasMany(v => v.Routes)
                .WithOne(r => r.Vehicle)
                .HasForeignKey(r => r.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Route>()
                .HasOne(r => r.Driver)
                .WithMany(u => u.AssignedRoutes)
                .HasForeignKey(r => r.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Route>()
                .HasMany(r => r.Stops)
                .WithOne(s => s.Route)
                .HasForeignKey(s => s.RouteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Route>()
                .HasMany(r => r.Logs)
                .WithOne(l => l.Route)
                .HasForeignKey(l => l.RouteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Stop>()
                .HasIndex(r => new { r.RouteId, r.StopNumber })
                .IsUnique();

            modelBuilder.Entity<OperationalLogs>()
                .HasOne(l => l.Driver)
                .WithMany()
                .HasForeignKey(l => l.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OperationalLogs>()
                .HasOne(l => l.Vehicle)
                .WithMany()
                .HasForeignKey(l => l.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }


