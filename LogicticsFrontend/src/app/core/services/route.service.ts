import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Route,
  Stop,
  CreateRouteRequest,
  UpdateRouteRequest,
  BulkUploadResponse,
  ReportIssueRequest,
  UpdateStopStatusRequest,
} from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private apiUrl = `${environment.apiUrl}/Route`;

  constructor(private http: HttpClient) {}

  getRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl).pipe(
      map((routes) =>
        routes.map((route) => ({
          ...route,
          startTime:
            route.startTime && !route.startTime.endsWith('Z')
              ? route.startTime + 'Z'
              : route.startTime,
          endTime:
            route.endTime && !route.endTime.endsWith('Z') ? route.endTime + 'Z' : route.endTime,
          stops: route.stops?.map((stop) => ({
            ...stop,
            expectedArrival:
              stop.expectedArrival && !stop.expectedArrival.endsWith('Z')
                ? stop.expectedArrival + 'Z'
                : stop.expectedArrival,
            actualArrival:
              stop.actualArrival && !stop.actualArrival.endsWith('Z')
                ? stop.actualArrival + 'Z'
                : stop.actualArrival,
          })),
        })),
      ),
    );
  }

  getRouteById(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/${id}`).pipe(
      map((route) => ({
        ...route,
        startTime:
          route.startTime && !route.startTime.endsWith('Z')
            ? route.startTime + 'Z'
            : route.startTime,
        endTime:
          route.endTime && !route.endTime.endsWith('Z') ? route.endTime + 'Z' : route.endTime,
        stops: route.stops?.map((stop) => ({
          ...stop,
          expectedArrival:
            stop.expectedArrival && !stop.expectedArrival.endsWith('Z')
              ? stop.expectedArrival + 'Z'
              : stop.expectedArrival,
          actualArrival:
            stop.actualArrival && !stop.actualArrival.endsWith('Z')
              ? stop.actualArrival + 'Z'
              : stop.actualArrival,
        })),
      })),
    );
  }

  createRoute(route: CreateRouteRequest): Observable<unknown> {
    const dataroute = this.http.post(this.apiUrl, route);
    console.log(dataroute);
    return dataroute;
  }

  updateRoute(id: number, route: UpdateRouteRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, route);
  }

  bulkUpload(file: File): Observable<BulkUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<BulkUploadResponse>(`${this.apiUrl}/bulk-upload`, formData);
  }

  deleteRoute(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  reportIssue(routeId: number, description: string): Observable<unknown> {
    const payload: ReportIssueRequest = { description };
    return this.http.post(`${this.apiUrl}/${routeId}/report-issue`, payload);
  }

  updateStopStatus(
    routeId: number,
    stopId: number,
    status: number,
    notes?: string,
  ): Observable<unknown> {
    const payload: UpdateStopStatusRequest = { status, notes };
    return this.http.post(`${this.apiUrl}/${routeId}/stop/${stopId}/update`, payload);
  }

  completeRoute(routeId: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${routeId}/complete`, {});
  }
}
