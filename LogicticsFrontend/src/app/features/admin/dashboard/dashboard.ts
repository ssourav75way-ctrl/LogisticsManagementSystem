import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle.service';
import { RouteService } from '../../../core/services/route.service';
import { LogService } from '../../../core/services/log.service';
import { OperationalLog, Vehicle, Route } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  stats = {
    totalVehicles: 0,
    activeRoutes: 0,
    alerts: 0,
    completedToday: 0,
    driversAssigned: 0,
    driversOnRoute: 0,
  };
  recentLogs: OperationalLog[] = [];
  attentionVehicles: Vehicle[] = [];
  driverSummaries: { name: string; status: string; routeNumber: string }[] = [];

  constructor(
    private vehicleService: VehicleService,
    private routeService: RouteService,
    private logService: LogService,
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.vehicleService.getVehicles().subscribe((v) => {
      this.stats.totalVehicles = v.length;
      this.attentionVehicles = v.filter(
        (vehicle) => vehicle.status === 'In Transit' || vehicle.status === 'Maintenance',
      );
    });
    this.routeService.getRoutes().subscribe((routes) => {
      this.stats.activeRoutes = routes.filter((x) => x.status === 2 || x.status === 3).length;
      this.stats.completedToday = routes.filter((x) => x.status === 5).length;

      const assignedRoutes = routes.filter((r) => r.status === 0 || r.status === 1);
      const onRouteRoutes = routes.filter(
        (r) => r.status === 2 || r.status === 3 || r.status === 4,
      );
      this.stats.driversAssigned = assignedRoutes.length;
      this.stats.driversOnRoute = onRouteRoutes.length;

      this.driverSummaries = routes
        .filter((r) => r.status < 5)
        .map((r) => ({
          name: r.driverName || 'Unknown',
          status: this.getDriverStatusFromRoute(r.status),
          routeNumber: r.routeNumber,
        }));
    });
    this.logService.getLogs().subscribe((logs) => {
      this.stats.alerts = logs.filter((l) => l.eventType === 5).length;
      this.recentLogs = logs.slice(0, 5);
    });
  }

  getDriverStatusFromRoute(routeStatus: number): string {
    if (routeStatus === 0 || routeStatus === 1) return 'Assigned';
    if (routeStatus === 2 || routeStatus === 3 || routeStatus === 4) return 'On Route';
    return 'Idle';
  }

  getLogIcon(eventType: number): string {
    switch (eventType) {
      case 0:
        return 'play_arrow';
      case 1:
        return 'location_on';
      case 2:
        return 'schedule';
      case 3:
        return 'done_all';
      case 4:
        return 'cancel';
      case 5:
        return 'error';
      default:
        return 'notifications';
    }
  }
}
