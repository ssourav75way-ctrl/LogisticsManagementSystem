import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { interval, Subscription } from 'rxjs';
import { LogService } from '../../../core/services/log.service';
import { RouteService } from '../../../core/services/route.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { OperationalLog, Route, Vehicle } from '../../../core/models';

@Component({
  selector: 'app-operational-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './operational-logs.html',
  styleUrl: './operational-logs.scss',
})
export class OperationalLogsComponent implements OnInit, OnDestroy {
  logs: OperationalLog[] = [];
  displayedColumns: string[] = ['time', 'event', 'info', 'driver', 'vehicle'];

  vehicles: Vehicle[] = [];
  drivers: { id: number; name: string }[] = [];
  routes: Route[] = [];

  filters = {
    vehicleId: null as number | null,
    driverId: null as number | null,
    routeId: null as number | null,
  };

  private refreshSub?: Subscription;

  constructor(
    private logService: LogService,
    private routeService: RouteService,
    private vehicleService: VehicleService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.loadInitialData();
    this.loadLogs();

    if (isPlatformBrowser(this.platformId)) {
      this.refreshSub = interval(10000).subscribe(() => this.loadLogs());
    }
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadInitialData() {
    this.vehicleService.getVehicles().subscribe((v) => (this.vehicles = v));
    this.routeService.getRoutes().subscribe((routes) => {
      this.routes = routes;
      const driverMap = new Map<number, string>();
      routes.forEach((r) => {
        if (r.driverId && !driverMap.has(r.driverId)) {
          driverMap.set(r.driverId, r.driverName || `Driver ${r.driverId}`);
        }
      });
      this.drivers = Array.from(driverMap.entries()).map(([id, name]) => ({ id, name }));
    });
  }

  onFilterChange() {
    this.loadLogs();
  }

  resetFilters() {
    this.filters = { vehicleId: null, driverId: null, routeId: null };
    this.loadLogs();
  }

  loadLogs() {
    const activeFilters: { vehicleId?: number; driverId?: number; routeId?: number } = {};
    if (this.filters.vehicleId) activeFilters.vehicleId = this.filters.vehicleId;
    if (this.filters.driverId) activeFilters.driverId = this.filters.driverId;
    if (this.filters.routeId) activeFilters.routeId = this.filters.routeId;

    this.logService.getLogs(activeFilters).subscribe((data) => {
      this.logs = data.sort(
        (a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime(),
      );
    });
  }

  getEventIcon(type: number) {
    switch (type) {
      case 0:
        return 'info';
      case 2:
        return 'play_arrow';
      case 3:
        return 'done_all';
      case 4:
        return 'error';
      default:
        return 'event';
    }
  }

  getEventTypeLabel(type: number) {
    const types = ['Created', 'Assigned', 'Started', 'Completed', 'Issue Reported'];
    return types[type] || 'Event';
  }

  getVehicleName(log: OperationalLog): string {
    if (log.vehicleNumber) return log.vehicleNumber;
    if (log.vehicle?.name) return log.vehicle.name;
    if (log.vehicle?.name) return log.vehicle.name;

    if (log.vehicleId) {
      const vehicle = this.vehicles.find((v) => v.id === log.vehicleId);
      if (vehicle) return vehicle.name;
    }

    return '-';
  }

  exportToCsv() {
    if (this.logs.length === 0) return;

    const headers = ['Time', 'Event', 'Description', 'Driver', 'Vehicle', 'Route #'];
    const csvData = this.logs.map((log) => [
      new Date(log.eventTime).toLocaleString(),
      this.getEventTypeLabel(log.eventType),
      `"${log.description || ''}"`,
      log.driverName || 'System',
      this.getVehicleName(log),
      log.routeNumber || '-',
    ]);

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `operational_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
