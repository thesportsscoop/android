# Firestore Permission Fixes for LightTrade FOREX Academy

## Summary
This document explains the recent changes made to resolve Firestore permission-denied errors for regular users and to ensure proper access control in the LightTrade FOREX Academy app.

---

## 1. Firestore Read Timing in AuthContext.js
- **Problem:** Firestore user document reads were occurring before authentication was established, causing permission-denied errors.
- **Solution:**
  - Updated `AuthContext.js` so that Firestore reads (e.g., subscription plan lookup) only occur after the user is authenticated and `loading` is false.
  - This prevents premature reads with `request.auth == null` in Firestore rules.

**Code Pattern:**
```js
useEffect(() => {
  if (loading || !currentUser) return;
  // Safe to read Firestore here
}, [currentUser, loading]);
```

---

## 2. Firestore Rules for /programs
- **Problem:** Regular users (e.g., `legacyFree`) were denied access when the app tried to list all programs from the `programs` collection.
- **Solution:**
  - Updated Firestore rules so that all authenticated users can read all documents in `/programs`:

```firestore
match /programs/{programId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null &&
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.subscriptionPlan == 'admin';
}
```
- This allows any signed-in user to fetch all programs, fixing permission-denied errors in `Program.js`.

---

## 3. Other Notes
- Admins retain full write access to programs and can list/edit user progress.
- User documents must exist for all authenticated users to avoid permission errors.
- If you want to restrict access to certain programs in the future, you can re-introduce logic based on `subscriptionPlan` or other user fields.

---

## Testing
- After these changes, regular users can log in and view all programs.
- No permission-denied errors should occur for `/programs` or `/users/{uid}` reads after authentication.

---

## Next Steps
- Further restrict or expand access as needed by updating Firestore rules.
- Always ensure Firestore reads are performed after authentication is confirmed.

---

**Last updated:** July 23, 2025
