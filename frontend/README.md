# Issue Tracker Application

A modern web application built with Angular for tracking and managing issues/tickets.

## Features

- View list of issues with sorting and filtering
- Create new issues
- Update existing issues
- Delete issues
- View detailed issue information
- Material Design UI components

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17.1.0)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd issue-tracker
```


2. Install dependencies for backend:

```bash
cd backend
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt
python app.py
```  

3. Install dependencies for frontend:
```bash
cd ..
ng new frontend --routing --style=css
cd frontend
npm install @angular/material @angular/cdk
npm install @angular/router          
npm install --legacy-peer-deps
```

## Development Server

Run the development server:
```bash
ng serve
```

Navigate to `http://localhost:4200` in your browser. The application will automatically reload if you change any of the source files.

## Project Structure
```
issue-tracker/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── requirements.txt
│   └── .gitignore
└── frontend/
    └── issue-tracker-app/
        └── (Angular project files)

```

```
frontend/src/app/
├── models/
│   └── issue.model.ts
├── services/
│   └── issue.service.ts
├── components/
│   ├── issue-list/
│   │   ├── issue-list.component.ts
│   │   
│   ├── issue-detail/
│   │   ├── issue-detail.component.ts
│   │  
│   └── issue-form/
│       ├── issue-form.component.ts
|
├── app.component.ts
├── app.component.html
├── app.component.css
├── app.module.ts
└── app-routing.module.ts
```

## Technologies Used

- Angular 17.1.0
- Angular Material
- TypeScript
- RxJS
- Angular CLI

## Configuration

The application configuration can be found in:
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies

## Available Scripts

- `ng serve` - Starts development server
- `ng build` - Builds the project
- `ng test` - Runs unit tests
- `ng e2e` - Runs end-to-end tests

## Development Notes

- The application uses standalone components
- Angular Material is used for UI components
- Lazy loading is implemented for issue modules
- The server runs on port 4200 by default

