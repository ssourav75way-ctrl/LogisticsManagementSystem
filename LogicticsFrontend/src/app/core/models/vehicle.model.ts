export interface Vehicle {
  id: number;
  name: string;
  vehicleType: string;
  status: string;
  location: string;
  isActive: string;
  routes?: {
    id: number;
    routeNumber: string;
    status: number;
  }[];
}
