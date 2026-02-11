import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models';

@Component({
  selector: 'app-assign-vehicle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './assign-vehicle-dialog.dialog.html',
  styleUrl: './assign-vehicle-dialog.dialog.scss',
})
export class AssignVehicleDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<AssignVehicleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicle: Vehicle },
  ) {
    this.form = this.fb.group({
      status: [data.vehicle.status, Validators.required],
      location: [data.vehicle.location],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.vehicleService
        .updateVehicleStatus({
          id: this.data.vehicle.id,
          ...this.form.value,
        })
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }
}
