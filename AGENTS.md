# 🤖 AGENTS.md - LightTradeForexVercel Project

## 📚 Project Overview

This is a React + Firebase web application for **LightTrade Forex Academy**, providing:
- Secure user authentication (email and Google via Firebase)
- Protected course content (`Program`)
- Informational pages (Contact, About, Terms, etc.)
- Notification system using a `Toast` component
- Email notifications via Google Apps Script
- Firestore database integration

---

## 🧱 Tech Stack

| Area               | Tech Used             |
|--------------------|------------------------|
| Frontend Framework | React (via CRA or Vite) |
| Routing            | React Router (v6)      |
| Auth               | Firebase Auth          |
| DB                 | Firestore (NoSQL)      |
| Email              | Google Apps Script     |
| Styling            | CSS Modules / Tailwind |
| Hosting            | Vercel                 |

---

## 🔌 Main Components

| Component        | Purpose                          |
|------------------|----------------------------------|
| `App.js`         | Main app entry and router wrapper |
| `AppContent.js`  | Houses page routes               |
| `PrivateRoute.js`| Guards for authenticated-only routes |
| `Toast.js`       | Displays toast notifications     |
| `useAuth.js`     | Custom context for auth state    |

---

## 🔐 Firebase Integration

Configured in `firebase.js`, includes:
- `onAuthStateChanged` listener
- `signInWithEmailAndPassword`, `signOut`
- Access to Firestore for contact form submissions

---

## 📄 Pages

| Route Path     | File             | Description               |
|----------------|------------------|---------------------------|
| `/`            | `Home.js`        | Landing page              |
| `/login`       | `Login.js`       | Firebase login            |
| `/register`    | `Register.js`    | Firebase email signup     |
| `/program`     | `Program.js`     | Protected forex course page |
| `/contact`     | `Contact.js`     | Form + Firestore + Email  |
| `/about`       | `About.js`       | Static info               |

---

## 📬 Email Notifications

The `Contact.js` form:
- Saves user input to Firestore
- Sends email using Google Apps Script (via HTTP POST)
