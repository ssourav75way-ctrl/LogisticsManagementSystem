import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../../core/services/route.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Route, Stop, Vehicle } from '../../../core/models';

@Component({
  selector: 'app-edit-route-dialog',
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
    ReactiveFormsModule,
  ],
  templateUrl: './edit-route-dialog.dialog.html',
  styleUrl: './edit-route-dialog.dialog.scss',
})
export class EditRouteDialog implements OnInit {
  form: FormGroup;
  vehicles: Vehicle[] = [];

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<EditRouteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { route: Route },
  ) {
    this.form = this.fb.group({
      routeNumber: [data.route.routeNumber, Validators.required],
      driverId: [data.route.driverId, Validators.required],
      vehicleId: [data.route.vehicleId, Validators.required],
      status: [data.route.status, Validators.required],
      estimatedDistance: [data.route.estimatedDistance || 0],
      startTime: [new Date(data.route.startTime), Validators.required],
      endTime: [new Date(data.route.endTime), Validators.required],
      notes: [data.route.notes || ''],
      stops: this.fb.array([]),
    });

    if (data.route.stops && data.route.stops.length > 0) {
      data.route.stops.forEach((stop: Stop) => {
        this.stops.push(this.createStopFormGroup(stop));
      });
    }
  }

  get stops() {
    return this.form.get('stops') as FormArray;
  }

  createStopFormGroup(stop?: Partial<Stop>): FormGroup {
    return this.fb.group({
      id: [stop?.id || 0],
      stopNumber: [stop?.stopNumber || 0],
      locationName: [stop?.locationName || '', Validators.required],
      expectedArrival: [
        stop?.expectedArrival ? new Date(stop.expectedArrival) : new Date(),
        Validators.required,
      ],
      status: [stop?.status || 0],
      notes: [stop?.notes || ''],
    });
  }

  addStop() {
    this.stops.push(this.createStopFormGroup());
  }

  addStopAt(index: number) {
    this.stops.insert(index, this.createStopFormGroup());
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

      const stopsPayload = formValue.stops.map((stop: Stop, index: number) => ({
        ...stop,
        stopNumber: index + 1,
      }));

      const payload: Partial<Route> & { stops: Partial<Stop>[] } = {
        id: this.data.route.id,
        routeNumber: formValue.routeNumber,
        driverId: Number(formValue.driverId),
        vehicleId: Number(formValue.vehicleId),
        status: Number(formValue.status),
        estimatedDistance: Number(formValue.estimatedDistance || 0),
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        notes: formValue.notes || '',
        stops: stopsPayload,
      };

      this.routeService.updateRoute(this.data.route.id, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: Error) => console.error('Update failed', err),
      });
    }
  }
}
