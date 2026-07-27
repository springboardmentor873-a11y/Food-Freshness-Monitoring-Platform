# FreshEye AI - Frontend

This repository contains the frontend of the **FreshEye AI** food freshness monitoring platform. It was developed as part of an internship project at Infosys using **React** and **Vite**. The application provides a modern dashboard for monitoring food freshness, managing inventory, visualizing analytics, and simulating AI-based freshness assessment using mock data.

> **Note:** This repository contains only the frontend application. Backend services, APIs, authentication servers, and machine learning model training are not included. The application uses mock data and simulated API responses to demonstrate functionality and can be connected to a real backend in the future.

---

## Tech Stack

* React 18
* Vite
* Tailwind CSS
* React Router DOM
* Framer Motion
* Lucide React
* Recharts
* React Hook Form
* React Hot Toast

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Authentication

Authentication is simulated using **localStorage** since this project does not include a backend server.

You can:

* Sign up as one of the available roles:

  * Consumer
  * Retail Manager
  * Warehouse Operator
  * Food Quality Inspector
  * Administrator
* Log in using any registered email and password.
* Use the demo administrator account:

  * **Email:** `admin@fresheye.ai`
  * **Password:** Any password

The administrator account provides access to the **User Management** module.

---

## Project Structure

```
src/
│
├── assets/          Static assets
├── components/      Reusable UI components
├── layouts/         Application layouts
├── pages/           Application pages
├── services/        Simulated API layer
├── routes/          Route configuration
├── context/         React Context providers
├── hooks/           Custom React hooks
├── utils/           Helper functions
├── data/            Mock data generation
└── styles/          Global styles
```

---

## Features

* Landing Page
* User Authentication (Login & Signup)
* Role Selection
* Dashboard
* Food Inventory Management

  * Search
  * Filter
  * Pagination
  * Add, Edit, and Delete Items
* Image Analysis

  * Drag & Drop Upload
  * Camera Upload
  * File Browser Upload
* Freshness Assessment
* Shelf-Life Prediction
* Storage Monitoring
* Food Recommendations
* Analytics Dashboard
* Reports
* Notifications
* User Profile
* Settings

  * Light/Dark Theme
  * Language Preferences
  * Notification Preferences
* About Project
* User Management (Administrator)
* Custom 404 Page

---

## Project Notes

* Mock inventory, analytics, and report data are generated programmatically to provide consistent demonstration data.
* Notification status is stored in **localStorage** and remains available across browser sessions.
* Theme preferences are also stored in **localStorage**.
* The simulated API layer is located in `src/services/api.js`, making it easier to integrate a real backend in the future without modifying the UI components.

---

## Future Enhancements

Some planned improvements include:

* Integrate a FastAPI backend
* Connect a trained deep learning model for food freshness prediction
* Store application data in a database
* Add real-time inventory updates
* Implement role-based authentication using JWT
* Deploy the application using Docker and cloud services

---

## Screenshots

Screenshots of the application can be added here:

* Landing Page
* Dashboard
* Inventory Management
* Image Analysis
* Analytics
* Reports
* Settings

---

## License

This project was developed for Infosys Internship purpose by Mohammed Ali.
