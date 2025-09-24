export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuesResponse {
  issues: Issue[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}