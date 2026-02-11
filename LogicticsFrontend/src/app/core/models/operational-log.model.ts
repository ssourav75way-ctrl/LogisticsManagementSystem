export interface OperationalLog {
  id: number;
  routeId: number;
  vehicleId: number;
  driverId: number;
  eventType: number;
  description?: string;
  eventTime: string;
  driver?: {
    id: number;
    name: string;
  };
  vehicle?: {
    id: number;
    name: string;
  };
  route?: {
    id: number;
    routeNumber: string;
  };
  driverName: string;
  vehicleNumber: string;
  routeNumber: string;
}
