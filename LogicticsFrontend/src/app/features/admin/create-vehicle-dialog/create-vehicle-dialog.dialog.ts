import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-create-vehicle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-vehicle-dialog.dialog.html',
})
export class CreateVehicleDialog {
  vehicleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private dialogRef: MatDialogRef<CreateVehicleDialog>,
    private snackBar: MatSnackBar,
  ) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      vehicleType: ['', Validators.required],
      status: ['Idle', Validators.required],
      location: ['Warehouse', Validators.required],
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      const payload = this.vehicleForm.value;
      this.vehicleService.createVehicle(payload).subscribe({
        next: () => {
          this.snackBar.open('Vehicle created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => this.snackBar.open('Failed to create vehicle', 'Close', { duration: 3000 }),
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
