import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export interface RouteAssignmentSummary {
  routeNumber: string;
  driverName: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: string[];
  summary: RouteAssignmentSummary[];
}

@Component({
  selector: 'app-bulk-upload-summary-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './bulk-upload-summary-dialog.dialog.html',
  styles: [
    `
      .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .stats {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }
      .stat-item {
        text-align: center;
      }
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        display: block;
      }
      .stat-label {
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
      }
      .errors-section {
        margin-top: 20px;
        color: #f44336;
        font-size: 14px;
      }
      .errors-list {
        max-height: 150px;
        overflow-y: auto;
        background: #fff9f9;
        padding: 10px;
        border: 1px solid #ffcdd2;
        border-radius: 4px;
      }
      .success-text {
        color: #4caf50;
      }
      .fail-text {
        color: #f44336;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #eee;
        font-size: 13px;
      }
      .status-badge {
        font-size: 11px;
        padding: 2px 6px;
        background: #e3f2fd;
        color: #1976d2;
        border-radius: 4px;
        font-weight: bold;
      }
    `,
  ],
})
export class BulkUploadSummaryDialog {
  displayedColumns: string[] = ['route', 'driver', 'vehicle', 'time'];

  constructor(
    public dialogRef: MatDialogRef<BulkUploadSummaryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BulkUploadResponse,
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
