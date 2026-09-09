# Dayflow – Human Resource Management System

> **Every workday, perfectly aligned.**

Dayflow is a full-stack **Human Resource Management System (HRMS)** designed to digitize and streamline essential HR operations through a centralized platform.

The system provides separate role-based experiences for **Employees** and **Admin/HR Officers**, allowing organizations to manage employee information, attendance, leave requests, payroll information, approval workflows, notifications, and reports from a single platform.

---

## Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Objectives](#-objectives)
* [Key Features](#-key-features)
* [User Roles](#-user-roles)
* [Feature Access Matrix](#-feature-access-matrix)
* [System Modules](#-system-modules)
* [Application Workflow](#-application-workflow)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Configuration](#-environment-configuration)
* [Running the Application](#-running-the-application)
* [Testing](#-testing)
* [Screenshots](#-screenshots)
* [Security & Access Control](#-security--access-control)
* [Project Status](#-project-status)
* [Future Enhancements](#-future-enhancements)
* [Contributors](#-contributors)
* [License](#-license)

---

# Overview

Human resource activities such as employee management, attendance tracking, leave processing, and salary management can become difficult to maintain when handled manually or across disconnected systems.

**Dayflow** provides a centralized digital HR platform where employees can access their personal HR information and perform everyday HR tasks, while Admin/HR users can manage employees and monitor organizational HR operations.

The system is designed around **role-based access**, providing different capabilities depending on whether the logged-in user is an Employee or Admin/HR Officer.

The project scope includes authentication, employee profile management, attendance tracking, leave management, payroll visibility, approval workflows, notifications, and reporting.

---

# Problem Statement

Traditional HR processes can involve:

* Manual employee records
* Spreadsheet-based attendance
* Delayed leave approvals
* Scattered employee information
* Limited employee access to HR information
* Manual salary/payroll management
* Increased administrative workload
* Difficulty generating HR reports

These processes can result in inefficiency, duplication of work, and difficulty maintaining up-to-date records.

### Proposed Solution

Dayflow brings core HR operations together into one centralized platform.

Employees can access their own HR information and submit requests, while Admin/HR users can manage employee records, attendance, leave approvals, salary information, and HR-related activities.

---

# Objectives

The primary objectives of Dayflow are:

1. Digitize common HR operations.
2. Provide secure user authentication.
3. Implement role-based access control.
4. Centralize employee information.
5. Simplify attendance tracking.
6. Streamline leave application and approval.
7. Provide controlled payroll and salary visibility.
8. Reduce manual HR workload.
9. Provide notifications and alerts.
10. Support HR reports and analytics.

---

# Key Features

## Authentication & Authorization

* User registration
* User login
* Employee ID-based registration
* Email-based authentication
* Password authentication
* Role selection
* Employee and Admin/HR roles
* Role-based dashboard access
* Authentication error handling

---

## Employee Profile Management

Employees can access their HR profile containing:

* Personal details
* Job details
* Salary structure
* Documents
* Profile picture

Employees can edit permitted information such as:

* Address
* Phone number
* Profile picture

Admin/HR users have broader employee-management privileges.

---

## Attendance Management

Dayflow provides centralized attendance tracking.

### Employee features

* Check-in
* Check-out
* Daily attendance view
* Weekly attendance view
* Personal attendance history

### Attendance statuses

* 🟢 Present
* 🔴 Absent
* 🟡 Half-day
* 🔵 Leave

### Admin/HR features

* View employee attendance
* Monitor attendance records
* Switch between employees
* Manage attendance-related information

---

## Leave & Time-Off Management

Employees can apply for leave through the platform.

### Leave application

Employees can:

* Select leave type
* Select date range
* Add remarks
* Submit leave requests
* Track request status

### Supported leave types

* Paid Leave
* Sick Leave
* Unpaid Leave

### Leave statuses

```text
Pending
   │
   ├──► Approved
   │
   └──► Rejected
```

### Admin/HR

Admin/HR users can:

* View leave requests
* Approve leave
* Reject leave
* Add comments
* Monitor leave records

---

## Payroll & Salary Management

Dayflow provides controlled access to salary and payroll information.

### Employee

Employees can:

* View salary information
* Access payroll-related details
* View salary information in read-only mode

### Admin/HR

Admin/HR users can:

* View employee payroll information
* Update salary structures
* Manage salary-related information
* Maintain payroll accuracy

---

## Dashboards

### Employee Dashboard

Provides quick access to:

* Profile
* Attendance
* Leave requests
* Payroll information
* Recent activity
* Alerts
* Logout

### Admin/HR Dashboard

Provides access to:

* Employee list
* Attendance records
* Leave requests
* Leave approvals
* Payroll information
* Employee management
* Reports and analytics

---

## Notifications & Alerts

The system supports HR-related notifications and alerts.

These can be used to communicate events such as:

* Leave request updates
* Approval/rejection status
* Important HR activities
* Other relevant alerts

---

## Reports & Analytics

Dayflow supports HR-related reports and analytics.

Possible reports include:

* Attendance reports
* Salary information
* Salary slips
* Employee-related reports

These help Admin/HR users monitor HR operations and make better decisions.

---

# User Roles

## Admin / HR Officer

Admin/HR users have management and approval privileges.

They can:

* Manage employees
* View employee information
* Monitor attendance
* Approve/reject leave
* Manage salary information
* View HR records
* Access reports and analytics

## Employee

Employees have access to their own HR information.

They can:

* View their profile
* Edit permitted profile fields
* Check in/out
* View attendance
* Apply for leave
* Track leave requests
* View salary information

---

# Feature Access Matrix

| Feature                      | Employee | Admin / HR |
| ---------------------------- | :------: | :--------: |
| Sign Up                      |     ✅    |      ✅     |
| Sign In                      |     ✅    |      ✅     |
| View Profile                 |     ✅    |      ✅     |
| Edit Personal Information    |     ✅    |      ✅     |
| Manage All Employee Profiles |     ❌    |      ✅     |
| Check-In / Check-Out         |     ✅    |      ✅     |
| View Own Attendance          |     ✅    |      ✅     |
| View All Employee Attendance |     ❌    |      ✅     |
| Apply for Leave              |     ✅    |      ❌     |
| View Leave Status            |     ✅    |      ✅     |
| Approve Leave                |     ❌    |      ✅     |
| Reject Leave                 |     ❌    |      ✅     |
| Add Approval Comments        |     ❌    |      ✅     |
| View Salary Information      |     ✅    |      ✅     |
| Update Salary Structure      |     ❌    |      ✅     |
| HR Reports                   |  Limited |      ✅     |
| Employee Management          |     ❌    |      ✅     |

---

# System Modules

```text
                    ┌──────────────────────┐
                    │       DAYFLOW        │
                    │        HRMS          │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌───────────────┐             ┌───────────────┐
        │   EMPLOYEE    │             │   ADMIN / HR  │
        └───────┬───────┘             └───────┬───────┘
                │                             │
       ┌────────┼────────┐          ┌─────────┼──────────┐
       ▼        ▼        ▼          ▼         ▼          ▼
    Profile  Attendance Leave   Employees Attendance  Leave
       │        │        │          │         │       Approval
       │        │        │          │         │          │
       └────────┴────────┘          └─────────┴──────────┘
                │                             │
                └─────────────┬───────────────┘
                              ▼
                    ┌──────────────────┐
                    │ Payroll / Reports│
                    └──────────────────┘
```

---

# Application Workflow

```text
                         ┌───────────┐
                         │   User    │
                         └─────┬─────┘
                               │
                               ▼
                    ┌───────────────────┐
                    │ Register / Login  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   Authentication  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Role Verification│
                    └─────────┬─────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Employee        │       │ Admin / HR      │
        │ Dashboard       │       │ Dashboard       │
        └────────┬────────┘       └────────┬────────┘
                 │                         │
       ┌─────────┼──────────┐     ┌────────┼───────────┐
       ▼         ▼          ▼     ▼        ▼           ▼
    Profile  Attendance   Leave Employees Attendance Leave
                                      │                  │
                                      ▼                  ▼
                                   Payroll          Approval
                                      │                  │
                                      └────────┬─────────┘
                                               ▼
                                      Reports / Analytics
```

---

# System Architecture

Dayflow follows a **frontend–backend architecture**.

```text
┌────────────────────────────────────────────────────────┐
│                       CLIENT                           │
│                                                        │
│                  React Frontend                        │
│                                                        │
│     Login │ Dashboard │ Profile │ Attendance │ Leave  │
└─────────────────────────┬──────────────────────────────┘
                          │
                          │ HTTP / API Requests
                          ▼
┌────────────────────────────────────────────────────────┐
│                       SERVER                           │
│                                                        │
│                  Backend Application                   │
│                                                        │
│   Routes → Middleware → Controllers → Business Logic  │
│                          │                             │
│                          ▼                             │
│                        Models                          │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     Database     │
                 └──────────────────┘
```

The repository separates the frontend and backend applications. The backend contains dedicated `controllers`, `middleware`, `models`, `routes`, and `utils` directories.

---

# Technology Stack

### Frontend

* React
* JavaScript
* HTML
* CSS
* Create React App

### Backend

* Node.js
* Express-based backend architecture
* REST-style API structure
* Controllers
* Middleware
* Routes
* Models
* Utility modules

### Development Tools

* Git
* GitHub
* npm
* Visual Studio Code / preferred IDE

---

# Project Structure

```text
Dayflow/
│
├── backend/
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│   ├── login.png
│   ├── employee-dashboard.png
│   ├── admin-dashboard.png
│   ├── profile.png
│   ├── attendance.png
│   ├── leave-management.png
│   ├── payroll.png
│   └── reports.png
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Prerequisites

Install the following before running Dayflow:

* [Node.js](https://nodejs.org/)
* npm
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/vijayalakshmisulikeri-commits/Dayflow.git
```

Navigate to the project:

```bash
cd Dayflow
```

---

# ⚙️ Environment Configuration

If your application uses environment variables, create the required `.env` files based on the variables used by your implementation.

Example:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

### Important

Never commit sensitive information such as:

```text
.env
passwords
API keys
database credentials
JWT secrets
private tokens
```

Use `.env.example` to document required variables without exposing their actual values.

---

# Running the Application

## Backend

Open a terminal:

```bash
cd backend
npm install
```

Start the backend using the appropriate script defined in `backend/package.json`:

```bash
npm start
```

If the project uses a development script instead:

```bash
npm run dev
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The React development server will normally be available at:

```text
http://localhost:3000
```

---

# Testing

For the React frontend:

```bash
cd frontend
npm test
```

To create a production build:

```bash
npm run build
```

If automated backend tests have been added, document their commands here as well.

---

# Screenshots

Screenshots should be stored inside the `screenshots/` directory.

## Login

![Dayflow Login](screenshots/login.png)

---

## Employee Dashboard

![Employee Dashboard](screenshots/employee-dashboard.png)

---

## Admin / HR Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

---

## Employee Profile

![Employee Profile](screenshots/profile.png)

---

## Attendance Management

![Attendance](screenshots/attendance.png)

---

## Leave Management

![Leave Management](screenshots/leave-management.png)

---

## Payroll

![Payroll](screenshots/payroll.png)

---

## Reports & Analytics

![Reports](screenshots/reports.png)

> Replace the image filenames above with the actual screenshot filenames you upload to the repository.

---

# Security & Access Control

Dayflow follows role-based access principles to ensure that employees and Admin/HR users have appropriate permissions.

Security considerations include:

* Authentication before accessing protected functionality
* Role-based authorization
* Employee-specific information access
* Restricted payroll modification
* Controlled profile editing
* Admin/HR management privileges
* Protection of environment variables and credentials

Sensitive credentials should never be stored directly in source code or committed to GitHub.

---

# Demo

A demonstration of the completed Dayflow HRMS application can be provided as part of the project presentation.

If the application is deployed, add the live application URL here:

```text
Live Demo: <deployment-link>
```

---

# Project Status

### Completed

Dayflow has been developed as a full-stack Human Resource Management System implementing the core HR workflows defined for the project.

The system includes:

* Authentication
* Role-based access
* Employee management
* Attendance management
* Leave management
* Leave approval workflows
* Payroll/salary management
* Notifications and alerts
* Reports and analytics

---

# Future Enhancements

Although the core system is completed, the following improvements can be considered in future versions:

* Advanced HR analytics
* More detailed attendance reports
* Automated salary-slip generation
* Enhanced email notification system
* Additional HR workflows
* Advanced reporting dashboards
* Integration with external payroll systems
* Cloud deployment and scalability improvements
* Mobile application support

---

# Contributors

| Team Member                | Contribution          |
| -------------------------- | --------------------- |
| **Vijayalakshmi Sulikeri** | Frontend development  |
| **Mrudhula P**             | Backend development   |
| **Khushi Patil**           | Backend development   |

---

# Project Documentation

The project requirements define Dayflow around secure authentication, role-based access, employee profiles, attendance tracking, leave management, payroll visibility/control, notifications, and reporting.

The requirements also specify that employees should be able to view their own attendance while Admin/HR users can access attendance across employees.

Leave requests support paid, sick, and unpaid leave, with Pending, Approved, and Rejected states and Admin/HR approval.

---

# License

This project was developed for **academic and educational purposes**.

---

# Dayflow

> **Every workday, perfectly aligned.**

A centralized HR platform designed to make everyday employee and HR operations **simpler, organized, and accessible**.

---

## 🔗 Repository

**GitHub:**
https://github.com/vijayalakshmisulikeri-commits/Dayflow
