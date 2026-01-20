Here is a README you can copy–paste into `frontend/README.md` or a new `README.md` at the repo root:

```markdown
# Sentra – Incident Reporting & Response Dashboard

Sentra is a MERN-based web application designed for educational institutions to enable safe, transparent incident reporting and response. It supports students, staff, and administrators with role-based access, secure reporting, tracking, and an awareness hub. [file:2]

## Features

- **Role-based access (JWT auth)**  
  - Separate flows for **Student**, **Staff**, and **Admin** users.  
  - Protected routes and APIs with JSON Web Tokens. [file:2]

- **Incident Reporting (Student)**  
  - Form to submit incidents with title, description, category, priority, location, date.  
  - Option to report **anonymously**.  
  - Each report gets a unique reference ID. [file:2]

- **Tracking Dashboard (Student)**  
  - “My Incidents” table showing status: Pending / In Review / Resolved.  
  - Reference ID, category, priority, created date.

- **Admin Panel**  
  - View all incidents in a management table.  
  - Filter by status, category, priority.  
  - Update status (Pending → In Review → Resolved).  
  - **Assign incidents** to staff (handling responsibility). [file:2]

- **Staff Dashboard**  
  - Staff see **only incidents assigned to them**.  
  - Quick view of reference, category, priority, status.

- **Awareness Hub**  
  - Cards for campus policies, safety guidelines, helplines, and tips.  
  - Content managed via `/api/awareness`. [file:2]

- **Modern UI / UX**  
  - Built with **React** + **Material UI**.  
  - Responsive dashboards, light/dark mode toggle, analytics cards on admin dashboard.

## Tech Stack

- **Frontend:** React, React Router, Material UI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT-based authentication & role-based access control [file:2]

## Project Structure

```
Sentra/
  backend/
    config/
    models/
    routes/
    server.js
  frontend/
    public/
    src/
      components/
      context/
      pages/
      App.js
      theme.js
```

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/Sohan1606/sentra-incident-dashboard.git
cd sentra-incident-dashboard
```

### 2. Backend setup

```
cd backend
npm install
```

Create a `.env` file in `backend`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run backend:

```
npm start
```

Backend will run on `http://13.205.179.91:5000`.

### 3. Frontend setup

In another terminal:

```
cd frontend
npm install
npm start
```

Frontend will run on `http://13.205.179.91:3000`.

## Default Users (example)

You can create users via the `/api/auth/register` API or seed them manually. Example roles:

- **Admin:** `admin@sentra.com` / `Admin123`  
- **Staff:** `staff@sentra.com` / `Staff123`  
- **Student:** `student@sentra.com` / `Student123`

## Main Flows

- **Student:**  
  Login → Report Incident → View “My Incidents” → Check Awareness Hub.

- **Admin:**  
  Login → View Dashboard stats → Manage Incidents (filter, update status, assign staff) → View Awareness Hub. [file:2]

- **Staff:**  
  Login → View Staff Dashboard → See and handle incidents assigned by admin.

## Future Enhancements

- Real-time notifications / email alerts when incidents are created or resolved. [file:2]  
- More detailed analytics & charts on Admin Dashboard.  
- Richer awareness content (PDFs, videos, external resources).  
- More advanced UI animations and 3D-style visualizations.

---

Feel free to fork this repository and extend it for other organizations or safety use-cases.
```
