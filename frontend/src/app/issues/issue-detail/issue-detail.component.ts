import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Issue } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="issue-detail-container" *ngIf="issue">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Issue Details</h1>
      </div>

      <mat-card class="issue-card">
        <mat-card-header>
          <mat-card-title>{{ issue.title }}</mat-card-title>
          <mat-card-subtitle>ID: {{ issue.id }}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="issue-meta">
            <div class="meta-item">
              <strong>Status:</strong>
              <mat-chip [class]="'status-' + issue.status">{{ issue.status | titlecase }}</mat-chip>
            </div>
            
            <div class="meta-item">
              <strong>Priority:</strong>
              <mat-chip [class]="'priority-' + issue.priority">{{ issue.priority | titlecase }}</mat-chip>
            </div>
            
            <div class="meta-item">
              <strong>Assignee:</strong>
              <span>{{ issue.assignee || 'Unassigned' }}</span>
            </div>
            
            <div class="meta-item">
              <strong>Created:</strong>
              <span>{{ issue.createdAt | date:'medium' }}</span>
            </div>
            
            <div class="meta-item">
              <strong>Updated:</strong>
              <span>{{ issue.updatedAt | date:'medium' }}</span>
            </div>
          </div>

          <div class="description-section">
            <h3>Description</h3>
            <p class="description">{{ issue.description || 'No description provided.' }}</p>
          </div>

          <div class="json-section">
            <h3>Full JSON</h3>
            <pre class="json-display">{{ issueJson }}</pre>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <div *ngIf="!issue" class="loading">
      Loading issue details...
    </div>
  `,
  styles: [`
    .issue-detail-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0 0 0 10px;
    }

    .issue-card {
      margin-bottom: 20px;
    }

    .issue-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .meta-item strong {
      min-width: 80px;
    }

    .description-section {
      margin-bottom: 30px;
    }

    .description {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #2196f3;
      margin: 10px 0;
      white-space: pre-wrap;
    }

    .json-section h3 {
      margin-bottom: 10px;
    }

    .json-display {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      border: 1px solid #ddd;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
    }

    .loading {
      text-align: center;
      padding: 50px;
      font-size: 16px;
      color: #666;
    }

    .status-open { background-color: #e3f2fd; color: #1976d2; }
    .status-in_progress { background-color: #fff3e0; color: #f57c00; }
    .status-closed { background-color: #e8f5e8; color: #388e3c; }

    .priority-low { background-color: #f3e5f5; color: #7b1fa2; }
    .priority-medium { background-color: #fff3e0; color: #f57c00; }
    .priority-high { background-color: #ffebee; color: #d32f2f; }
  `]
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  issueJson = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIssue(id);
    }
  }

  loadIssue(id: string) {
    this.issueService.getIssue(id).subscribe({
      next: (issue: Issue) => {
        this.issue = issue;
        this.issueJson = JSON.stringify(issue, null, 2);
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        // Handle error - maybe show a message or redirect
      }
    });
  }

  goBack() {
    this.router.navigate(['/issues']);
  }
}