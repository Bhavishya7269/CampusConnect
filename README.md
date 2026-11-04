# CampusConnect — Event UI & API Frontend

Modern, high-performance React frontend for **CampusConnect**, designed around the Figma Event UI system and the attached API endpoints specification.

The definitive, machine-readable API contract is available in [openapi.yaml](./openapi.yaml). It documents the JSON payloads, bearer-token requirements, and the expected `201`, `401`, `403`, `404`, and `409` responses.

---

## 🚀 Features

- **Event Discovery & Catalog Feed**: High-resolution cards, category chips (Hackathons, Workshops, Cultural, Sports, Career), real-time search, capacity progress bars, and status badges.
- **Event Details Modal (`GET /api/events/{id}`)**: Schedule timeline, key highlights, organizer profile, capacity meter, venue location.
- **Event Registration Flow (`POST /api/registrations`)**:
  - Handles **HTTP 201 Created**: Generates interactive digital student pass with QR-code and ticket number.
  - Handles **HTTP 409 Conflict**: Detects duplicate registrations and informs the student with direct navigation to their existing pass.
- **My Registrations View (`GET /api/me/registrations`)**: Perforated digital pass tickets, ticket code copy, print/download simulation, and quick event links.
- **Organizer Attendee Portal (`GET /api/events/{id}/registrations`)**:
  - Owning organizer restricted view with check-in status, student ID, department, and registration timestamp.
  - Live CSV export and search filtering.
  - Role switcher to test **HTTP 403 Forbidden** simulation.
- **API Inspector Drawer**: Live network request logs with timestamps, method badges, endpoint testing buttons, and toggle between Mock and Live backend (`http://localhost:5000` or custom).

---

## 📡 API Endpoints Mapping

| Method | Endpoint | Description | Frontend Handler |
|---|---|---|---|
| `GET` | `/api/events` | Browse events with search & category filters | `getEvents({ category, search })` |
| `GET` | `/api/events/{id}` | Event details | `getEventById(id)` |
| `POST` | `/api/registrations` | Create registration (returns 201 or 409) | `createRegistration({ eventId, studentInfo })` |
| `GET` | `/api/me/registrations` | Current user's registrations | `getMyRegistrations()` |
| `GET` | `/api/events/{id}/registrations` | Attendee list (owning organizer only) | `getEventAttendees(id)` |

---

## 🛠️ Quickstart

### 1. Install dependencies (already completed)
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production
```bash
npm run build
```

---

## ⚙️ Connecting to your Real Backend Server

1. Click the **API Status pill** (top right in the Navbar, or floating pill in bottom right).
2. Toggle from **Mock API** to **Live Backend**.
3. Set your backend URL (e.g. `http://localhost:5000` or `http://localhost:8000`).
4. Ensure your backend has CORS enabled for `http://localhost:3000`.

