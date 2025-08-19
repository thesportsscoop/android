# 🚀 LightTradeForex Academy

A modern, premium React web platform for forex trading education with comprehensive learning programs, progress tracking, and admin management.

## ✨ Key Features

## 📝 Planned Improvements / TODO
- Log sent emails to Firestore for audit
- Add 'reply-to' support to transactional emails
- Track delivery status and failures for waitlist emails
- Add admin UI for resending or reviewing email logs
- Track and restrict simultaneous logins for subscribed/paid users (prevent account sharing)

---

### ✅ Paystack Payment Flow: Production Ready
- **Webhook URL:** `https://lighttradeforex.com/api/verify-paystack` (server-to-server notification)
- **Callback URL:** `https://lighttradeforex.com/join-waitlist/success` (user-facing confirmation page)
- Both are set in the Paystack dashboard and tested.
- Users see a friendly confirmation after payment; admin dashboard updates automatically.
- See `/join-waitlist/success` for user-facing success and `/api/verify-paystack` for backend payment verification.

---


### 🔐 Authentication & Security
- **Firebase v9+ Authentication** with Google Sign-In and Email/Password
- **Email Verification** with secure token-based verification links
- **Password Reset** functionality with secure tokens
- **Protected Routes** with role-based access control
- **Subscription-based Access** (Free, Premium, Admin)
- **Secure Firestore Rules** for data protection

### 📚 Learning Management
- **Multi-Level Programs**: Beginner, Intermediate, Advanced
- **Video-Based Learning** with YouTube integration
- **Progress Tracking** with completion status
- **Interactive Quizzes** for knowledge assessment
- **Module Management** with CRUD operations

### 👨‍💼 Admin Panel
- **Program Management**: Create, edit, delete programs
- **Module Management**: Add videos and content to programs
- **Quiz Management**: Create and manage assessments
- **User Management**: View user progress and access levels
- **Real-time Updates** with Firebase sync

### 🎯 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Sticky Footer**: Consistent layout across all pages
- **Enhanced User Menu**: Shows accessible programs based on subscription
- **Progress Visualization**: Clear progress bars and completion tracking
- **Toast Notifications**: Real-time feedback for user actions

