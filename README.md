# 📋 Task Management System - Client Application

A responsive, high-performance web dashboard built to manage collaborative team workflows and track task lifecycles with role-based access controls. 

## 🚀 Live Demo Link
* **Production Deployment:** [https://task-management-frontend-coral.vercel.app](https://task-management-frontend-coral.vercel.app)

---

## 🛠️ Tech Stack & Key Dependencies
* **Core Framework:** React 18 with Vite.js (TypeScript)
* **Styling Framework:** Tailwind CSS (or your preferred UI kit)
* **State Management & Routing:** React Router DOM
* **HTTP Client:** Axios (configured with unified base intercepters for cross-origin credentials)

---

## ✨ Features Implemented
* **Authentication & Guarded Routing:** Complete JWT token lifecycle tracking with public/private route isolation.
* **Task Management Lifecycle (CRUD):** Seamless task insertion specifying title, description, due date, custom priority scales (Low, Medium, High), and pipeline progress trackers (Open, In Progress, Done).
* **Role-Based Architecture Matrix:** Multi-tier visualization engine segregating access privileges between Standard Users (who only track self-assigned or created records) and Administrators (who maintain master viewing permissions over all corporate tasks).
* **Advanced Pipeline Filtering:** Real-time data processing to filter records dynamically by priority tiers, workflow status, or direct string query matching.

---

## 📦 Local Installation & Setup

### 1. Repository Cloning
Clone the primary `main` branch to your workstation:
```bash
git clone -b main [https://github.com/Harshana-Prabhath/task-management-frontend.git](https://github.com/Harshana-Prabhath/task-management-frontend.git)
cd task-management-frontend
```
### 2. Dependency Resolution
Install all necessary application packages:
```bash
npm install
```

### 3. Environment Space Mapping
Create a root level environment file named .env and assign your backend target gateway path:
```bash
VITE_API_URL=http://localhost:5000/api
```

### 4. Booting the Development Engine
Launch the local Vite bundler container:
```bash
npm run dev
```




 