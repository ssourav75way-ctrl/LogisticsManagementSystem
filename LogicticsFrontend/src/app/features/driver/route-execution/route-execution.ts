import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { RouteService } from '../../../core/services/route.service';
import { Route } from '../../../core/models/route.model';

@Component({
  selector: 'app-route-execution',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './route-execution.html',
  styleUrl: './route-execution.scss',
})
export class RouteExecutionComponent implements OnInit {
  route?: Route;
  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.loadRoute(id);
    }
  }

  loadRoute(id: number) {
    this.routeService.getRouteById(id).subscribe({
      next: (data) => {
        this.route = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading route', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  updateStatus(newStatus: number) {
    if (this.route) {
      const updated = { ...this.route, status: newStatus };
      this.routeService.updateRoute(this.route.id, updated).subscribe({
        next: () => {
          this.route!.status = newStatus;
          this.snackBar.open(`Route status updated to ${this.getStatusLabel(newStatus)}`, 'Close', {
            duration: 3000,
          });
        },
        error: () => this.snackBar.open('Failed to update status', 'Close', { duration: 3000 }),
      });
    }
  }

  markArrived(stopId: number) {
    if (this.route) {
      this.routeService.updateStopStatus(this.route.id, stopId, 1).subscribe({
        next: () => {
          if (this.route && this.route.stops) {
            const stop = this.route.stops.find((s) => s.id === stopId);
            if (stop) stop.status = 1;
            this.snackBar.open('Arrival confirmed. Please confirm delivery.', 'OK', {
              duration: 3000,
            });
          }
        },
        error: () => this.snackBar.open('Failed to update stop', 'Close', { duration: 3000 }),
      });
    }
  }

  markDelivered(stopId: number) {
    if (this.route) {
      this.routeService.updateStopStatus(this.route.id, stopId, 2).subscribe({
        next: () => {
          if (this.route && this.route.stops) {
            const stop = this.route.stops.find((s) => s.id === stopId);
            if (stop) stop.status = 2;

            if (this.allStopsDelivered()) {
              this.snackBar.open('All stops delivered! You can now finish the journey.', 'OK', {
                duration: 5000,
              });
            } else {
              this.snackBar.open('Delivery confirmed', 'Close', { duration: 2000 });
            }
          }
        },
        error: () => this.snackBar.open('Failed to mark delivered', 'Close', { duration: 3000 }),
      });
    }
  }

  allStopsDelivered(): boolean {
    return this.route?.stops?.every((s) => s.status === 2) ?? false;
  }

  getStatusLabel(status: number) {
    const types = [
      'Created',
      'Assigned',
      'Started',
      'In Progress',
      'Arrived',
      'Completed',
      'Cancelled',
    ];
    return types[status] || 'Unknown';
  }

  toIST(dateStr: string | Date): string {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  allStopsReached(): boolean {
    return this.route?.stops?.every((s) => s.status === 1) ?? false;
  }

  issueDuringTransit() {
    if (this.route) {
      this.routeService
        .reportIssue(this.route.id, 'Transit issue reported by driver')
        .subscribe(() => {
          this.snackBar.open('Transit issue reported to dispatcher', 'OK', { duration: 5000 });
        });
    }
  }

  completeRoute() {
    if (this.route) {
      this.routeService.completeRoute(this.route.id).subscribe({
        next: () => {
          this.route!.status = 5;
          this.snackBar.open('Route completed! Driver and vehicle set to Idle.', 'OK', {
            duration: 5000,
          });
        },
        error: () => this.snackBar.open('Failed to complete route', 'Close', { duration: 3000 }),
      });
    }
  }
}
