# Dayflow – Human Resource Management System

> **Every workday, perfectly aligned.**

Dayflow is a **Human Resource Management System (HRMS)** designed to digitize and streamline essential HR operations within an organization.

The system provides separate experiences for **Admin/HR Officers** and **Employees**, allowing organizations to manage employee information, attendance, leave requests, payroll visibility, and approval workflows through a centralized platform.

---

## Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Objectives](#-objectives)
* [Key Features](#-key-features)
* [User Roles](#-user-roles)
* [System Modules](#-system-modules)
* [Application Workflow](#-application-workflow)
* [Functional Requirements](#-functional-requirements)
* [Non-Functional Requirements](#-non-functional-requirements)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Usage](#-usage)
* [Security](#-security)
* [Future Enhancements](#-future-enhancements)
* [Contributing](#-contributing)
* [License](#-license)
* [Contact](#-contact)

---

## Overview

Managing HR activities manually can be time-consuming and can lead to issues such as scattered employee records, difficulty tracking attendance, delayed leave approvals, and limited visibility into payroll information.

**Dayflow** aims to provide a centralized HR platform where employees and HR personnel can perform their respective tasks efficiently.

The system supports:

* Secure authentication
* Role-based authorization
* Employee profile management
* Attendance tracking
* Leave and time-off management
* Leave approval workflows
* Payroll/salary visibility
* Email and notification alerts
* Analytics and reports

These capabilities are part of the defined HRMS scope.

---

## Problem Statement

Organizations often manage employee information, attendance, leave requests, and salary-related information using multiple systems or manual processes.

This can result in:

* Difficulty maintaining employee records
* Time-consuming attendance management
* Delays in leave approvals
* Lack of centralized HR information
* Limited employee access to their own records
* Increased administrative workload
* Difficulty generating HR reports

Dayflow addresses these challenges by bringing important HR operations into a **single centralized system**.

---

## Objectives

The main objectives of Dayflow are:

1. Digitize common HR operations.
2. Provide secure user authentication.
3. Implement role-based access for Employees and Admin/HR Officers.
4. Centralize employee information.
5. Provide daily and weekly attendance tracking.
6. Simplify leave application and approval.
7. Provide employees with read-only salary information.
8. Allow HR/Admin users to manage payroll information.
9. Provide notifications and alerts.
10. Generate useful HR analytics and reports.

---

# Key Features

## 1. Authentication & Authorization

Dayflow provides secure account registration and login.

### Sign Up

Users can register using:

* Employee ID
* Email
* Password
* Role

Supported roles include:

* Employee
* HR/Admin

Email verification is required during registration.

### Sign In

Users can log in using:

```text
Email + Password
```

The system validates the credentials and redirects authenticated users to the appropriate dashboard.

Incorrect credentials result in an appropriate error message.

---

# User Roles

Dayflow supports two major user categories.

| Role             | Responsibilities                                             |
| ---------------- | ------------------------------------------------------------ |
| Admin / HR | Manage employees, attendance, leave approvals and payroll    |
| Employee   | View profile, attendance, salary details and apply for leave |

The Admin/HR role has management and approval privileges, while Employees have limited access to their own information.

---

# Dashboards

## Employee Dashboard

The Employee Dashboard provides quick access to:

* Profile
* Attendance
* Leave Requests
* Logout
* Recent activities
* Alerts

This allows employees to access their HR-related information from a single interface.

---

## Admin / HR Dashboard

The Admin/HR dashboard provides access to:

* Employee list
* Attendance records
* Leave requests
* Leave approvals
* Employee switching
* Payroll information
* HR reports

Admin/HR users can manage information across employees.

---

# Employee Profile Management

Dayflow provides centralized employee profile management.

## View Profile

Employees can view:

* Personal information
* Job details
* Salary structure
* Documents
* Profile picture

## Edit Profile

Employees can update limited information such as:

* Address
* Phone number
* Profile picture

Administrators can modify complete employee details.

---

# Attendance Management

Dayflow provides attendance tracking for employees and HR administrators.

## Attendance Features

Employees can:

* Check in
* Check out
* View daily attendance
* View weekly attendance

Attendance statuses include:

```text
Present
Absent
Half-day
Leave
```

### Access Control

Employees can view only their own attendance.

Admin/HR users can view attendance records for all employees.

---

# Leave & Time-Off Management

Employees can submit leave requests through the system.

## Leave Application

Employees can select:

* Leave type
* Start date
* End date
* Remarks

Supported leave types include:

* Paid Leave
* Sick Leave
* Unpaid Leave

## Leave Status

Every request can have one of the following statuses:

```text
Pending
Approved
Rejected
```

## Leave Approval

Admin/HR users can:

* View leave requests
* Approve requests
* Reject requests
* Add comments

Changes are reflected immediately in the employee's records.

---

# Payroll & Salary Management

Dayflow provides controlled access to salary and payroll information.

## Employee Payroll View

Employees can view their payroll information in **read-only mode**.

This prevents employees from directly modifying salary information.

## Admin Payroll Control

Administrators can:

* View payroll information of employees
* Update salary structures
* Maintain payroll accuracy

---

# Notifications & Reports

Dayflow also supports:

### Notifications

* Email alerts
* System notifications
* Leave-related updates
* Important HR alerts

### Reports & Analytics

The system can provide HR analytics and reports such as:

* Attendance reports
* Salary information
* Salary slips
* Employee-related reports

---

# Application Workflow

The general workflow of Dayflow can be represented as:

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Authentication   │
                    │  Sign Up / Login │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Role Validation  │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │    Employee     │       │    Admin / HR   │
       │    Dashboard    │       │    Dashboard    │
       └────────┬────────┘       └────────┬────────┘
                │                         │
        ┌───────┼────────┐       ┌────────┼─────────┐
        ▼       ▼        ▼       ▼        ▼         ▼
     Profile Attendance Leave  Employees Attendance Payroll
                         │
                         ▼
                  Leave Approval
```

---

# Functional Requirements

The major functional requirements of Dayflow include:

### Authentication

* User registration
* Email verification
* Login
* Password validation
* Error handling

### Authorization

* Employee role
* Admin/HR role
* Role-specific dashboards
* Restricted access to sensitive information

### Employee Management

* View employee profile
* Edit employee information
* Manage employee documents
* Manage profile pictures

### Attendance

* Check-in
* Check-out
* Daily attendance
* Weekly attendance
* Attendance status management

### Leave Management

* Apply for leave
* Select leave type
* Select date range
* Add remarks
* Approve/reject leave
* Add approval comments

### Payroll

* Employee salary visibility
* Admin payroll management
* Salary structure updates

### Reports

* Attendance reports
* Salary slips
* HR analytics

---

# Security

Security is an important part of Dayflow because the system handles employee and payroll-related information.

The application should implement:

* Secure authentication
* Password protection
* Email verification
* Role-based authorization
* Restricted employee data access
* Read-only employee payroll access
* Protected HR/Admin functionality
* Secure session management
* Input validation

Employees should only be able to access information belonging to their own account, while HR/Admin users have broader management privileges.

---

# Technology Stack

### Frontend

```text
HTML
JavaScript
React.js
```

### Backend

```text
Node.js
Express.js
```

### Database

```text
MongoDB
```

or the database used in your implementation.

### Authentication

```text
JWT / Session Authentication
Email Verification
Password Hashing
```

### Development Tools

```text
Git
GitHub
VS Code
Postman
```

---

# Getting Started

## Prerequisites

Before running Dayflow, make sure the following are installed:

* Git
* Node.js
* npm
* Database server/service
* VS Code or another code editor

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/dayflow.git
```

Navigate into the project:

```bash
cd dayflow
```

---

## 2. Install Dependencies

For the backend:

```bash
cd backend
npm install
```

For the frontend:

```bash
cd ../frontend
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

**Do not upload your actual `.env` file to GitHub.**

Instead, create:

```text
.env.example
```

with placeholder values.

---

## 4. Start the Backend

```bash
cd backend
npm start
```

The backend server should start on the configured port.

Example:

```text
http://localhost:5000
```

---

## 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm start
```

The application should then be accessible through the frontend development URL.

---

# Testing

Testing should cover the major workflows of the application.

### Authentication Testing

* Valid registration
* Invalid registration
* Valid login
* Invalid login
* Email verification
* Password validation

### Employee Testing

* View profile
* Edit permitted profile fields
* View attendance
* Check-in/check-out
* Apply for leave
* View leave status
* View salary information

### Admin Testing

* View employees
* View employee attendance
* Approve leave
* Reject leave
* Add comments
* View payroll
* Update salary structure

---

# Role-Based Access Example

| Feature                     | Employee | Admin/HR |
| --------------------------- | :------: | :------: |
| View own profile            |     ✅    |     ✅    |
| Edit limited profile fields |     ✅    |     ✅    |
| Edit all employee details   |     ❌    |     ✅    |
| View own attendance         |     ✅    |     ✅    |
| View all attendance         |     ❌    |     ✅    |
| Apply for leave             |     ✅    |    ❌/✅   |
| Approve leave               |     ❌    |     ✅    |
| View own salary             |     ✅    |     ✅    |
| View all payroll            |     ❌    |     ✅    |
| Update salary structure     |     ❌    |     ✅    |
| View HR reports             |  Limited |     ✅    |

---

# Main Modules

```text
Dayflow HRMS
│
├── Authentication
│   ├── Sign Up
│   ├── Sign In
│   └── Email Verification
│
├── Employee Management
│   ├── Employee Profile
│   ├── Job Details
│   └── Documents
│
├── Attendance
│   ├── Check-In
│   ├── Check-Out
│   ├── Daily View
│   └── Weekly View
│
├── Leave Management
│   ├── Apply Leave
│   ├── Pending Requests
│   ├── Approval
│   └── Rejection
│
├── Payroll
│   ├── Salary Details
│   ├── Salary Structure
│   └── Salary Slips
│
├── Notifications
│   ├── Email Alerts
│   └── System Alerts
│
└── Analytics
    ├── Attendance Reports
    └── Salary Reports
```

---

# Future Enhancements

The project can be extended with additional HR capabilities.

Possible future improvements include:

* Automated payroll calculation
* Biometric attendance integration
* Mobile application
* AI-powered HR analytics
* Employee performance tracking
* Recruitment management
* Automated payslip generation
* Advanced attendance analytics
* Employee self-service portal
* Calendar integration
* Automated email notifications
* Cloud deployment
* Multi-organization support

---

# Project Design

The project design/flow can be viewed through the associated Excalidraw diagram:

**Dayflow System Design:**
https://link.excalidraw.com/l/65VNwvy7c4X/58RLEJ4oOwh

---

# 📜 License

This project is developed for **educational and academic purposes**.


---

# 👩‍💻 Project Information

### Project Name

**Dayflow – Human Resource Management System**

### Tagline

> **Every workday, perfectly aligned.**

### Project Category

**Human Resource Management System (HRMS)**

### Core Focus

```text
Employee Management
Attendance
Leave Management
Payroll Visibility
Role-Based Access
HR Approval Workflows
Reports & Analytics
```

---

# ⭐ Acknowledgement

Dayflow was designed to simplify and digitize common HR operations by providing employees and HR/Admin personnel with a centralized platform for managing employee-related activities.

The system requirements cover authentication, role-based access, employee profiles, attendance, leave management, payroll, notifications, and reporting.

---

## 📌 Project Status

```text
🚧 Under Development
```

The implementation may evolve as additional features, integrations, testing, and deployment configurations are added.

---

## ⭐ If you find this project useful

Consider giving the repository a ⭐ on GitHub!
