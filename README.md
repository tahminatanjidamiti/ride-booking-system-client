# 🚖 Ride Booking System Frontend

A modern, responsive frontend application for the **Ride Booking System**, built with **React**, **TypeScript**, **Tailwind CSS**, **Shadcn**, **Radix UI**, and **Redux Toolkit**. It provides riders, drivers, and admins with a smooth, interactive experience.

# 🌐 Live Link
[https://ride-booking-system-frontend-five.vercel.app/](https://ride-booking-system-frontend-five.vercel.app/)

## 🚀 Features

### 🔐 Authentication & User Management
- 🗝 Sign Up / Login with JWT Authentication (connects to backend)
- 👤 Role-based dashboards for Rider, Driver, and Admin
- 🔒 Secure password change/reset flows
- ✉ Email notifications via integrated email services

### 🧑‍💼 Rider Features
- 🚖 Request and cancel rides with pickup & destination points
- 🕓 View ride history and status updates
- 💳 Initiate payments and view invoices
- 📍 Live driver location on maps (Leaflet integration)

### 🚗 Driver Features
- ✅ Accept/Reject ride requests
- 🔄 Update ride status (On the way, Completed, Cancelled)
- 📍 Real-time location updates for rides
- 📊 View earnings and ride statistics

### 🧑‍⚖️ Admin Features
- 👥 Manage users and drivers (approve/suspend/block)
- 📊 Dashboard for rides, bookings, payments, and analytics
- 📝 View full ride history and bookings

### ✨ UI & UX Enhancements
- 💨 Smooth animations with Framer Motion
- 🛠 Custom components built using Radix UI
- 🌙 Dark/Light theme toggle
- 🏞 Responsive design for mobile, tablet, and desktop
- 🔄 Interactive charts with Recharts for analytics

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** for fast development & build
- **Tailwind CSS** + **tailwind-merge** for styling
- **Radix UI** for accessible UI components
- **Redux Toolkit** for state management
- **React Router v7** for routing
- **Framer Motion** for animations
- **Leaflet & react-leaflet** for map integration
- **Zod + react-hook-form** for form validation
- **Axios** for API calls
- **Sonner** for toast notifications
- **React Joyride** for interactive guides
- **React Fast Marquee** for scrolling components
- **Recharts** for analytics charts

---

## 📁 Project Structure

```txt
src/
├── api/                     # Axios API instance & API calls
├── assets/                  # Images, icons, fonts
├── components/              # Reusable UI components (buttons, inputs, modals)
├── features/
│   ├── auth/                # Login, registration, password reset forms
│   ├── driver/              # Driver dashboard & ride management
│   ├── rider/               # Rider dashboard & booking components
│   ├── admin/               # Admin dashboard & analytics
│   ├── map/                 # Map components using Leaflet
│   └── payment/             # Payment UI & invoice components
├── hooks/                   # Custom React hooks
├── layouts/                 # Dashboard layouts for roles
├── pages/                   # Route pages (Home, Login, Dashboard, etc.)
├── redux/                   # Redux slices & store setup
├── routes/                  # Protected routes & route guards
├── styles/                  # Global styles and Tailwind overrides
├── utils/                   # Helper functions (validation, formatting)
├── App.tsx                  # Main React component
└── main.tsx                 # App entry point

# Root files
package.json                  # Project dependencies
vite.config.ts                # Vite configuration
tailwind.config.js            # Tailwind CSS configuration
tsconfig.json                 # TypeScript configuration
.env.example                  # Example environment variables

```

## 🧑‍💻 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository.
### 2. Install the necessary dependencies.
### 3. Configure Environment Variables.
### 4. Run the application.

## 📡 API Endpoints

### Users
- `POST /api/v1/user/register` Register a new user
- `GET /api/v1/user/all-users` List all users (with filters)

**Query Parameters:**
- `fields` Select fields to return (e.g. `name,email`)
- `sort` `1` or `-1`
- `limit` Max number of users
- `page` For pagination

- `GET /api/v1/user/me` Get current logged-in user
- `PATCH /api/v1/user/:id` Update user profile
- `DELETE /api/v1/user/:id` Delete user profile
---

### OTP
- `POST /api/v1/otp/send` Send OTP to user
- `POST /api/v1/otp/verify` Verify OTP 

### SOS
- `POST /api/v1/sos` SOS Send user
- `POST /api/v1/sos/:id/update` Update SOS 
- `POST /api/v1/otp/end` End SOS 

### Auth
- `POST /api/v1/auth/login` Login
- `POST /api/v1/auth/logout` Logout
- `POST /api/v1/auth/change-password` Change password
- `POST /api/v1/auth/reset-password` Reset password
- `POST /api/v1/auth/forgot-password` Forgot password
- `POST /api/v1/auth/refresh-token` Refresh JWT
- `POST /api/v1/auth/set-password` Set password
---

### Drivers
- `POST /api/v1/drivers/create` Create a driver profile
- `GET /api/v1/drivers` List all drivers (with filters)
- `GET /api/v1/drivers/stats/me` Get driver earnings statistics

**Query Parameters:**
- `search` Keyword search
- `limit` Number of drivers
- `page` Page number
- `sortBy` e.g. `createdAt`
- `sortOrder` `asc` or `desc`

- `GET /api/v1/drivers/:id` Get driver by ID
- `PATCH /api/v1/drivers/:id/status` Update drivers status
- `GET /api/v1/drivers/nearest` Find nearest drivers by geo-location

**Geo Query Parameters:**
- `lng` Longitude
- `lat` Latitude
- `radius` In kilometers
---

### Rides
- `POST /api/v1/rides/request` Request a new ride
- `GET /api/v1/rides` List rides (with filters)

**Query Parameters:**
- `status` e.g. `COMPLETED`, `CANCELLED`
- `limit` Number of results
- `sortBy` e.g. `createdAt`
- `sortOrder` `asc` or `desc`

- `GET /api/v1/rides/my-rides-history` Get logged-in user's ride history
- `PATCH /api/v1/rides/:id/cancel` Cancel a ride
---

### Bookings
- `POST /api/v1/booking` Create a booking
- `GET /api/v1/booking` List all bookings
- `GET /api/v1/booking/my-bookings` Get logged-in user's bookings
- `GET /api/v1/booking/:id` Get a booking by ID
- `PATCH /api/v1/booking/:id/status` Update booking status
---

### Payments
- `POST /api/v1/payment/init-payment/:bookingId` Initiate payment for booking
- `GET /api/v1/payment/invoice/:bookingId` Get invoice download URL
---

### Stats
- `GET /api/v1/stats/user` Get user statistics
- `GET /api/v1/stats/driver` Get driver statistics
- `GET /api/v1/stats/ride` Get ride statistics
- `GET /api/v1/stats/booking` Get booking statistics
- `GET /api/v1/stats/payment` Get payment statistics
---

## 🧹 Code Quality
- TypeScript interfaces for type safety.
- Centralized error handling.

## ✅ Status
Project is functional and under active development.