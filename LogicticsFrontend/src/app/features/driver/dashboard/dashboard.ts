import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouteService } from '../../../core/services/route.service';
import { AuthService } from '../../../core/services/auth.service';
import { Route } from '../../../core/models';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  assignedRoutes: Route[] = [];

  constructor(
    private routeService: RouteService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadMyRoutes();
  }

  loadMyRoutes() {
    this.routeService.getRoutes().subscribe((data) => {
      const currentUserId = this.authService.currentUser()?.id;
      this.assignedRoutes = data.filter(
        (r) => Number(r.driverId) === Number(currentUserId) && r.status < 5,
      );
    });
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
      month: 'short',
      day: 'numeric',
    });
  }

  completeRoute(route: Route) {
    this.routeService.completeRoute(route.id).subscribe({
      next: () => {
        this.snackBar.open(`Route ${route.routeNumber} completed!`, 'OK', { duration: 3000 });
        this.loadMyRoutes();
      },
      error: () => this.snackBar.open('Failed to complete route', 'Close', { duration: 3000 }),
    });
  }
}
