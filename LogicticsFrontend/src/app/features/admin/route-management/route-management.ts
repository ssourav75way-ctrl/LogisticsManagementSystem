import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouteService } from '../../../core/services/route.service';
import { CreateRouteDialog } from '../create-route-dialog/create-route-dialog.dialog';
import { EditRouteDialog } from '../edit-route-dialog/edit-route-dialog.dialog';
import { BulkUploadSummaryDialog } from '../bulk-upload-summary-dialog/bulk-upload-summary-dialog.dialog';
import { Route } from '../../../core/models';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './route-management.html',
  styleUrl: './route-management.scss',
})
export class RouteManagementComponent implements OnInit {
  routes: Route[] = [];
  filteredRoutes: Route[] = [];
  displayedColumns: string[] = [
    'routeNumber',
    'driver',
    'vehicle',
    'distance',
    'stops',
    'status',
    'actions',
  ];
  uploading = false;
  statusFilter: number | null = null;

  constructor(
    private routeService: RouteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe((data) => {
      this.routes = data;
      this.applyFilter();
    });
  }

  filterByStatus(status: number | string | null) {
    this.statusFilter = status === '' ? null : Number(status);
    this.applyFilter();
  }

  applyFilter() {
    if (this.statusFilter === null) {
      this.filteredRoutes = this.routes;
    } else {
      this.filteredRoutes = this.routes.filter((r) => r.status === this.statusFilter);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx')) {
        this.snackBar.open('Please upload an Excel file (.xlsx)', 'Close', { duration: 3000 });
        return;
      }

      this.uploading = true;
      this.routeService.bulkUpload(file).subscribe({
        next: (res) => {
          this.uploading = false;
          this.dialog.open(BulkUploadSummaryDialog, {
            width: '800px',
            data: res,
          });
          this.loadRoutes();
        },
        error: (err) => {
          this.uploading = false;
          this.snackBar.open(
            'Upload failed: ' + (err.error?.message || 'Check file format'),
            'Close',
            { duration: 5000 },
          );
        },
      });
    }
  }

  getStatusName(status: number) {
    const statuses = [
      'Created',
      'Assigned',
      'Started',
      'In Progress',
      'Arrived',
      'Completed',
      'Cancelled',
    ];
    return statuses[status] || 'Unknown';
  }

  deleteRoute(id: number) {
    if (confirm('Are you sure you want to delete this route?')) {
      this.routeService.deleteRoute(id).subscribe({
        next: () => {
          this.snackBar.open('Route deleted successfully', 'Close', { duration: 3000 });
          this.loadRoutes();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete route', 'Close', { duration: 3000 });
        },
      });
    }
  }

  openCreateRouteDialog() {
    const dialogRef = this.dialog.open(CreateRouteDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadRoutes();
    });
  }

  openEditRouteDialog(route: Route) {
    const dialogRef = this.dialog.open(EditRouteDialog, {
      width: '600px',
      data: { route },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadRoutes();
    });
  }
}