### 🔧 Technical Features
- **React 18** with modern hooks and context
- **Firebase v9+** for backend services
- **Real-time Data Sync** with Firestore
- **Secure Authentication** with role-based access
- **Responsive CSS** with modern design patterns
- **Component-based Architecture** for maintainability
TXT     | @                      | google-site-verification=zQYNTJbaGIRcxZAsY525o3LjPiU1wJVMO6LhBTXVUc8
TXT     | @                      | v=spf1 include:_spf.firebasemail.com ~all
TXT     | @                      | firebase=forex-academy-34a15
```

#### DNS Propagation
- Changes may take up to 48 hours to fully propagate
- Check propagation status using: [whatsmydns.net](https://www.whatsmydns.net/)

#### Common Scenarios

**New User Signup**
1. User signs up with email/password
2. Verification email is sent automatically
3. User clicks verification link in email
4. Email is verified, user can log in

**Unverified Login Attempt**
1. User tries to log in with unverified email
2. Error message explains email needs verification
3. User can request a new verification email
4. After verification, user can log in successfully

**Resend Verification**
1. User navigates to login page
2. Clicks "Resend Verification Email"
3. System verifies credentials and sends new email
4. User checks their inbox for the verification link

### User Experience
- **Responsive Design** that works on all devices
- **Modern UI/UX** with smooth animations and transitions
- **Loading States** for better user feedback
- **In-App Notifications** for system feedback

## 🛠 Development

---

## 🚀 Final Deployment & Go-Live (Vercel)

### Production Ready!
All authentication (Firebase Email/Google/MQL5), Firestore security, payment (Paystack), and environment variable management are complete and secure.

### Go-Live Checklist
- [x] All environment variables (.env) are up to date and **no secrets are in the codebase**
- [x] `.env.example` is accurate for Vercel dashboard setup
- [x] All debug logs (including Firebase config logs) have been removed
- [x] App runs locally with no errors (`npm start`)
- [x] Firestore rules block client updates to sensitive payment flags
- [x] Paystack, Firebase, and MQL5 OAuth integration tested and working

### Vercel Environment Variables
1. Go to your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings > Environment Variables**.
3. Add all variables from your `.env`:
   - Frontend (public): All `REACT_APP_*` keys
   - Backend (private): `PAYSTACK_SECRET_KEY`, `MQL5_CLIENT_ID`, `MQL5_CLIENT_SECRET`, `MQL5_REDIRECT_URI`
4. Redeploy your project after saving changes.

### Deployment Instructions
1. Commit and push all changes:
   ```bash
   git add .
   git commit -m "Finalize deployment: secure env, remove debug logs, ready for Vercel"
   git push
   ```
2. Vercel will auto-deploy from your main branch.
3. Test your site at the provided Vercel URL.

### Troubleshooting `.env` on Windows
- `.env` must have no comments/blank lines at the top
- Save as UTF-8 (no BOM)
- Restart dev server after any `.env` change
- If variables are `undefined`, check for `.env.local` or similar override files

### Your App is Now Production Ready!

---

## 💳 Paystack Payment Verification API (Vercel)

> **Production Ready!**
> The Paystack integration is ready for live payments and secure backend verification.

### How it works
- **Frontend** collects payment using Paystack public key and receives a payment reference.
- **Frontend** sends the reference to `/api/verify-paystack` (serverless API on Vercel).
- **API** uses your Paystack secret key (from Vercel env vars) to verify the payment with Paystack.
- **API** returns the verification result to the frontend, which then updates Firestore or grants access.

### 🚀 Go-Live Checklist
- [x] All payment and verification logic tested in staging.
- [x] `PAYSTACK_SECRET_KEY` set in Vercel (see below).
- [x] Paystack dashboard is set to **Live Mode**.
- [x] Frontend only uses the **public** key; backend uses the **secret** key.
- [x] No secret keys in any frontend code or repo.

### Vercel Environment Variables
1. Go to your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings > Environment Variables**.
3. Add the following variable:
   - `PAYSTACK_SECRET_KEY=sk_live_xxx...`
4. Redeploy your project after saving changes.

### Frontend Example
```js
// After payment, send reference to API
const res = await fetch('/api/verify-paystack', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reference }),
});
const data = await res.json();
// Use data.status and data.data for verification
```

> **Never expose your secret key in frontend code!**

---

## 🛠 Development

### Current Branch Structure

#### Local Branches
- `development` (currently checked out) - Stable branch for static pages
- `main` - Production branch (stable, tested code)
- `feature/program-pages` - Active development for program-related features

#### Remote Branches
- `origin/development` - Tracks local development branch
- `origin/main` (default branch) - Tracks production code
- `origin/feature/program-pages` - Remote tracking for program features

### Branch Workflow

1. **Stable Pages** (Home, About, Login, etc.):
   - Branch: `development`
   - These pages are considered stable and should not be modified directly

2. **Feature Development** (Program pages, etc.):
   - Branch: `feature/*` (e.g., `feature/program-pages`)
   - Create new feature branches from `development`
   - Test thoroughly before merging back

3. **Merging to Production**:
   - Only merge to `main` after thorough testing in `development`
   - Use pull requests for code review

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lighttrade-forex-vercel.git
   cd lighttrade-forex-vercel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Firebase config:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Development Workflow

1. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make and test your changes

3. Commit your changes with a descriptive message:
   ```bash
   git add .
   git commit -m "type: brief description of changes"
   ```

4. Push to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request to the `development` branch on GitHub

### Commit Message Guidelines
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style/formatting
- `refactor:` Code changes that don't fix bugs or add features
- `test:` Adding or modifying tests
- `chore:` Maintenance tasks

## 🔒 Authentication

The application uses Firebase Authentication with the following features:
- Email/Password authentication
- Google Sign-In
- Password reset functionality
- Protected routes
- Session persistence

## 🚀 Deployment

The application is configured for deployment on Vercel. The `main` branch is automatically deployed to production, while the `development` branch is deployed to a preview environment.

### Environment Variables
Make sure to set the following environment variables in your deployment platform:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 👥 Contact

For support or inquiries, please contact the development team.
- **Enhanced Error Handling**: Improved error messages and user feedback for authentication flows
- **Protected Routes**: Implemented proper route protection with redirects
- **Password Management**: Added password reset and update functionality

#### UI/UX Improvements
- **Page Scrolling**: Fixed scroll behavior on route changes
- **Heading Consistency**: Removed duplicate headings across authentication pages
- **Form Validation**: Enhanced form validation with real-time feedback
- **Loading States**: Added loading indicators during authentication processes

#### Social Media Integration
- Added direct links to all social platforms
- Optimized icons for better visibility and performance
- Removed animations for smoother interaction

#### Navigation & Mobile Experience
- Improved mobile menu with better touch targets
- Optimized header spacing and alignment
- Fixed blur effects for better visual hierarchy

#### Performance
- Optimized image and asset loading
- Improved page load times
- Better mobile performance and battery efficiency

### Mobile Experience
- Fully responsive design for all screen sizes
- Touch-friendly navigation and form elements
- Optimized video and image loading for mobile data
- Improved touch targets for better usability


## UI/UX & Accessibility Highlights
- **Fonts:** Oswald for headings/nav, Inter for body—industry best-practice pairing.
- **Colors:** Soft blue gradient background, strong blue headings, yellow accents, and high-contrast text.
- **Cards:** Modern, responsive, with hover/focus/active states.
- **Hero Video:** Edge-to-edge, left corners rounded (desktop), overlay with ARIA for accessibility.
- **Navigation:** Large, touch-friendly, with About link and focus-visible outline.
- **Footer:** Always visible, never overlaps content, with contact and legal links.
- **Accessibility:** Alt text, ARIA labels, keyboard navigation, visible focus outlines.
- **Mobile:** All UI adapts for small screens—no horizontal scrolling, readable text, touch-friendly buttons.

---

## Customizing Branding, Colors, or Fonts
- **Fonts:** Change Google Fonts in `public/fonts.css` and update `App.css` font-family rules.
- **Colors:** Adjust gradient/backgrounds and accent colors in `App.css`.
- **Hero Video:** Replace `src/videos/LTSForexForBeginners.mp4` with your own video for a custom intro.
- **Logo/Brand:** Edit overlay text and nav brand in `Header.js` and `App.css`.

---

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```

---

## Deployment & Production
- Build for production:
  ```bash
  npm run build
  ```
- Deploy to Vercel, Netlify, or your preferred static host.
- For large assets (videos), consider CDN or Git LFS for best performance.

---

## Contact
- WhatsApp/Phone: +1 567 264 7940
- Email: lighttradeforex@gmail.com

---

## License
MIT

## Project Structure
- `src/App.js` — Main app, routing, and auth provider
- `src/Header.js` / `src/Footer.js` — Site navigation and footer
- `src/pages/` — All main pages: Home, Login, Register, Program, ProgramTrack, Contact, About, Terms, Privacy, ForgotPassword
- `src/contexts/AuthContext.js` — Authentication logic and in-app notifications
- `src/firebase.js` — Firebase config and initialization
- `src/App.css` — All custom styles, with modern form/button/card styles

## Architecture Diagram
```mermaid
graph TD;
    subgraph "React App"
        A[App.js] --> B{AppContent};
        A --> C[AuthContext];
        B --> D[Home];
        B --> E[Login];
        B --> F[Register];
        B --> G[Program];
        B --> H[Contact];
        B --> I[About];
        B --> J[Terms];
        B --> K[Privacy];
        B --> L[ForgotPassword];
        B --> M[Admin];
        B --> N[PrivateRoute];
        N --> C;
        G --> N;
        M --> N;
    end

    subgraph "UI Components"
        T[Header]
        U[Footer]
        V[UserMenu]
        W[PageSpinner]
    end
    B --> T;
    B --> U;
    T --> V;
    V --> C;

    subgraph "API (Vercel Serverless)"
        X[/api/verify-paystack]
    end

    subgraph "Firebase"
        O[firebase.js]
        P[Firestore]
        Q[Users]
        R[Programs]
        S[Quizzes]
    end

    C --> O;
    E --> O;
    F --> O;
    O --> P;
    P --> Q;
    P --> R;
    P --> S;
    M --> R;
    M --> S;

    %% New integration arrows
    B --> X;
    X --> O;
    X -.->|Paystack Secret Key| Y(Paystack API);

    style X fill:#D6EAF8,stroke:#333,stroke-width:2px
    style Y fill:#F1948A,stroke:#333,stroke-width:2px
    style A fill:#5DADE2,stroke:#333,stroke-width:2px
    style B fill:#5DADE2,stroke:#333,stroke-width:2px
    style C fill:#F9E79F,stroke:#333,stroke-width:2px
    style D fill:#AED6F1,stroke:#333,stroke-width:2px
    style E fill:#AED6F1,stroke:#333,stroke-width:2px
    style F fill:#AED6F1,stroke:#333,stroke-width:2px
    style G fill:#AED6F1,stroke:#333,stroke-width:2px
    style H fill:#AED6F1,stroke:#333,stroke-width:2px
    style I fill:#AED6F1,stroke:#333,stroke-width:2px
    style J fill:#AED6F1,stroke:#333,stroke-width:2px
    style K fill:#AED6F1,stroke:#333,stroke-width:2px
    style L fill:#AED6F1,stroke:#333,stroke-width:2px
    style M fill:#FFC300,stroke:#333,stroke-width:2px
    style N fill:#5DADE2,stroke:#333,stroke-width:2px
    style O fill:#82E0AA,stroke:#333,stroke-width:2px
    style P fill:#82E0AA,stroke:#333,stroke-width:2px
    style Q fill:#82E0AA,stroke:#333,stroke-width:2px
    style R fill:#82E0AA,stroke:#333,stroke-width:2px
    style S fill:#82E0AA,stroke:#333,stroke-width:2px
    style T fill:#F9E79F,stroke:#333,stroke-width:2px
    style U fill:#F9E79F,stroke:#333,stroke-width:2px
    style V fill:#F9E79F,stroke:#333,stroke-width:2px
    style W fill:#F9E79F,stroke:#333,stroke-width:2px
```
graph TD;
    %% User visits site
    A[User Visits App] --> B[Login/Register Page]
    B -->|Email/Password| C[Firebase Auth]
    B -->|Google| D[Google OAuth]
    B -->|MQL5| E[MQL5 OAuth]

    %% MQL5 OAuth flow
    E --> F[Vercel API /api/mql5-login.js]
    F --> C

    %% After Auth
    C --> G[AuthContext.js]
    G --> H[Firestore User Doc]
    H -->|Provider field| I[Admin Dashboard]
    G --> J[AppContent + PrivateRoute]
    J --> K[Programs/JoinWaitlist]

    %% Payment/Subscription logic
    K --> L[Paystack API]
    L --> M[Backend Verify API]
    M --> H
    H --> N[Access Flags: intermediatePaid, advancedPaid]
    N --> J

    %% Admin
    I --> O[Provider, Subscription, Progress]

    %% Feedback
    G --> P[Toast Notifications]
    J --> Q[Progress Tracking, Quizzes]

    %% Error flows
    B --> R[Error/Feedback]
    F --> S[API Error/Feedback]
    G --> T[Auth/Payment Error]

    %% Styling
    style A fill:#5DADE2,stroke:#333,stroke-width:2px
    style B fill:#AED6F1,stroke:#333,stroke-width:2px
    style C fill:#82E0AA,stroke:#333,stroke-width:2px
    style D fill:#82E0AA,stroke:#333,stroke-width:2px
    style E fill:#82E0AA,stroke:#333,stroke-width:2px
    style F fill:#F9E79F,stroke:#333,stroke-width:2px
    style G fill:#F9E79F,stroke:#333,stroke-width:2px
    style H fill:#FFC300,stroke:#333,stroke-width:2px
    style I fill:#FFC300,stroke:#333,stroke-width:2px
    style J fill:#5DADE2,stroke:#333,stroke-width:2px
    style K fill:#AED6F1,stroke:#333,stroke-width:2px
    style L fill:#F9E79F,stroke:#333,stroke-width:2px
    style M fill:#F9E79F,stroke:#333,stroke-width:2px
    style N fill:#FFC300,stroke:#333,stroke-width:2px
    style O fill:#FFC300,stroke:#333,stroke-width:2px
    style P fill:#F9E79F,stroke:#333,stroke-width:2px
    style Q fill:#AED6F1,stroke:#333,stroke-width:2px
    style R fill:#dc3545,stroke:#333,stroke-width:2px
    style S fill:#dc3545,stroke:#333,stroke-width:2px
    style T fill:#dc3545,stroke:#333,stroke-width:2px
```

**Lifecycle summary:**
- User can log in via Email, Google, or MQL5 (OAuth via Vercel API)
- AuthContext manages auth state and Firestore provider tracking
- JoinWaitlist and Program pages enforce per-track access and payment
- Admin dashboard shows provider, subscription, and user progress
- All flows include error and feedback handling for robust UX

## Tech Stack
- React
- Firebase

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```

## Firebase Configuration
- Project ID: forex-academy-34a15
- Web API Key: AIzaSyBbquZq8RikP9yxiaSquBJ_yOM5xzh4Qfg
- Authentication: Google Sign-In and Email/Password enabled

## Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public form submission or contact support
    match /contacts/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // User learning or app progress data
    match /userProgress/{userId} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == userId;
    }

    // Main user profile collection
    match /users/{userId} {

      // Allow user to read their own document
      allow read: if request.auth != null &&
                   request.auth.uid == userId;

      // Allow create with only lastActiveAt, safe fields, or a default plan
      allow create: if request.auth != null &&
        request.auth.uid == userId &&
        (
          // Case 1: Only creating lastActiveAt using serverTimestamp()
          (request.resource.data.keys().hasOnly(['lastActiveAt']) &&
           request.resource.data.lastActiveAt == request.time)

          // Case 2: Creating any other safe fields, but NOT restricted ones
          || (!request.resource.data.keys().hasAny([
            'role',
            'subscriptionPlan',
            'provider'
          ]))
        );

      // Allow updates that don't modify restricted fields
      allow update: if request.auth != null &&
        request.auth.uid == userId &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny([
          'role',
          'lastActiveAt',
          'provider', // protect provider from client changes
          'subscriptionPlan'
        ]);

      // Allow controlled updates to lastActiveAt only
      allow update: if request.auth != null &&
        request.auth.uid == userId &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['lastActiveAt']) &&
        request.resource.data.lastActiveAt == request.time;

      // Disallow deletes from the client
      allow delete: if false;
    }

    // Program and quiz data
    match /programs/{programId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.subscriptionPlan == 'admin';
    }

    match /quizzes/{quizId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.subscriptionPlan == 'admin';
    }
  }
}
```

## Track-Based Quizzes

Quiz data is stored in Firestore under the collection path:

```
/quizzes/{track}
```

Where `{track}` is one of `beginner`, `intermediate`, or `advanced`. Each document
contains a `sections` array with objects:

- `section` *(string)* – section title
- `questions` *(array)* – list of question objects

Question object:

```json
{
  "question": "What is ...?",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "answer": "B"
}
```

### Adding or Updating Quizzes

1. Create a JSON file using the above structure (`intermediate_quiz.json`, etc.).
2. Upload using the Firebase Admin SDK, Firefoo, or Firebase CLI:

   ```js
   import { initializeApp, cert } from 'firebase-admin/app';
   import { getFirestore } from 'firebase-admin/firestore';
   import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };
   import fs from 'fs';

   initializeApp({ credential: cert(serviceAccount) });
   const db = getFirestore();

   const data = JSON.parse(fs.readFileSync('./intermediate_quiz.json', 'utf8'));
   await db.doc('quizzes/intermediate').set(data);
   ```

3. To append more sections later, modify the `sections` array and call `.set()` with
   `{ merge: true }` to keep existing fields.


### Removing Quizzes

- Delete a track entirely with `db.doc('quizzes/advanced').delete()`.
- Remove a single section by editing the `sections` array and writing the document
  back.

## Admin Management

Admins are managed via the `subscriptionPlan` field in their user document in Firestore. To make a user an admin, set their `subscriptionPlan` to `'admin'`.

### Making a User an Admin

1.  Go to the [Firebase console](https://console.firebase.google.com/).
2.  Select your project (`forex-academy-34a15`).
3.  In the left-hand menu, click on **Firestore Database**.
4.  Navigate to the `users` collection.
5.  Find the user you want to make an admin and edit their document.
6.  Set the `subscriptionPlan` field to `'admin'`.

## Legacy Free Access Until Paid Launch

The `subscriptionPlan` field in each user document tracks the user's access tier
and will eventually distinguish between paid levels like `'paidTier1'`. During
the pre-launch phase all users should have `subscriptionPlan: 'legacyFree'`.

### Bulk Updating Existing Users

Use the Firebase Admin SDK to update all current accounts:

```js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const snap = await db.collection('users').get();
const batch = db.batch();
snap.forEach(doc => batch.update(doc.ref, { subscriptionPlan: 'legacyFree' }));
await batch.commit();
```

### Default for New Sign Ups

When a user registers the app creates a document under `users/{uid}` with the
following fields:

* `subscriptionPlan` – set to `legacyFree` so everyone keeps free access until
  paid tiers launch
* `provider` – records the sign‑in method

Make sure your Firestore rules permit this initial state so new accounts are
written successfully.

### Signup & Subscription Flow

```mermaid
graph TD
    A[User Registers] --> B[Firestore users/{uid}]
    B --> C{subscriptionPlan}
    C -->|default| D[legacyFree]
    C -->|admin update| E[paid tier]
```

Admins can later update `subscriptionPlan` to paid levels (e.g. `paidTier1`) via
the Firebase console or Admin SDK.

### Lock Down the Field in Firestore Rules

Only trusted administrators should be allowed to modify `subscriptionPlan`.
Update your security rules accordingly so ordinary users cannot change this
property themselves.

## Contact
- WhatsApp/Phone: +1 567 264 7940
- Email: lighttradeforex@gmail.com
