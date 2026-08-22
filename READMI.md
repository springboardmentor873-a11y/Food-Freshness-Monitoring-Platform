# 🌿 FreshSense AI — Food Quality & Freshness Assessment System

Please refer to the comprehensive [README.md](./README.md) for full project documentation, architectural diagrams, frontend/backend breakdowns, API specifications, and deployment steps.

---

## 🏛️ Quick Architectural Summary

- **🟢 Backend**: `/server.ts` — Express.js server providing `/api/health` and `/api/v1/analyze-food` with Google Gemini 2.5 Flash integration.
- **🔵 Frontend**: `/src/` — React 19 + TypeScript + Tailwind CSS with modular components (`/src/components`), pages (`/src/pages`), context state (`/src/context`), and API services (`/src/services/api.ts`).
- **⚙️ Build Pipeline**: `npm run build` compiles the React frontend to `/dist` and bundles `server.ts` to `dist/server.cjs` via `esbuild`.

---

## 🚀 Quick Start
```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build and start production bundle
npm run build
npm start
```
