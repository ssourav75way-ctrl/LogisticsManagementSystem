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
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../../core/services/route.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Stop, Vehicle } from '../../../core/models';

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

      const stopsPayload = formValue.stops.map((stop: Partial<Stop>, index: number) => ({
        ...stop,
        stopNumber: index + 1,
      }));

      const payload = {
        ...formValue,
        stops: stopsPayload,
      };

      this.routeService.createRoute(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: Error) => console.error('Creation failed', err),
      });
    }
  }
}
