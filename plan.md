# Wild Shield — Wildlife Conservation & Rescue Portal
## Complete Project Plan & Implementation Guide

**Version:** 1.1 (Pure MERN)
**Last Updated:** August 2026
**Team Size Assumption:** 2–4 members
**Duration Assumption:** Hackathon (24–48 hrs) or Semester Project (4–6 weeks)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Criteria](#2-goals--success-criteria)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Domain Model / Class Design](#5-domain-model--class-design)
6. [Database Schema](#6-database-schema)
7. [API Design (Endpoints)](#7-api-design-endpoints)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Folder Structure](#9-folder-structure)
10. [Frontend Page-by-Page Plan](#10-frontend-page-by-page-plan)
11. [Feature List (Prioritized)](#11-feature-list-prioritized)
12. [Phase-Wise Implementation Roadmap](#12-phase-wise-implementation-roadmap)
13. [UI/UX Guidelines](#13-uiux-guidelines)
14. [Testing Plan](#14-testing-plan)
15. [Deployment Plan](#15-deployment-plan)
16. [Risk & Mitigation](#16-risk--mitigation)
17. [Stretch Goals](#17-stretch-goals)
18. [Appendix: Sample Data](#18-appendix-sample-data)

---

## 1. Project Overview

**Wild Shield** is a web-based Wildlife Conservation & Rescue Portal that connects everyday citizens, volunteers, rescue teams, and administrators around a single mission: protecting wildlife.

The platform allows:
- **Citizens** to report injured, distressed, or unusual wildlife sightings with photos and location data.
- **Rescue Teams** to receive, track, and resolve these reports.
- **Volunteers/Donors** to participate in conservation activities and contribute donations.
- **Admins** to verify reports, manage rescue team assignments, curate the wildlife information database, and monitor platform-wide analytics.

The core value proposition is **speed and accountability**: a wildlife report should never get lost, every report has a visible status, and every stakeholder (reporter, rescue team, admin) can see the same source of truth.

### 1.1 Problem Statement

Currently, wildlife rescue reporting is fragmented — people call random NGOs, post on social media, or simply do nothing because they don't know who to contact. There is no unified, trackable system for:
- Reporting a sighting/injury with structured data (location, photo, species).
- Routing that report to the right rescue team.
- Tracking resolution status transparently.
- Engaging the public in ongoing conservation efforts (events, donations, awareness).

### 1.2 Proposed Solution

A single web portal with role-based access (Citizen, Volunteer, Rescue Team, Admin) that digitizes and streamlines the entire wildlife rescue lifecycle — from sighting to resolution — while also serving as an educational and fundraising hub for conservation.

---

## 2. Goals & Success Criteria

| Goal | Success Metric |
|---|---|
| Enable fast wildlife reporting | Report submission takes < 60 seconds |
| Transparent case tracking | Every report has a visible, updating status |
| Efficient rescue coordination | Admin can assign a team in < 3 clicks |
| Public engagement | Users can join events / donate without friction |
| Secure access control | Role-based permissions enforced on every route |
| Demo-readiness (if hackathon) | Fully working end-to-end flow: report → assign → resolve → feedback |

---

## 3. Tech Stack — Pure MERN

### 3.1 Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **ODM:** Mongoose (for MongoDB)
- **Validation:** `express-validator` or `zod` (request body/schema validation)
- **Auth:** JWT (via `jsonwebtoken`), `bcryptjs` for password hashing
- **File Uploads:** `multer` (multipart handling) → forwarded to Cloudinary via `cloudinary` SDK
- **Other utilities:** `dotenv` (env vars), `cors` (CORS middleware), `morgan` (request logging), `express-async-handler` (clean async error handling), `nodemon` (dev auto-restart)

### 3.2 Frontend
- **Framework:** React (via Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Context API (lightweight) or Zustand (if state grows complex)
- **HTTP Client:** Axios
- **Maps:** Leaflet.js + React-Leaflet (free, no API key required)
- **Charts (Admin Dashboard):** Chart.js or Recharts

### 3.3 Database
- **MongoDB Atlas** (free tier) — the "M" in MERN. Flexible schema suits WildlifeReport's varying fields (photos, geolocation, dynamic status). Accessed via Mongoose models/schemas from the Express backend. This is the **only** database in the pure MERN version — no relational database is used anywhere in this stack.

### 3.4 Hosting / Free-Tier Stack
- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway (free tier)
- **Database:** MongoDB Atlas (free tier)
- **File Storage:** Cloudinary (free tier, 25GB) for images
- **Uptime:** UptimeRobot (keeps free-tier backend from sleeping)

### 3.5 Dev Tools
- Postman / Thunder Client — API testing
- GitHub — version control (branch-per-feature)
- GitHub Projects / Trello — task tracking

---

## 4. System Architecture

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────────┐
│   React Client   │ <----> │  Express Server    │ <----> │   MongoDB        │
│ (Vite + Tailwind)│  HTTPS │  (Node.js + JWT)   │Mongoose│   (Atlas)        │
└─────────────────┘        └──────────────────┘        └─────────────────┘
        │                          │
        │                          ├──> Cloudinary (image storage)
        │                          └──> Email/SMS service (notifications)
        │
        └──> Leaflet.js (maps, client-side rendering)
```

This is the classic **MERN** stack: **M**ongoDB, **E**xpress.js, **R**eact, **N**ode.js — end to end, no other language or database runtime involved.

### 4.1 Request Lifecycle (Example: Submitting a Wildlife Report)

1. User fills report form on frontend (species, description, photo, auto-captured geolocation).
2. Frontend validates required fields client-side.
3. Axios sends `multipart/form-data` POST request to `/api/reports` with JWT in `Authorization` header.
4. Express `authMiddleware` verifies JWT (using `jsonwebtoken`) → attaches `req.user`.
5. `multer` parses the incoming file; `express-validator`/`zod` validates payload shape.
6. Image buffer is uploaded to Cloudinary via the SDK; URL is returned.
7. A new `WildlifeReport` Mongoose document is created with `status: "pending"`.
8. Response returns the created report object with `report_id`.
9. Frontend redirects to "My Reports" page showing the new entry with a status badge.

---

## 5. Domain Model / Class Design

### 5.1 User

| Field | Type | Notes |
|---|---|---|
| user_id | ObjectId | Primary key |
| name | string | Required |
| email | string | Unique, required |
| password_hash | string | Never expose in API responses |
| phone | string | Optional |
| role | enum | `citizen`, `volunteer`, `rescue_team`, `admin` |
| created_at | datetime | Auto-set |
| profile_photo_url | string | Optional |

**Relationships:**
- One User → Many WildlifeReports (as reporter)
- One User → Many Donations
- One User → Many Feedback entries
- Many Users ↔ Many ConservationActivities (participation join)

### 5.2 WildlifeReport

| Field | Type | Notes |
|---|---|---|
| report_id | ObjectId | Primary key |
| user_id | ref → User | Reporter |
| animal_type | string | Free text or linked to Animal collection |
| description | text | Required |
| location | GeoJSON `{lat, lng, address}` | Required |
| photo_url | string | Required |
| status | enum | `pending`, `verified`, `assigned`, `in_progress`, `resolved`, `rejected` |
| assigned_team_id | ref → RescueTeam | Nullable until assigned |
| reported_at | datetime | Auto-set |
| resolved_at | datetime | Nullable |
| priority | enum | `low`, `medium`, `high`, `critical` |

### 5.3 Animal (Reference/Info Collection)

| Field | Type | Notes |
|---|---|---|
| animal_id | ObjectId | Primary key |
| species_name | string | e.g., "Indian Peafowl" |
| category | enum | `mammal`, `bird`, `reptile`, `amphibian`, `insect`, `other` |
| conservation_status | enum | `least_concern`, `vulnerable`, `endangered`, `critically_endangered`, `extinct_in_wild` |
| info_description | text | Educational content |
| image_url | string | Reference image |
| habitat | string | Optional |
| region_found | string | Optional |

### 5.4 RescueTeam

| Field | Type | Notes |
|---|---|---|
| team_id | ObjectId | Primary key |
| team_name | string | Required |
| region_assigned | string | e.g., "Ahmedabad Zone 1" |
| contact_info | string | Phone/email |
| availability_status | enum | `available`, `busy`, `off_duty` |
| active_cases_count | integer | Derived/computed field |

### 5.5 ConservationActivity

| Field | Type | Notes |
|---|---|---|
| activity_id | ObjectId | Primary key |
| title | string | Required |
| description | text | Required |
| date | date | Required |
| location | string | Required |
| organizer | string | Could be ref → User (admin) |
| volunteer_slots | integer | Max participants |
| participants | array of user_ids | Join relation |

### 5.6 Donation

| Field | Type | Notes |
|---|---|---|
| donation_id | ObjectId | Primary key |
| user_id | ref → User | Donor |
| amount | float | Required |
| purpose | enum | `rescue`, `conservation`, `general` |
| payment_status | enum | `pending`, `success`, `failed` |
| donated_at | datetime | Auto-set |
| transaction_ref | string | Mock or real gateway ref |

### 5.7 Feedback

| Field | Type | Notes |
|---|---|---|
| feedback_id | ObjectId | Primary key |
| user_id | ref → User | Submitter |
| report_id | ref → WildlifeReport | Optional (feedback can be general) |
| message | text | Required |
| rating | integer (1–5) | Optional |
| submitted_at | datetime | Auto-set |

### 5.8 Admin

Admin is best modeled as a **role** on the User collection (`role: admin`) rather than a separate collection, to avoid duplicate auth logic. If a separate collection is preferred for access-level granularity:

| Field | Type | Notes |
|---|---|---|
| admin_id | ref → User | 1:1 with User |
| access_level | enum | `super_admin`, `moderator` |

### 5.9 Entity Relationship Summary

```
User (1) ──< (many) WildlifeReport
User (1) ──< (many) Donation
User (1) ──< (many) Feedback
User (many) ──< join >── (many) ConservationActivity
RescueTeam (1) ──< (many) WildlifeReport
Animal (1) ──< (many) WildlifeReport [optional link for species identification]
WildlifeReport (1) ──< (0..1) Feedback
```

---

## 6. Database Schema

### 6.1 MongoDB Collections (Mongoose Schemas)

These map directly to Mongoose `Schema` definitions in `backend/models/`. This is the **only** schema format used in the pure MERN version — there is no relational/SQL alternative.

```javascript
// models/User.js
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ["citizen", "volunteer", "rescue_team", "admin"], default: "citizen" },
  created_at: { type: Date, default: Date.now },
  profile_photo_url: String
});

// models/WildlifeReport.js
const wildlifeReportSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  animal_type: String,
  description: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  photo_url: String,
  status: {
    type: String,
    enum: ["pending", "verified", "assigned", "in_progress", "resolved", "rejected"],
    default: "pending"
  },
  assigned_team_id: { type: Schema.Types.ObjectId, ref: "RescueTeam" },
  priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  reported_at: { type: Date, default: Date.now },
  resolved_at: Date
});

// models/Animal.js
const animalSchema = new Schema({
  species_name: String,
  category: String,
  conservation_status: String,
  info_description: String,
  image_url: String,
  habitat: String,
  region_found: String
});

// models/RescueTeam.js
const rescueTeamSchema = new Schema({
  team_name: String,
  region_assigned: String,
  contact_info: String,
  availability_status: { type: String, default: "available" }
});

// models/ConservationActivity.js
const conservationActivitySchema = new Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  organizer: String,
  volunteer_slots: Number,
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

// models/Donation.js
const donationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  purpose: String,
  payment_status: { type: String, default: "pending" },
  donated_at: { type: Date, default: Date.now },
  transaction_ref: String
});

// models/Feedback.js
const feedbackSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  report_id: { type: Schema.Types.ObjectId, ref: "WildlifeReport" },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  submitted_at: { type: Date, default: Date.now }
});

module.exports = { userSchema, wildlifeReportSchema, animalSchema, rescueTeamSchema, conservationActivitySchema, donationSchema, feedbackSchema };
```

### 6.2 Indexes (Important for Performance)

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.wildlife_reports.createIndex({ status: 1 })
db.wildlife_reports.createIndex({ user_id: 1 })
db.wildlife_reports.createIndex({ "location.lat": 1, "location.lng": 1 })
db.donations.createIndex({ user_id: 1 })
db.conservation_activities.createIndex({ date: 1 })
```

---

## 7. API Design (Endpoints)

### 7.1 Auth

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |
| GET | `/api/auth/me` | Get current user profile | Authenticated |
| POST | `/api/auth/logout` | Invalidate session (client-side token removal) | Authenticated |

### 7.2 Wildlife Reports

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/reports` | Submit new report | Citizen+ |
| GET | `/api/reports` | List all reports (filterable by status) | Admin, Rescue Team |
| GET | `/api/reports/mine` | List own submitted reports | Authenticated |
| GET | `/api/reports/:id` | Get single report detail | Authenticated (owner/admin) |
| PATCH | `/api/reports/:id/status` | Update report status | Admin, Rescue Team |
| PATCH | `/api/reports/:id/assign` | Assign a rescue team | Admin |
| DELETE | `/api/reports/:id` | Delete report | Admin, owner (if pending) |

### 7.3 Animal Info

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/animals` | List all species (searchable/filterable) | Public |
| GET | `/api/animals/:id` | Get species detail | Public |
| POST | `/api/animals` | Add new species entry | Admin |
| PUT | `/api/animals/:id` | Update species entry | Admin |
| DELETE | `/api/animals/:id` | Remove species entry | Admin |

### 7.4 Rescue Teams

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/teams` | List rescue teams | Admin |
| POST | `/api/teams` | Create rescue team | Admin |
| PUT | `/api/teams/:id` | Update team info/availability | Admin, Rescue Team |
| DELETE | `/api/teams/:id` | Remove team | Admin |

### 7.5 Conservation Activities

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/activities` | List upcoming/past activities | Public |
| POST | `/api/activities` | Create new activity | Admin |
| POST | `/api/activities/:id/join` | Join an activity | Authenticated |
| POST | `/api/activities/:id/leave` | Leave an activity | Authenticated |
| PUT | `/api/activities/:id` | Update activity | Admin |
| DELETE | `/api/activities/:id` | Cancel activity | Admin |

### 7.6 Donations

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/donations` | Make a donation | Authenticated |
| GET | `/api/donations/mine` | View own donation history | Authenticated |
| GET | `/api/donations` | View all donations | Admin |

### 7.7 Feedback

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/feedback` | Submit feedback | Authenticated |
| GET | `/api/feedback` | List all feedback | Admin |
| GET | `/api/feedback/report/:report_id` | Feedback for specific report | Admin, owner |

### 7.8 Admin Dashboard

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/stats` | Aggregate stats (total reports, resolved %, active teams, donations) | Admin |
| GET | `/api/admin/users` | List/manage users | Admin |
| PATCH | `/api/admin/users/:id/role` | Change user role | Admin |

---

## 8. Authentication & Authorization

### 8.1 Flow
1. User registers → password hashed with `bcryptjs` → stored.
2. User logs in → credentials verified → JWT issued (via `jsonwebtoken`) with payload `{user_id, role, exp}`.
3. JWT stored in `localStorage` or `httpOnly` cookie (cookie preferred for security).
4. Every protected request includes `Authorization: Bearer <token>`.
5. Express middleware `authMiddleware` verifies the JWT, fetches the user, and attaches it to `req.user`.
6. Role-based middleware wrappers (`requireRole("admin")`) guard sensitive routes.

### 8.2 Express Middleware Pattern

```javascript
// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.user_id).select("-password_hash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// middleware/roleMiddleware.js
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
```

**Usage in a route file:**

```javascript
// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { assignTeam } = require("../controllers/reportController");

router.patch("/:id/assign", authMiddleware, requireRole("admin"), assignTeam);

module.exports = router;
```

### 8.3 Role Permission Matrix

| Action | Citizen | Volunteer | Rescue Team | Admin |
|---|---|---|---|---|
| Submit report | ✅ | ✅ | ✅ | ✅ |
| View own reports | ✅ | ✅ | ✅ | ✅ |
| View all reports | ❌ | ❌ | ✅ (assigned only) | ✅ |
| Update report status | ❌ | ❌ | ✅ (assigned only) | ✅ |
| Assign rescue team | ❌ | ❌ | ❌ | ✅ |
| Manage animal DB | ❌ | ❌ | ❌ | ✅ |
| Create conservation activity | ❌ | ❌ | ❌ | ✅ |
| Join conservation activity | ✅ | ✅ | ✅ | ✅ |
| Make donation | ✅ | ✅ | ✅ | ✅ |
| View admin dashboard | ❌ | ❌ | ❌ | ✅ |

---

## 9. Folder Structure

### 9.1 Backend (`/backend`) — Node.js + Express

```
backend/
├── server.js                     # Express app entrypoint
├── config/
│   ├── db.js                     # MongoDB connection setup (mongoose.connect)
│   └── cloudinary.js              # Cloudinary SDK config
├── models/
│   ├── User.js
│   ├── WildlifeReport.js
│   ├── Animal.js
│   ├── RescueTeam.js
│   ├── ConservationActivity.js
│   ├── Donation.js
│   └── Feedback.js
├── routes/
│   ├── authRoutes.js
│   ├── reportRoutes.js
│   ├── animalRoutes.js
│   ├── teamRoutes.js
│   ├── activityRoutes.js
│   ├── donationRoutes.js
│   ├── feedbackRoutes.js
│   └── adminRoutes.js
├── controllers/
│   ├── authController.js
│   ├── reportController.js
│   ├── animalController.js
│   ├── teamController.js
│   ├── activityController.js
│   ├── donationController.js
│   ├── feedbackController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js          # authMiddleware, requireRole
│   ├── errorMiddleware.js         # centralized error handler
│   └── uploadMiddleware.js        # multer config
├── services/
│   └── uploadService.js           # Cloudinary upload helper
├── utils/
│   ├── generateToken.js           # JWT signing helper
│   └── hashPassword.js            # bcryptjs helpers
├── validators/
│   ├── userValidator.js           # express-validator / zod schemas
│   └── reportValidator.js
├── seed/
│   └── seedAnimals.js             # Seed script for Animal reference data
├── package.json
├── .env.example
└── README.md
```

### 9.2 Frontend (`/frontend`) — React + Vite

```
frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   ├── axiosInstance.js
│   │   ├── authApi.js
│   │   ├── reportApi.js
│   │   ├── animalApi.js
│   │   ├── activityApi.js
│   │   ├── donationApi.js
│   │   └── adminApi.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── reports/
│   │   │   ├── ReportForm.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   └── ReportMap.jsx
│   │   ├── animals/
│   │   │   ├── AnimalCard.jsx
│   │   │   └── AnimalFilter.jsx
│   │   ├── activities/
│   │   │   └── ActivityCard.jsx
│   │   └── admin/
│   │       ├── StatsCard.jsx
│   │       └── UserTable.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ReportSighting.jsx
│   │   ├── MyReports.jsx
│   │   ├── WildlifeInfo.jsx
│   │   ├── ConservationEvents.jsx
│   │   ├── Donate.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminReportManagement.jsx
│   │   ├── AdminAnimalManagement.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   └── styles/
│       └── index.css
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 10. Frontend Page-by-Page Plan

### 10.1 Home Page (`/`)
- Hero section: mission statement + CTA buttons ("Report Sighting", "Explore Wildlife")
- Quick stats banner (total reports resolved, active rescue teams, species documented)
- Featured conservation activity
- Footer with contact/social info

### 10.2 Report Sighting Page (`/report`)
- Form fields: animal type (dropdown/autocomplete from Animal collection), description, photo upload, auto-detect geolocation (with manual override on map), priority selector
- Submit button → success toast → redirect to "My Reports"

### 10.3 My Reports Page (`/my-reports`)
- List/grid of user's submitted reports
- Each card shows: photo thumbnail, animal type, status badge, date reported
- Click → detail modal/page with full timeline (pending → verified → assigned → resolved)
- Feedback form appears once status = resolved

### 10.4 Wildlife Info Page (`/wildlife-info`)
- Searchable, filterable grid of Animal entries (filter by category, conservation status)
- Click on card → detail page with full description, habitat, image

### 10.5 Conservation Events Page (`/events`)
- List of upcoming events (title, date, location, slots remaining)
- "Join" button (disabled if full or already joined)
- Past events section (read-only, shows impact summary)

### 10.6 Donate Page (`/donate`)
- Simple form: amount (preset buttons + custom input), purpose dropdown
- Mock payment confirmation (or real gateway if time allows)
- Donation history table (for logged-in user)

### 10.7 Admin Dashboard (`/admin`)
- Stats cards: total reports, pending reports, resolved %, active rescue teams, total donations
- Charts: reports over time (line chart), reports by status (pie chart)
- Quick links to management pages

### 10.8 Admin Report Management (`/admin/reports`)
- Table of all reports with filters (status, priority, date range)
- Inline actions: verify, assign team (dropdown), mark resolved, reject
- Map view toggle showing all pending reports geographically

### 10.9 Admin Animal Management (`/admin/animals`)
- CRUD table for Animal entries
- Add/Edit modal form

### 10.10 Login / Register Pages
- Simple centered form, role selection only during registration (default: citizen)
- Client-side validation (email format, password strength)

---

## 11. Feature List (Prioritized)

### 11.1 MVP (Must-Have — Build First)
1. User registration/login with JWT auth
2. Submit wildlife report (with photo + location)
3. View own reports with status tracking
4. Admin: view all reports, verify, assign rescue team, mark resolved
5. Wildlife info directory (static seeded species data)
6. Basic role-based route protection

### 11.2 High Priority (Build Second)
7. Conservation activity listing + join/leave
8. Donation form (mock payment) + donation history
9. Feedback + star rating on resolved reports
10. Admin dashboard with aggregate stats

### 11.3 Medium Priority (Stretch, if time allows)
11. Map view (Leaflet) for report locations
12. Search/filter on Wildlife Info page
13. Leaderboard (top donors / most active volunteers)
14. Email notification on status change

### 11.4 Low Priority (Nice-to-have, skip under time pressure)
15. Real image-based species suggestion
16. Real-time chat between reporter and rescue team
17. Real payment gateway integration
18. SMS notifications

---

## 12. Phase-Wise Implementation Roadmap

### Phase 0 — Setup (Day 1, Hours 0–2)
- [ ] Initialize GitHub repo, branch strategy (`main`, `dev`, feature branches)
- [ ] Set up backend: Express project skeleton (`npm init`, `express`, `mongoose`, `dotenv`, `cors`, `morgan`), `.env`, DB connection (`config/db.js`)
- [ ] Set up frontend: Vite + React + Tailwind skeleton
- [ ] Set up MongoDB Atlas cluster
- [ ] Deploy skeleton apps to Render + Vercel (confirm pipeline works end-to-end early)

### Phase 1 — Auth Foundation (Hours 2–5)
- [ ] Backend: User model, register/login routes and controllers, JWT issuing, password hashing with bcryptjs
- [ ] Backend: `authMiddleware`, `requireRole` middleware
- [ ] Frontend: Login/Register pages, AuthContext, ProtectedRoute component
- [ ] Test: register → login → access protected route → logout

### Phase 2 — Wildlife Reporting Core (Hours 5–10)
- [ ] Backend: WildlifeReport model + CRUD routes/controllers
- [ ] Backend: Image upload middleware (multer) + Cloudinary upload service
- [ ] Frontend: ReportForm component with geolocation capture
- [ ] Frontend: MyReports page with status badges
- [ ] Test: submit report → appears in MyReports → correct status shown

### Phase 3 — Animal Info + Seed Data (Hours 10–13)
- [ ] Backend: Animal model + CRUD routes/controllers
- [ ] Seed script (`seed/seedAnimals.js`): insert 15–20 sample species (use real data, e.g., from Wikipedia/IUCN for authenticity)
- [ ] Frontend: WildlifeInfo page with grid + filter
- [ ] Test: species list loads, filter works, detail view opens

### Phase 4 — Rescue Team & Admin Report Management (Hours 13–18)
- [ ] Backend: RescueTeam model + CRUD routes/controllers
- [ ] Backend: report assignment + status update routes/controllers
- [ ] Frontend: AdminReportManagement page (table + inline actions)
- [ ] Frontend: Admin can assign team from dropdown, change status
- [ ] Test: full lifecycle — citizen reports → admin verifies → assigns team → marks resolved → citizen sees updated status

### Phase 5 — Conservation Activities + Donations (Hours 18–23)
- [ ] Backend: ConservationActivity model + join/leave logic
- [ ] Backend: Donation model + mock payment flow
- [ ] Frontend: Events page, Donate page
- [ ] Test: join event, leave event, make donation, view donation history

### Phase 6 — Feedback + Admin Dashboard (Hours 23–27)
- [ ] Backend: Feedback model + routes/controllers
- [ ] Backend: `/api/admin/stats` aggregation endpoint (MongoDB aggregation pipeline)
- [ ] Frontend: Feedback form (post-resolution)
- [ ] Frontend: AdminDashboard with stat cards + charts
- [ ] Test: submit feedback, dashboard reflects correct numbers

### Phase 7 — Polish & Demo Prep (Hours 27–30)
- [ ] UI pass: consistent spacing, colors, loading states, empty states
- [ ] Error handling: centralized Express error middleware + toast notifications on frontend for all API failures
- [ ] Seed realistic demo data (5–10 sample reports across statuses)
- [ ] Write README with setup instructions
- [ ] Prepare 3-minute demo script / walkthrough
- [ ] Final deploy check (both frontend and backend live, CORS configured correctly)

### Phase 8 — Buffer / Stretch Features (Remaining time)
- [ ] Map view integration
- [ ] Leaderboard
- [ ] Email notifications

---

## 13. UI/UX Guidelines

### 13.1 Visual Theme
- **Primary palette:** Earthy greens (`#2D5A3D`, `#4A7C59`) + warm accent (amber `#E8A93C`) to evoke nature/wildlife
- **Neutral background:** off-white / soft beige (`#F7F5F0`) rather than pure white, for warmth
- **Typography:** clean sans-serif for body (Inter/Poppins), slightly bolder display font for headings

### 13.2 Status Badge Colors
| Status | Color |
|---|---|
| Pending | Gray |
| Verified | Blue |
| Assigned | Amber |
| In Progress | Orange |
| Resolved | Green |
| Rejected | Red |

### 13.3 Key UX Principles
- Report submission must be usable one-handed on mobile (large touch targets, minimal typing — use dropdowns/autocomplete where possible)
- Every async action shows a loading state (skeleton or spinner) — never a blank screen
- Every list has an empty state with a helpful CTA (e.g., "No reports yet — Report a sighting")
- Confirmation dialogs for destructive actions (delete report, cancel activity)
- Toast notifications for success/error feedback (not blocking alerts)

---

## 14. Testing Plan

### 14.1 Backend Testing Checklist
- [ ] Auth: register with duplicate email → 400 error
- [ ] Auth: login with wrong password → 401 error
- [ ] Auth: access protected route without token → 401 error
- [ ] Auth: access admin route as citizen → 403 error
- [ ] Reports: submit report without required fields → 400/422 validation error
- [ ] Reports: submit report with valid data → 201 + correct response shape
- [ ] Reports: non-owner tries to delete another user's report → 403
- [ ] Reports: admin assigns team → status auto-updates to `assigned`
- [ ] Donations: negative amount rejected
- [ ] Activities: join when slots full → 400 error
- [ ] Suggested tools: Jest or Mocha/Chai + Supertest for API route testing

### 14.2 Frontend Testing Checklist
- [ ] Form validation shows inline errors before submit
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Role-based UI: admin sees admin nav links, citizen doesn't
- [ ] Status badge colors render correctly for each status
- [ ] Image upload preview works before submit
- [ ] Geolocation permission denial handled gracefully (manual location fallback)
- [ ] Mobile responsiveness on report form, dashboard, and lists

### 14.3 Manual End-to-End Test Script (for demo rehearsal)
1. Register as citizen → login
2. Submit a wildlife report with photo
3. Logout → login as admin
4. Verify the report → assign a rescue team
5. Mark report as resolved
6. Logout → login as original citizen
7. View updated status on MyReports → submit feedback
8. Browse Wildlife Info page → filter by "endangered"
9. Join a conservation activity
10. Make a donation → view donation history

---

## 15. Deployment Plan

### 15.1 Environment Variables (Backend `.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRE=1d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

### 15.2 Environment Variables (Frontend `.env`)
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### 15.3 Deployment Steps
1. **Database:** Create free MongoDB Atlas cluster → whitelist `0.0.0.0/0` for dev (restrict later) → get connection string
2. **Backend:** Push to GitHub → connect repo to Render (or Railway) → set env vars → set start command `node server.js` (or `npm start`) → deploy → note live URL
3. **Frontend:** Push to GitHub → connect repo to Vercel → set `VITE_API_BASE_URL` → deploy
4. **CORS:** Ensure Express `cors` middleware allows the deployed frontend origin
5. **Uptime:** Add Render backend URL to UptimeRobot (ping every 5 min) to prevent free-tier sleep during demo
6. **Seed data:** Run `node seed/seedAnimals.js` against production DB before demo day

### 15.4 CORS Configuration Example

```javascript
// server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN, "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
```

---

## 16. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Free-tier backend sleeps before demo | Demo fails/lags | Use UptimeRobot pings; do a "wake-up" call 10 min before presenting |
| Geolocation permission denied by browser | Report form blocked | Provide manual lat/lng or address input fallback |
| Image upload service quota/downtime | Reports can't include photos | Allow report submission without photo (optional field) as fallback |
| Scope creep near deadline | Nothing fully finished | Stick strictly to MVP list (Section 11.1) first; treat rest as stretch |
| Team members blocked on shared files | Merge conflicts, wasted time | Clear module ownership (see Phase plan); small, frequent commits |
| Judges/evaluators test edge cases | Crashes during demo | Add centralized Express error middleware + try/catch on all async controllers |

---

## 17. Stretch Goals

If the MVP and high-priority features are complete with time remaining, consider (in order of ease):

1. **Report status timeline UI** — visual stepper component instead of just a badge (low effort, high visual impact)
2. **Leaderboard page** — rank users by donation total or activities joined (single MongoDB aggregation query)
3. **Map view for admin** — plot all pending reports on a Leaflet map with colored markers by priority
4. **Dark mode toggle** — Tailwind `dark:` classes, stored in localStorage
5. **Export reports to CSV** — for admin, using a simple client-side CSV generator
6. **Species search with autocomplete** — improve the animal_type field in ReportForm using existing Animal collection
7. **Basic notification bell** — in-app notification when own report's status changes (poll every 30s, no websockets needed)

Avoid until core is rock-solid:
- Real ML/AI species or injury detection from photos
- Real-time WebSocket chat
- Production payment gateway integration
- Native mobile app version

---

## 18. Appendix: Sample Data

### 18.1 Sample Animal Seed Entries

```json
[
  {
    "species_name": "Indian Peafowl",
    "category": "bird",
    "conservation_status": "least_concern",
    "info_description": "India's national bird, known for its iridescent blue-green plumage and elaborate courtship display.",
    "habitat": "Forests, farmland, near human settlements",
    "region_found": "Indian subcontinent"
  },
  {
    "species_name": "Asiatic Lion",
    "category": "mammal",
    "conservation_status": "endangered",
    "info_description": "Found only in the Gir Forest of Gujarat, this subspecies is smaller than its African relative.",
    "habitat": "Dry deciduous forest, scrubland",
    "region_found": "Gir National Park, Gujarat"
  },
  {
    "species_name": "Indian Star Tortoise",
    "category": "reptile",
    "conservation_status": "vulnerable",
    "info_description": "Recognized by its distinctive star-patterned shell, frequently targeted by illegal wildlife trade.",
    "habitat": "Dry areas, scrub forest, grassland",
    "region_found": "India, Sri Lanka, Pakistan"
  }
]
```

### 18.2 Sample Wildlife Report (JSON Payload)

```json
{
  "animal_type": "Indian Peafowl",
  "description": "Found injured near the roadside, appears to have a wing injury. Unable to fly.",
  "location": {
    "lat": 23.0225,
    "lng": 72.5714,
    "address": "SG Highway, Ahmedabad, Gujarat"
  },
  "photo_url": "https://res.cloudinary.com/demo/image/upload/v123/peafowl.jpg",
  "priority": "high"
}
```

### 18.3 Sample API Response (Report Created)

```json
{
  "report_id": "665f1c2e8b3a4d1234567890",
  "user_id": "665f1a2e8b3a4d1234567800",
  "animal_type": "Indian Peafowl",
  "description": "Found injured near the roadside, appears to have a wing injury.",
  "status": "pending",
  "priority": "high",
  "reported_at": "2026-08-05T22:10:00Z"
}
```

### 18.4 Sample Admin Stats Response

```json
{
  "total_reports": 128,
  "pending_reports": 14,
  "resolved_reports": 96,
  "resolution_rate": "75%",
  "active_rescue_teams": 6,
  "total_donations": 42500,
  "total_activities": 9,
  "total_users": 340
}
```

---

## Final Notes

- Build in the order defined in Section 12 — do not jump ahead to stretch goals before the MVP flow works end-to-end.
- Keep every domain model's fields consistent between backend Mongoose schemas and frontend form fields to avoid last-minute mapping bugs.
- Test the full demo script (Section 14.3) at least once, 30 minutes before presenting, on the actual deployed URLs — not just localhost.
- Prioritize a working, simple version of every MVP feature over a polished, incomplete version of a stretch feature.
- The stack is pure MERN end to end: MongoDB, Express.js, React, Node.js. No Python, no FastAPI, no relational database anywhere in this plan.

**End of plan.md**
