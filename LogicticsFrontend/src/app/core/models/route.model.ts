import { Stop } from './stop.model';
import { RouteStatus } from './route-status.enum';

export interface Route {
  id: number;
  routeNumber: string;
  driverId: number;
  driverName?: string;
  vehicleId: number;
  vehicleNumber?: string;
  status: RouteStatus;
  estimatedDistance?: number;
  startTime: string;
  endTime: string;
  notes?: string;
  stops?: Stop[];
  driver?: {
    id: number;
    name: string;
    email: string;
  };
  vehicle?: {
    id: number;
    name: string;
    vehicleType: string;
    status: string;
  };
}
