import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { 
    path: 'issues', 
    loadComponent: () => import('./issues/issues-list/issues-list.component').then(c => c.IssuesListComponent)
  },
  { 
    path: 'issues/:id', 
    loadComponent: () => import('./issues/issue-detail/issue-detail.component').then(c => c.IssueDetailComponent)
  }
];