import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Issue } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';

export interface IssueFormData {
  mode: 'create' | 'edit';
  issue?: Issue;
}

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create New Issue' : 'Edit Issue' }}</h2>

    <form [formGroup]="issueForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-fields">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
            <mat-error *ngIf="issueForm.get('title')?.hasError('required')">
              Title is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="4" placeholder="Describe the issue..."></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="open">Open</mat-option>
                <mat-option value="in_progress">In Progress</mat-option>
                <mat-option value="closed">Closed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Assignee</mat-label>
            <input matInput formControlName="assignee" placeholder="user@example.com">
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!issueForm.valid || isSubmitting">
          {{ data.mode === 'create' ? 'Create' : 'Update' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 500px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    mat-dialog-content {
      padding: 20px 24px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class IssueFormComponent implements OnInit {
  issueForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IssueFormData
  ) {
    this.issueForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['open'],
      priority: ['medium'],
      assignee: ['']
    });
  }

  ngOnInit() {
    if (this.data.mode === 'edit' && this.data.issue) {
      this.issueForm.patchValue({
        title: this.data.issue.title,
        description: this.data.issue.description,
        status: this.data.issue.status,
        priority: this.data.issue.priority,
        assignee: this.data.issue.assignee
      });
    }
  }

  onSubmit() {
    if (this.issueForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.issueForm.value;

      const operation = this.data.mode === 'create' 
        ? this.issueService.createIssue(formValue)
        : this.issueService.updateIssue(this.data.issue!.id, formValue);

      operation.subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving issue:', error);
          this.isSubmitting = false;
          // Handle error - show message to user
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}