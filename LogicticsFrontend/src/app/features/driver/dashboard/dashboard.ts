import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { RouteService } from '../../../core/services/route.service';
import { AuthService } from '../../../core/services/auth.service';
import { Route } from '../../../core/models';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  assignedRoutes: Route[] = [];

  constructor(
    private routeService: RouteService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadMyRoutes();
  }

  loadMyRoutes() {
    this.routeService.getRoutes().subscribe((data) => {
      const currentUserId = this.authService.currentUser()?.id;
      this.assignedRoutes = data.filter(
        (r) => Number(r.driverId) === Number(currentUserId) && r.status < 3,
      );
    });
  }

  getStatusLabel(status: number) {
    const types = ['Pending', 'Assigned', 'In Transit', 'Completed', 'Cancelled'];
    return types[status] || 'Unknown';
  }
}
