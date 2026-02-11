import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { DashboardComponent as AdminDashboard } from './features/admin/dashboard/dashboard';
import { VehicleMonitoringComponent } from './features/admin/vehicle-monitoring/vehicle-monitoring';
import { RouteManagementComponent } from './features/admin/route-management/route-management';
import { OperationalLogsComponent } from './features/admin/operational-logs/operational-logs';
import { DashboardComponent as DriverDashboard } from './features/driver/dashboard/dashboard';
import { RouteExecutionComponent } from './features/driver/route-execution/route-execution';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'vehicles', component: VehicleMonitoringComponent },
      { path: 'routes', component: RouteManagementComponent },
      { path: 'logs', component: OperationalLogsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'driver',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DriverDashboard },
      { path: 'execution/:id', component: RouteExecutionComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
