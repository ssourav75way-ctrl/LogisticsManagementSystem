import { User } from './user.model';
import { Vehicle } from './vehicle.model';
import { Route } from './route.model';
import { Stop } from './stop.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  Token?: string;
  user?: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface DecodedToken {
  sub?: string;
  id?: number;
  role?: string;
  Role?: string;
  name?: string;
  UniqueName?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface CreateVehicleRequest {
  name: string;
  vehicleType: string;
  status: string;
  location: string;
  isActive: string;
}

export interface UpdateVehicleStatusRequest {
  id: number;
  status: string;
  location?: string;
}

export interface CreateStopRequest {
  locationName: string;
  expectedArrival: string | Date;
  stopNumber: number;
}

export interface CreateRouteRequest {
  routeNumber: string;
  driverId: number;
  vehicleId: number;
  startTime: string | Date;
  endTime: string | Date;
  estimatedDistance?: number;
  notes?: string;
  stops?: CreateStopRequest[];
}

export interface UpdateRouteRequest {
  id?: number;
  routeNumber?: string;
  driverId?: number;
  vehicleId?: number;
  status?: number;
  estimatedDistance?: number;
  startTime?: string | Date;
  endTime?: string | Date;
  notes?: string;
  stops?: (
    | CreateStopRequest
    | (Omit<Partial<Stop>, 'expectedArrival'> & { expectedArrival?: string | Date })
  )[];
}

export interface RouteAssignmentSummary {
  routeNumber: string;
  driverName: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: string[];
  summary: RouteAssignmentSummary[];
}

export interface ReportIssueRequest {
  description: string;
}

export interface UpdateStopStatusRequest {
  status: number;
  notes?: string;
}
