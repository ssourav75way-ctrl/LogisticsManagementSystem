import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { VehicleService } from '../../../core/services/vehicle.service';
import { AssignVehicleDialog } from '../assign-vehicle-dialog/assign-vehicle-dialog.dialog';
import { CreateVehicleDialog } from '../create-vehicle-dialog/create-vehicle-dialog.dialog';
import { Vehicle } from '../../../core/models';

@Component({
  selector: 'app-vehicle-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
  ],
  templateUrl: './vehicle-monitoring.html',
  styleUrl: './vehicle-monitoring.scss',
})
export class VehicleMonitoringComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  displayedColumns: string[] = ['name', 'type', 'status', 'location', 'actions'];

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe((data) => {
      this.vehicles = data;
      this.filteredVehicles = data;
    });
  }

  filterByStatus(status: string) {
    if (!status) {
      this.filteredVehicles = this.vehicles;
    } else {
      this.filteredVehicles = this.vehicles.filter((v) => v.status === status);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'In Transit':
        return 'status-transit';
      case 'Idle':
        return 'status-idle';
      case 'Maintenance':
        return 'status-maintenance';
      default:
        return '';
    }
  }

  openAssignDialog(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(AssignVehicleDialog, {
      width: '400px',
      data: { vehicle },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadVehicles();
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateVehicleDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadVehicles();
    });
  }
}
