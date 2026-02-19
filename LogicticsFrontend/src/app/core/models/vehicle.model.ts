export interface Vehicle {
  id: number;
  name: string;
  vehicleType: string;
  status: string;
  location: string;
  activeRouteId?: number;
  activeRouteNumber?: string;
}
