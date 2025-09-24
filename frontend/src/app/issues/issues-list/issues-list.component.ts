import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Issue, IssuesResponse } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-issues-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],

  template: `
    <div class="issues-container">
      <div class="header">
        <h1>Issues</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Create Issue
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearchChange()" placeholder="Search issues...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="onFilterChange()">
            <mat-option value="">All</mat-option>
            <mat-option value="open">Open</mat-option>
            <mat-option value="in_progress">In Progress</mat-option>
            <mat-option value="closed">Closed</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select [(ngModel)]="priorityFilter" (selectionChange)="onFilterChange()">
            <mat-option value="">All</mat-option>
            <mat-option value="low">Low</mat-option>
            <mat-option value="medium">Medium</mat-option>
            <mat-option value="high">High</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Assignee</mat-label>
          <input matInput [(ngModel)]="assigneeFilter" (input)="onFilterChange()" placeholder="Filter by assignee">
        </mat-form-field>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="issues" matSort (matSortChange)="onSortChange($event)" class="issues-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let issue">{{ issue.id.substring(0, 8) }}...</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
            <td mat-cell *matCellDef="let issue" class="title-cell">{{ issue.title }}</td>
          </ng-container>

           <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let issue">
              <mat-chip [class]="'status-' + issue.status">{{ issue.status | titlecase }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
            <td mat-cell *matCellDef="let issue">
              <mat-chip [class]="'priority-' + issue.priority">{{ issue.priority | titlecase }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="assignee">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Assignee</th>
            <td mat-cell *matCellDef="let issue">{{ issue.assignee }}</td>
          </ng-container>

          <ng-container matColumnDef="updatedAt">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Updated</th>
            <td mat-cell *matCellDef="let issue">{{ issue.updatedAt | date:'short' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let issue">
              <button mat-icon-button (click)="openEditDialog(issue); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let issue; columns: displayedColumns;" 
              (click)="viewIssueDetail(issue)" class="clickable-row"></tr>
        </table>
      </div>

      <mat-paginator 
        [length]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 50]"
        [pageIndex]="currentPage - 1"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .issues-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      min-width: 200px;
    }

    .table-container {
      margin-bottom: 20px;
      overflow-x: auto;
    }

    .issues-table {
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;
    }

    .clickable-row:hover {
      background-color: #f5f5f5;
    }

    .title-cell {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-open { background-color: #e3f2fd; color: #1976d2; }
    .status-in_progress { background-color: #fff3e0; color: #f57c00; }
    .status-closed { background-color: #e8f5e8; color: #388e3c; }

    .priority-low { background-color: #f3e5f5; color: #7b1fa2; }
    .priority-medium { background-color: #fff3e0; color: #f57c00; }
    .priority-high { background-color: #ffebee; color: #d32f2f; }
  `]
})
export class IssuesListComponent implements OnInit {
  issues: Issue[] = [];
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'assignee', 'updatedAt', 'actions'];

  // Filter and pagination
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  
  // Sorting
  sortBy = 'updatedAt';
  sortOrder = 'desc';

  constructor(
    private issueService: IssueService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues() {
    this.issueService.getIssues(
      this.currentPage,
      this.pageSize,
      this.searchTerm || undefined,
      this.statusFilter || undefined,
      this.priorityFilter || undefined,
      this.assigneeFilter || undefined,
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next: (response: IssuesResponse) => {
        this.issues = response.issues;
        this.totalCount = response.pagination.total;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadIssues();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadIssues();
  }

  onSortChange(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction || 'asc';
    this.loadIssues();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadIssues();
  }

  viewIssueDetail(issue: Issue) {
    this.router.navigate(['/issues', issue.id]);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadIssues();
      }
    });
  }

  openEditDialog(issue: Issue) {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '600px',
      data: { mode: 'edit', issue: { ...issue } }
    });

    dialogRef.afterClosed().subscribe((result: IssueEditDialogResult) => {
      if (result) {
        this.loadIssues();
      }
    });

interface IssueEditDialogResult {
  // Add properties if you know the structure, otherwise keep it empty
}
  }
}


