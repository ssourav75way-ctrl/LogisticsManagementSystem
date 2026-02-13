import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, CreateVehicleRequest, UpdateVehicleStatusRequest } from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/Vehicle`;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  getHighlightedVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/highlighted`);
  }

  createVehicle(vehicle: CreateVehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  updateVehicleStatus(data: UpdateVehicleStatusRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/assign`, data);
  }
}
