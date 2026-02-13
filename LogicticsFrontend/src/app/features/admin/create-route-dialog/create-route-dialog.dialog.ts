import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../../core/services/route.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Stop, Vehicle, CreateRouteRequest, CreateStopRequest } from '../../../core/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-route-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-route-dialog.dialog.html',
  styleUrl: './create-route-dialog.dialog.scss',
})
export class CreateRouteDialog implements OnInit {
  form: FormGroup;
  vehicles: Vehicle[] = [];

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private vehicleService: VehicleService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateRouteDialog>,
  ) {
    this.form = this.fb.group({
      routeNumber: ['', Validators.required],
      driverId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      estimatedDistance: [''],
      startTime: [new Date(), Validators.required],
      endTime: ['', Validators.required],
      notes: [''],
      stops: this.fb.array([]),
    });
  }

  get stops() {
    return this.form.get('stops') as FormArray;
  }

  createStopFormGroup(): FormGroup {
    return this.fb.group({
      stopNumber: [0],
      locationName: ['', Validators.required],
      expectedArrival: [new Date(), Validators.required],
      status: [0],
    });
  }

  addStop() {
    this.stops.push(this.createStopFormGroup());
  }

  removeStop(index: number) {
    this.stops.removeAt(index);
  }

  ngOnInit() {
    this.vehicleService.getVehicles().subscribe((data) => (this.vehicles = data));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const startTime = new Date(formValue.startTime);
      const endTime = new Date(formValue.endTime);

      if (startTime >= endTime) {
        this.snackBar.open('Start time must be before end time', 'Close', { duration: 5000 });
        return;
      }

      for (let i = 0; i < formValue.stops.length; i++) {
        const stop = formValue.stops[i];
        const arrival = new Date(stop.expectedArrival);
        if (arrival < startTime) {
          this.snackBar.open(
            `Stop "${stop.locationName || 'Stop ' + (i + 1)}" expected arrival is before the route start time`,
            'Close',
            { duration: 5000 },
          );
          return;
        }
        if (arrival > endTime) {
          this.snackBar.open(
            `Stop "${stop.locationName || 'Stop ' + (i + 1)}" expected arrival is after the route end time`,
            'Close',
            { duration: 5000 },
          );
          return;
        }
      }

      const stopsPayload: CreateStopRequest[] = formValue.stops.map(
        (stop: Partial<Stop>, index: number) => ({
          locationName: stop.locationName || '',
          expectedArrival: stop.expectedArrival || new Date(),
          stopNumber: index + 1,
        }),
      );

      const payload: CreateRouteRequest = {
        routeNumber: formValue.routeNumber,
        driverId: Number(formValue.driverId),
        vehicleId: Number(formValue.vehicleId),
        estimatedDistance: Number(formValue.estimatedDistance || 0),
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        notes: formValue.notes || '',
        stops: stopsPayload,
      };

      this.routeService.createRoute(payload).subscribe({
        next: (res: unknown) => {
          const result = res as { success?: boolean; message?: string };
          if (result?.success === false) {
            this.snackBar.open(result.message || 'Route creation failed', 'Close', {
              duration: 5000,
            });
          } else {
            this.snackBar.open('Route created successfully', 'OK', { duration: 3000 });
            this.dialogRef.close(true);
          }
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message || 'Route creation failed. Please check your inputs.';
          this.snackBar.open(msg, 'Close', { duration: 5000 });
        },
      });
    }
  }
}
