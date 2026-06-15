<div align="center">

# 🏋️ WMT Gym Management System

**A full-stack mobile application for gym management — built with React Native (Expo) and Node.js**

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Upload-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

*Manage memberships, track workouts & diets, book trainers, and monitor progress — all from a single mobile app.*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Team Members & Contributions](#-team-members--contributions)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Testing](#-testing)
- [License](#-license)

---

## 🔎 Overview

**WMT Gym Management System** is a comprehensive mobile application developed as a university group project to streamline gym operations for both **administrators** and **members**. The system provides role-based access with distinct dashboards — admins can manage plans, trainers, users, and approve enrollments, while members can enroll in membership plans, select workout & diet routines, book trainers, and track their fitness progress over time.

The project is divided into **5 core components**, each independently developed by a team member and integrated into a single cohesive application.

---

## 👥 Team Members & Contributions

This project was collaboratively built by a team of 5 members. Each member was responsible for a specific component, handling both the **frontend (React Native)** and **backend (Node.js + MongoDB)** for their respective feature.

---

### 1️⃣ User Authentication & Membership Management
**👤 Member Name** — *IT24XXXXXX*

> Core system foundation — user registration, login, JWT authentication, membership plans, enrollment with receipt uploads, and admin approval workflow.

| Layer | Files |
|---|---|
| **Backend — Models** | `userModel.js`, `membershipModel.js`, `enrollmentModel.js` |
| **Backend — Controllers** | `userController.js`, `membershipController.js`, `enrollmentController.js` |
| **Backend — Routes** | `userRoutes.js`, `membershipRoutes.js`, `enrollmentRoutes.js` |
| **Backend — Middleware** | `authMiddleware.js` (JWT protect + admin role guard) |
| **Backend — Config** | `cloudinaryConfig.js` (receipt image upload via Cloudinary + Multer) |
| **Backend — Utils** | `ensureDefaultAdmin.js` (auto-creates default admin on startup) |
| **Frontend — Screens** | `LoginScreen.js`, `RegisterScreen.js`, `OnboardingScreen.js` |
| **Frontend — Screens** | `PlansScreen.js` (browse plans, upload receipt, enroll) |
| **Frontend — Screens** | `ProfileScreen.js`, `SettingsScreen.js` |
| **Frontend — Context** | `AuthContext.js` (global auth state — login, logout, token management) |
| **Frontend — API** | `axios.js` (Axios instance with base URL & auth interceptors) |
| **Frontend — Navigation** | `AuthStack.js`, `AppNavigator.js`, `AppTabs.js`, `GuestTabs.js` |
| **Frontend — Admin** | `AdminDashboard.js`, `PendingApprovals.js`, `ManagePlansScreen.js`, `ManageUsersScreen.js` |

**Key Features Implemented:**
- 🔐 JWT-based authentication with Expo SecureStore
- 📝 User registration with NIC, height, weight, age validation
- 💳 Membership enrollment with payment receipt upload to Cloudinary
- ✅ Admin approval/rejection workflow for pending enrollments
- 👥 Admin user management (view, search, manage all members)
- 🔲 QR code generation per user for gym check-in

---

### 2️⃣ Trainer Management
**👤 Member Name** — *IT24XXXXXX*

> Trainer profiles, availability, image uploads, star ratings, user reviews, and trainer selection for members.

| Layer | Files |
|---|---|
| **Backend — Model** | `trainerModel.js` (includes embedded `reviewSchema` for ratings) |
| **Backend — Controller** | `trainerController.js` |
| **Backend — Routes** | `trainerRoutes.js` |
| **Frontend — Screen** | `TrainersScreen.js` (browse trainers, view details, submit reviews, select trainer) |
| **Frontend — Admin** | `ManageTrainersScreen.js` (CRUD trainers with image upload) |

**Key Features Implemented:**
- 👨‍🏫 Trainer profile cards with specialization, experience, bio, and availability hours
- ⭐ Star rating & review system (users can rate and comment)
- 📸 Trainer image upload via Cloudinary
- 🔍 Browse and select a personal trainer
- 🛡️ Admin CRUD operations for trainer management

---

### 3️⃣ Workout Plan Management
**👤 Member Name** — *IT24XXXXXX*

> Workout plan library with difficulty levels, calorie tracking, and user enrollment into workout routines.

| Layer | Files |
|---|---|
| **Backend — Model** | `workoutModel.js` |
| **Backend — Controller** | `workoutController.js` |
| **Backend — Routes** | `workoutRoutes.js` |
| **Frontend — Screen** | `WorkoutsScreen.js` (browse, view details, enroll/unenroll from workouts) |
| **Frontend — Admin** | `ManageWorkoutsScreen.js` (CRUD workout plans) |

**Key Features Implemented:**
- 🏋️ Workout plan cards with title, description, duration, and calories burned
- 📊 Difficulty levels: Beginner → Intermediate → Advanced → Expert
- ✅ One-tap enroll/unenroll from workout plans
- 🖼️ Workout cover images
- 🛡️ Admin CRUD operations for workout management

---

### 4️⃣ Class Booking & Progress Tracking
**👤 Member Name** — *IT24XXXXXX*

> Trainer session booking system with status tracking, and a personal fitness progress logger for weight and workout history.

| Layer | Files |
|---|---|
| **Backend — Models** | `bookingModel.js`, `progressModel.js` |
| **Backend — Controllers** | `bookingController.js`, `progressController.js` |
| **Backend — Routes** | `bookingRoutes.js`, `progressRoutes.js` |
| **Frontend — Screens** | `BookingsScreen.js` (create, view, cancel bookings) |
| **Frontend — Screens** | `ProgressScreen.js` (log weight, workouts, and notes over time) |
| **Frontend — Admin** | `ManageProgressScreen.js` (view member progress logs) |

**Key Features Implemented:**
- 📅 Book training sessions with a specific trainer, date, and class name
- 🔄 Booking status flow: Pending → Confirmed → Completed / Cancelled
- 📈 Daily progress logging (weight, workout completed, notes)
- 📊 Historical progress view for tracking fitness journey
- 🛡️ Admin can monitor all member progress entries

---

### 5️⃣ Diet Plan Management
**👤 Member Name** — *IT24XXXXXX*

> Diet plan catalog with detailed meal breakdowns, calorie information, and user enrollment.

| Layer | Files |
|---|---|
| **Backend — Model** | `dietModel.js` |
| **Backend — Controller** | `dietController.js` |
| **Backend — Routes** | `dietRoutes.js` |
| **Frontend — Screen** | `DietsScreen.js` (browse, view details, enroll/unenroll from diet plans) |
| **Frontend — Admin** | `ManageDietsScreen.js` (CRUD diet plans with meal details) |

**Key Features Implemented:**
- 🥗 Diet plan cards with name, description, calorie target, and cover image
- 🍽️ Detailed meal breakdowns (meal name, items, kcal per meal)
- ✅ One-tap enroll/unenroll from diet plans
- 🖼️ Diet plan cover images
- 🛡️ Admin CRUD operations for diet plan management

---

### 📊 Component Contribution Summary

| # | Component | Team Member | Student ID | Backend Files | Frontend Screens |
|---|---|---|---|---|---|
| 1 | User Auth & Membership Management | Member Name | IT24XXXXXX | 8 files | 9 screens |
| 2 | Trainer Management | Member Name | IT24XXXXXX | 3 files | 2 screens |
| 3 | Workout Plan Management | Member Name | IT24XXXXXX | 3 files | 2 screens |
| 4 | Class Booking & Progress Tracking | Member Name | IT24XXXXXX | 6 files | 3 screens |
| 5 | Diet Plan Management | Member Name | IT24XXXXXX | 3 files | 2 screens |

---

## ✨ Features

### 👤 Member Features
| Feature | Description |
|---|---|
| **🔐 Authentication** | Register / login with JWT-based secure authentication using Expo SecureStore |
| **📋 Membership Plans** | Browse available plans, enroll by uploading a payment receipt (Cloudinary) |
| **🏃 Workout Plans** | Browse and enroll in workout plans (Beginner → Expert difficulty levels) |
| **🥗 Diet Plans** | View and select diet plans with detailed meal breakdowns & calorie info |
| **👨‍🏫 Trainer Booking** | Browse trainers, view ratings & reviews, book sessions, and submit reviews |
| **📈 Progress Tracking** | Log daily weight, completed workouts, and notes; view historical progress |
| **📊 Dashboard** | Overview of active plan, current workout/diet, upcoming bookings, and goals |
| **🔲 QR Code** | Unique QR code per user for gym check-in attendance |
| **⚙️ Profile & Settings** | Update personal info (height, weight, goals), manage account |

### 🛡️ Admin Features
| Feature | Description |
|---|---|
| **📊 Admin Dashboard** | At-a-glance stats for users, enrollments, trainers, and revenue |
| **✅ Pending Approvals** | Review and approve/reject membership enrollment requests with receipt verification |
| **👥 User Management** | View, search, and manage all registered members |
| **📋 Plan Management** | Create, update, and delete membership plans |
| **🏋️ Workout Management** | CRUD operations for workout plans with difficulty levels |
| **🥗 Diet Management** | CRUD operations for diet plans with meal details |
| **👨‍🏫 Trainer Management** | Add, edit, and remove trainers (with image upload to Cloudinary) |
| **📈 Progress Monitoring** | View progress logs submitted by members |
| **📷 QR Scanner** | Scan member QR codes for gym check-in attendance tracking |

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
| Technology | Purpose |
|---|---|
| **React Native 0.81** | Cross-platform mobile UI framework |
| **Expo SDK 54** | Managed workflow for rapid development |
| **React Navigation 7** | Native stack & bottom tab navigation |
| **NativeWind / TailwindCSS** | Utility-first styling |
| **Axios** | HTTP client for API communication |
| **Expo SecureStore** | Secure token & credential storage |
| **Expo Image Picker** | Camera & gallery image selection |
| **react-native-qrcode-svg** | QR code generation for attendance |

### Backend (REST API)
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | Server-side runtime & web framework |
| **MongoDB + Mongoose 9** | NoSQL database & ODM |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **bcryptjs** | Password hashing |
| **Cloudinary + Multer** | Cloud image upload & storage |
| **Jest + Supertest** | Testing framework |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native (Expo)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   Auth   │  │   User   │  │  Admin   │  │   Guest     │ │
│  │  Stack   │  │  Tabs    │  │  Tabs    │  │   Tabs      │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘ │
│       └──────────────┴─────────────┴───────────────┘        │
│                         │  Axios + JWT                       │
└─────────────────────────┼───────────────────────────────────┘
                          │  HTTP / REST
┌─────────────────────────┼───────────────────────────────────┐
│                    Express.js API                            │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Routes  │→ │  Controllers │→ │  Mongoose Models       │ │
│  └──────────┘  └──────────────┘  └───────────┬────────────┘ │
│  ┌──────────────────┐  ┌─────────────────┐   │              │
│  │  Auth Middleware  │  │  Cloudinary     │   │              │
│  │  (JWT + Role)     │  │  (Image Upload) │   │              │
│  └──────────────────┘  └─────────────────┘   │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                          ┌────────────────────┼──────┐
                          │     MongoDB Atlas          │
                          │  (Users, Plans, Trainers,  │
                          │   Enrollments, Progress…)  │
                          └───────────────────────────┘
```

---

## 📁 Project Structure

```
WMT-Gym-Management-System/
├── backend/
│   ├── config/
│   │   └── cloudinaryConfig.js      # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── userController.js        # Auth, profile, CRUD
│   │   ├── membershipController.js  # Membership plan CRUD
│   │   ├── enrollmentController.js  # Plan enrollment + receipt upload
│   │   ├── dietController.js        # Diet plan CRUD
│   │   ├── workoutController.js     # Workout plan CRUD
│   │   ├── trainerController.js     # Trainer CRUD + reviews
│   │   ├── progressController.js    # Progress tracking CRUD
│   │   └── bookingController.js     # Trainer booking CRUD
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT protect + admin role guard
│   ├── models/
│   │   ├── userModel.js             # User schema (with gym goals, QR, attendance)
│   │   ├── membershipModel.js       # Membership plan schema
│   │   ├── enrollmentModel.js       # Enrollment schema (with receipt URL)
│   │   ├── dietModel.js             # Diet schema (with meals array)
│   │   ├── workoutModel.js          # Workout schema (difficulty levels)
│   │   ├── trainerModel.js          # Trainer schema (with reviews & ratings)
│   │   ├── progressModel.js         # Progress log schema
│   │   └── bookingModel.js          # Booking schema (with status flow)
│   ├── routes/
│   │   ├── userRoutes.js            # /api/users
│   │   ├── membershipRoutes.js      # /api/memberships
│   │   ├── enrollmentRoutes.js      # /api/enrollments
│   │   ├── dietRoutes.js            # /api/diets
│   │   ├── workoutRoutes.js         # /api/workouts
│   │   ├── trainerRoutes.js         # /api/trainers
│   │   ├── progressRoutes.js        # /api/progress
│   │   └── bookingRoutes.js         # /api/bookings
│   ├── tests/                       # Jest + Supertest test suites
│   ├── utils/
│   │   └── ensureDefaultAdmin.js    # Auto-creates default admin on startup
│   ├── server.js                    # Express app entry point
│   ├── seed_plans.js                # Database seeder script
│   ├── create_admin.js              # Admin creation utility
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance with base URL & interceptors
│   │   ├── context/
│   │   │   └── AuthContext.js        # Global auth state (login, logout, user)
│   │   ├── navigation/
│   │   │   ├── AuthStack.js          # Login / Register / Onboarding
│   │   │   ├── AppNavigator.js       # Authenticated user stack
│   │   │   ├── AppTabs.js            # User bottom tab navigator
│   │   │   ├── AdminNavigator.js     # Admin bottom tab navigator
│   │   │   └── GuestTabs.js          # Guest bottom tab navigator
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.js
│   │   │   │   ├── RegisterScreen.js
│   │   │   │   └── OnboardingScreen.js
│   │   │   ├── user/
│   │   │   │   ├── DashboardScreen.js
│   │   │   │   ├── PlansScreen.js
│   │   │   │   ├── WorkoutsScreen.js
│   │   │   │   ├── DietsScreen.js
│   │   │   │   ├── TrainersScreen.js
│   │   │   │   ├── BookingsScreen.js
│   │   │   │   ├── ProgressScreen.js
│   │   │   │   ├── ProfileScreen.js
│   │   │   │   └── SettingsScreen.js
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── PendingApprovals.js
│   │   │   │   ├── ManagePlansScreen.js
│   │   │   │   ├── ManageUsersScreen.js
│   │   │   │   ├── ManageTrainersScreen.js
│   │   │   │   ├── ManageWorkoutsScreen.js
│   │   │   │   ├── ManageDietsScreen.js
│   │   │   │   ├── ManageProgressScreen.js
│   │   │   │   ├── QRScannerScreen.js
│   │   │   │   └── AdminSettings.js
│   │   │   └── guest/
│   │   │       ├── PricingPage.js
│   │   │       ├── SupportPage.js
│   │   │       └── SettingsScreen.js
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── App.js                       # Root component with navigation
│   ├── app.json                     # Expo configuration
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** or **yarn**
- **Expo CLI** — `npm install -g expo-cli`
- **MongoDB Atlas** account (or local MongoDB instance)
- **Cloudinary** account (for image uploads)
- **Expo Go** app on your mobile device (for development)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/WMT-Gym-Management-System.git
cd WMT-Gym-Management-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
PORT=5001

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

> The server will start on `http://localhost:5001` by default.

### 3. Seed the Database (Optional)

```bash
# Create a default admin account
node create_admin.js

# Seed membership, diet, and workout plans
node seed_plans.js
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
API_URL=http://<your-local-ip>:5001
```

> ⚠️ Replace `<your-local-ip>` with your machine's local IP address (e.g., `192.168.1.100`). Use `localhost` only for web; physical devices require the actual IP.

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) to launch the app.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port (default: `5001`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `API_URL` | Backend API base URL (e.g., `http://192.168.1.100:5001`) |

---

## 📡 API Endpoints

### Authentication & Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT token |
| `GET` | `/profile` | 🔒 User | Get current user's profile |
| `PUT` | `/:id` | 🔒 User | Update user by ID |
| `DELETE` | `/:id` | 🔒 User | Delete user by ID |
| `PUT` | `/profile/selections` | 🔒 User | Update diet/workout/trainer selections |
| `GET` | `/` | 🔒 Admin | Get all users |

### Memberships — `/api/memberships`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get all membership plans |
| `POST` | `/` | 🔒 Admin | Create a new plan |
| `PUT` | `/:id` | 🔒 Admin | Update a plan |
| `DELETE` | `/:id` | 🔒 Admin | Delete a plan |

### Enrollments — `/api/enrollments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | 🔒 User | Enroll in a plan (with receipt upload) |
| `GET` | `/` | 🔒 Admin | Get all enrollments |
| `GET` | `/my-enrollments` | 🔒 User | Get current user's enrollments |
| `PUT` | `/:id` | 🔒 Admin | Update enrollment status (Approve/Reject) |
| `DELETE` | `/:id` | 🔒 User | Cancel/delete an enrollment |

### Trainers — `/api/trainers`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get all trainers |
| `POST` | `/` | 🔒 Admin | Add a new trainer |
| `PUT` | `/:id` | 🔒 Admin | Update trainer details |
| `DELETE` | `/:id` | 🔒 Admin | Remove a trainer |
| `POST` | `/:id/reviews` | 🔒 User | Submit a review for a trainer |

### Workouts — `/api/workouts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get all workout plans |
| `POST` | `/` | 🔒 Admin | Create a new workout plan |
| `PUT` | `/:id` | 🔒 Admin | Update a workout plan |
| `DELETE` | `/:id` | 🔒 Admin | Delete a workout plan |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get user's bookings |
| `POST` | `/` | 🔒 User | Create a new booking |
| `DELETE` | `/:id` | 🔒 User | Cancel a booking |

### Progress — `/api/progress`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get user's progress logs |
| `POST` | `/` | 🔒 User | Add a new progress entry |
| `DELETE` | `/:id` | 🔒 User | Delete a progress entry |

### Diets — `/api/diets`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get all diet plans |
| `POST` | `/` | 🔒 Admin | Create a new diet plan |
| `PUT` | `/:id` | 🔒 Admin | Update a diet plan |
| `DELETE` | `/:id` | 🔒 Admin | Delete a diet plan |

---

## 🗄️ Database Models

```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : enrolls
    USER ||--o{ PROGRESS : logs
    USER ||--o{ BOOKING : books
    USER }o--o| DIET : selects
    USER }o--o| WORKOUT : selects
    USER }o--o| TRAINER : selects
    MEMBERSHIP ||--o{ ENROLLMENT : has
    TRAINER ||--o{ BOOKING : receives
    TRAINER ||--o{ REVIEW : has

    USER {
        string name
        string email
        string password
        string phone
        number age
        string nic
        number height
        number weight
        string role
        string qrCodeToken
        object gymGoals
    }

    MEMBERSHIP {
        string planName
        number price
        string duration
    }

    ENROLLMENT {
        ObjectId user
        ObjectId membership
        string receiptUrl
        string status
        date enrollmentDate
    }

    DIET {
        string planName
        string description
        number calories
        array meals
        string imageUrl
    }

    WORKOUT {
        string title
        string description
        number duration
        string difficulty
        number caloriesBurned
        string imageUrl
    }

    TRAINER {
        string name
        string specialization
        number experience
        string image
        string availableFrom
        string availableTo
        number rating
        number numReviews
    }

    PROGRESS {
        number weight
        string workoutDone
        date date
        string notes
    }

    BOOKING {
        ObjectId trainer
        string className
        date date
        string status
        string notes
    }
```

---

## 🧪 Testing

The backend includes a test suite built with **Jest** and **Supertest**.

```bash
cd backend
npm test
```

### Test Coverage

| Module | Test File | Component Owner |
|---|---|---|
| User Auth & CRUD | `tests/user.test.js` | Member 1 |
| Enrollment Flow | `tests/enrollment.test.js` | Member 1 |
| Membership Plans | `tests/membership.test.js` | Member 1 |
| Workouts | `tests/workout.test.js` | Member 3 |
| Diets | `tests/diet.test.js` | Member 5 |
| Bookings | `tests/booking.test.js` | Member 4 |

---


## 📸 App Screenshots

| | | |
|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/91690812-69ed-410a-ac4a-1e671aa6914a" width="240" /> | <img src="https://github.com/user-attachments/assets/2e11ac5d-01e6-43ce-9d15-211d4309da8c" width="240" /> | <img src="https://github.com/user-attachments/assets/029748ea-21b9-4d61-976d-6d05a8ac06d7" width="240" /> |
| <img src="https://github.com/user-attachments/assets/ced0d6fb-0bb5-4987-a4c9-038360900555" width="240" /> | <img src="https://github.com/user-attachments/assets/b9c81ff5-e2e9-457a-b331-67859e2dd4c8" width="240" /> | <img src="https://github.com/user-attachments/assets/718f6199-bfdd-4ab3-90ef-10abb9b4c6c4" width="240" /> |

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Built with ❤️ as a university group project using React Native & Node.js**

</div>


