from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# In-memory storage for issues (in production, use a database)
issues = []

# Sample data
sample_issues = [
    {
        "id": str(uuid.uuid4()),
        "title": "Fix login bug",
        "description": "Users cannot log in with special characters in password",
        "status": "open",
        "priority": "high",
        "assignee": "john.doe@example.com",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Improve UI responsiveness",
        "description": "The application should work better on mobile devices",
        "status": "in_progress",
        "priority": "medium",
        "assignee": "jane.smith@example.com",
        "createdAt": "2024-01-14T09:15:00Z",
        "updatedAt": "2024-01-16T14:22:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Add dark mode",
        "description": "Implement dark mode theme for better user experience",
        "status": "closed",
        "priority": "low",
        "assignee": "bob.wilson@example.com",
        "createdAt": "2024-01-10T16:45:00Z",
        "updatedAt": "2024-01-18T11:30:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Database performance optimization",
        "description": "Optimize slow queries in the user management module",
        "status": "open",
        "priority": "high",
        "assignee": "alice.brown@example.com",
        "createdAt": "2024-01-12T13:20:00Z",
        "updatedAt": "2024-01-17T09:45:00Z"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Update documentation",
        "description": "API documentation needs to be updated with latest changes",
        "status": "in_progress",
        "priority": "medium",
        "assignee": "charlie.davis@example.com",
        "createdAt": "2024-01-11T08:00:00Z",
        "updatedAt": "2024-01-16T15:10:00Z"
    }
]

issues.extend(sample_issues)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

@app.route('/issues', methods=['GET'])
def get_issues():
    """Get all issues with optional search, filtering, sorting, and pagination"""
    try:
        # Get query parameters
        search = request.args.get('search', '').lower()
        status_filter = request.args.get('status', '')
        priority_filter = request.args.get('priority', '')
        assignee_filter = request.args.get('assignee', '')
        sort_by = request.args.get('sortBy', 'updatedAt')
        sort_order = request.args.get('sortOrder', 'desc')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('pageSize', 10))
        
        filtered_issues = issues.copy()
        
        # Apply search filter
        if search:
            filtered_issues = [
                issue for issue in filtered_issues 
                if search in issue['title'].lower() or search in issue['description'].lower()
            ]
        
        # Apply status filter
        if status_filter:
            filtered_issues = [
                issue for issue in filtered_issues 
                if issue['status'].lower() == status_filter.lower()
            ]
        
        # Apply priority filter
        if priority_filter:
            filtered_issues = [
                issue for issue in filtered_issues 
                if issue['priority'].lower() == priority_filter.lower()
            ]
        
        # Apply assignee filter
        if assignee_filter:
            filtered_issues = [
                issue for issue in filtered_issues 
                if assignee_filter.lower() in issue['assignee'].lower()
            ]
        
        # Apply sorting
        reverse_order = sort_order.lower() == 'desc'
        if sort_by in ['createdAt', 'updatedAt']:
            filtered_issues.sort(key=lambda x: x[sort_by], reverse=reverse_order)
        else:
            filtered_issues.sort(key=lambda x: x.get(sort_by, ''), reverse=reverse_order)
        
        # Apply pagination
        total_count = len(filtered_issues)
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_issues = filtered_issues[start_index:end_index]
        
        return jsonify({
            "issues": paginated_issues,
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "total": total_count,
                "totalPages": (total_count + page_size - 1) // page_size
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/issues/<issue_id>', methods=['GET'])
def get_issue(issue_id):
    """Get a single issue by ID"""
    try:
        issue = next((issue for issue in issues if issue['id'] == issue_id), None)
        if not issue:
            return jsonify({"error": "Issue not found"}), 404
        return jsonify(issue)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/issues', methods=['POST'])
def create_issue():
    """Create a new issue"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('title'):
            return jsonify({"error": "Title is required"}), 400
        
        # Create new issue
        new_issue = {
            "id": str(uuid.uuid4()),
            "title": data['title'],
            "description": data.get('description', ''),
            "status": data.get('status', 'open'),
            "priority": data.get('priority', 'medium'),
            "assignee": data.get('assignee', ''),
            "createdAt": datetime.utcnow().isoformat() + 'Z',
            "updatedAt": datetime.utcnow().isoformat() + 'Z'
        }
        
        issues.append(new_issue)
        return jsonify(new_issue), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/issues/<issue_id>', methods=['PUT'])
def update_issue(issue_id):
    """Update an existing issue"""
    try:
        data = request.get_json()
        
        # Find the issue
        issue_index = next((i for i, issue in enumerate(issues) if issue['id'] == issue_id), None)
        if issue_index is None:
            return jsonify({"error": "Issue not found"}), 404
        
        # Update the issue
        issue = issues[issue_index]
        if 'title' in data:
            issue['title'] = data['title']
        if 'description' in data:
            issue['description'] = data['description']
        if 'status' in data:
            issue['status'] = data['status']
        if 'priority' in data:
            issue['priority'] = data['priority']
        if 'assignee' in data:
            issue['assignee'] = data['assignee']
        
        issue['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
        
        return jsonify(issue)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)