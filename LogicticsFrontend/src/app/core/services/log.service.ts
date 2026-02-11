import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OperationalLog } from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/Log`;

  constructor(private http: HttpClient) {}

  getLogs(filters?: {
    vehicleId?: number;
    driverId?: number;
    routeId?: number;
  }): Observable<OperationalLog[]> {
    let params = new HttpParams();
    if (filters?.vehicleId) params = params.set('vehicleId', filters.vehicleId);
    if (filters?.driverId) params = params.set('driverId', filters.driverId);
    if (filters?.routeId) params = params.set('routeId', filters.routeId);

    return this.http.get<OperationalLog[]>(`${this.apiUrl}`, { params }).pipe(
      map((logs) =>
        logs.map((log) => ({
          ...log,
          eventTime: log.eventTime
            ? log.eventTime.endsWith('Z')
              ? log.eventTime
              : log.eventTime + 'Z'
            : log.eventTime,
        })),
      ),
    );
  }
}
