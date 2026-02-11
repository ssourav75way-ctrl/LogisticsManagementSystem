import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle.service';
import { RouteService } from '../../../core/services/route.service';
import { LogService } from '../../../core/services/log.service';
import { OperationalLog, Vehicle } from '../../../core/models';

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
  };
  recentLogs: OperationalLog[] = [];
  attentionVehicles: Vehicle[] = [];

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
    this.routeService.getRoutes().subscribe((r) => {
      this.stats.activeRoutes = r.filter((x) => x.status === 2).length;
      this.stats.completedToday = r.filter((x) => x.status === 3).length;
    });
    this.logService.getLogs().subscribe((logs) => {
      this.stats.alerts = logs.filter((l) => l.eventType === 4).length;
      this.recentLogs = logs.slice(0, 5);
    });
  }
}
