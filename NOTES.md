# Developer Notes

## Updated Firestore Security Rules

The application now tracks the last active timestamp for each user in a `users` collection. Ensure your Firestore rules allow authenticated users to read and write their own document:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      // Allow user to read their own document
      allow read: if request.auth != null && request.auth.uid == userId;

      // Allow create if no restricted fields are present
      allow create: if request.auth != null &&
        request.auth.uid == userId &&
        !request.resource.data.keys().hasAny([
          'role',
          'lastActiveAt'
        ]);

      // Allow updates that don't modify restricted fields
      allow update: if request.auth != null &&
        request.auth.uid == userId &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny([
          'role',
          'lastActiveAt'
        ]);

      // Disallow deletes from the client
      allow delete: if false;
    }
  }
}
```

These rules mirror the `firestore.rules` file and should be referenced when updating the architecture or working with user data.
