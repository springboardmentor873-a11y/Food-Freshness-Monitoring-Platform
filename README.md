# FreshEye AI — Food Freshness Monitoring Platform (Frontend)

A complete, frontend-only React dashboard for an AI-powered food freshness monitoring platform. Developed as part of an internship project at Infosys — premium glassmorphism UI, full navigation, realistic mock data, and every module wired up and working.

> **Scope note:** This repository is the **frontend only**, as requested. There is no backend, no FastAPI server, and no TensorFlow/Keras training code included. `services/api.js` is a placeholder service layer that simulates real network calls (with latency) and returns realistic, computed data — ready to be swapped for real endpoints later. The "AI model" referenced throughout the UI (EfficientNetB0) is described in copy and used as the conceptual basis for the deterministic image-analysis logic in `src/data/mockData.js`, but no model actually runs in this repo.

## Tech Stack

- React 18 + Vite
- Tailwind CSS (custom emerald/graphite glassmorphism design system)
- React Router DOM
- Framer Motion
- Lucide React (icons)
- Recharts (bar / line / pie / area charts)
- React Hook Form
- React Hot Toast

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Logging In

This is a frontend-only auth system (JWT-style token stored in `localStorage`, no real server). You can:

- **Sign up** as any role (Consumer, Retail Manager, Warehouse Operator, Food Quality Inspector, Administrator) from `/signup` or `/role-selection`.
- **Log in** with any email/password you've signed up with.
- **Admin demo shortcut:** log in with the email `admin@fresheye.ai` (any password) to land as an Administrator and unlock **User Management**.

## Folder Structure

```
src/
  assets/        static assets
  components/    common/ — shared UI building blocks (Navbar, Sidebar, cards, modal, etc.)
  layouts/        DashboardLayout, AuthLayout
  pages/          one file per route/module (Dashboard, Inventory, Image Analysis, ...)
  services/       api.js — placeholder async "API" functions
  routes/         AppRoutes.jsx, ProtectedRoute.jsx
  context/        AuthContext, ThemeContext, NotificationContext
  hooks/          useAuth, useTheme, useNotifications, useInventory
  utils/          helpers.js, assessmentStore.js
  data/           mockData.js — realistic food/inventory/analytics data generation
  styles/         (reserved for additional global styles)
```

## Modules Implemented

Landing page · Login/Signup (with role selection) · Dashboard · Food Inventory (search/filter/pagination/add/edit/delete) · Image Analysis (drag-drop/camera/browse, simulated 3s analysis) · Freshness Assessment (score, confidence, color/texture analysis) · Shelf-Life Prediction · Storage Monitoring · Recommendations · Analytics (executive charts) · Reports (with PDF/Excel/Print export triggers) · Notifications (persistent read-state) · Settings (dark/light mode, notification preferences, language) · About Project · Profile · User Management (Administrator only, with user deletion) · 404 page.

## Notes for Presentation

- All inventory, notifications, analytics and report data is generated deterministically from a seeded PRNG in `src/data/mockData.js`, so numbers stay realistic and consistent within a session rather than showing Lorem Ipsum or static placeholders.
- Notification read-state persists in `localStorage`, so previously-read alerts stay marked as read even after signing out and back in.
- Dark/light theme also persists across sessions.
- To connect a real backend later, replace the function bodies inside `src/services/api.js` with real `fetch`/`axios` calls — every page already consumes this service layer, so no page code needs to change.

## Version

1.0.0
