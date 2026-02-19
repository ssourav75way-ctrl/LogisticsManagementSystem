export interface OperationalLog {
  id: number;
  routeId: number;
  routeNumber: string;
  vehicleId: number;
  driverId: number;
  driverName: string;
  eventType: number;
  description?: string;
  eventTime: string;
}
