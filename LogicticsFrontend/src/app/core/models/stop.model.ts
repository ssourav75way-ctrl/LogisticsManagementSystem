import { StopStatus } from './stop-status.enum';

export interface Stop {
  id: number;
  routeId: number;
  stopNumber: number;
  locationName: string;
  expectedArrival: string;
  actualArrival?: string;
  status: StopStatus;
  notes?: string;
}
