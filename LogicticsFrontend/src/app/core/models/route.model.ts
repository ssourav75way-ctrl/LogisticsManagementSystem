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
  stopsCount?: number;
}
