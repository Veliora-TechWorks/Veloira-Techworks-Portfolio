# Firebase Setup Guide

This project uses Firebase Firestore as the database instead of PostgreSQL/Prisma.

## 🔥 Firebase Configuration

### Environment Variables
The following Firebase environment variables are already configured in `.env`:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCZ8AVtS0YuQO0uSsPRBWWo214rjYPG-FE"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="velioratechworksportfolio.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="velioratechworksportfolio"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="velioratechworksportfolio.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="229673415898"
NEXT_PUBLIC_FIREBASE_APP_ID="1:229673415898:web:6a61b2023c83944a3921e3"

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID="velioratechworksportfolio"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-fbsvc@velioratechworksportfolio.iam.gserviceaccount.com"
FIREBASE_ADMIN_PRIVATE_KEY="[Your Private Key]"
```

## 📊 Database Collections

The Firebase Firestore database uses the following collections:

### Users Collection (`users`)
```javascript
{
  email: string,
  password: string, // hashed
  name: string,
  role: 'ADMIN' | 'EDITOR',
  createdAt: Date
}
```

### Services Collection (`services`)
```javascript
{
  title: string,
  description: string,
  icon: string,
  order: number,
  createdAt: Date
}
```

### Projects Collection (`projects`)
```javascript
{
  title: string,
  description: string,
  image: string,
  technologies: string[],
  category: string,
  githubUrl?: string,
  liveUrl?: string,
  order: number,
  createdAt: Date
}
```

### Posts Collection (`posts`)
```javascript
{
  title: string,
  content: string,
  excerpt: string,
  image?: string,
  isPublished: boolean,
  slug: string,
  tags: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### Contacts Collection (`contacts`)
```javascript
{
  name: string,
  email: string,
  phone?: string,
  company?: string,
  subject: string,
  message: string,
  source: string,
  createdAt: Date
}
```

### Media Collection (`media`)
```javascript
{
  filename: string,
  url: string,
  category: string,
  size: number,
  type: string,
  createdAt: Date
}
```

## 🚀 Getting Started

### 1. Seed the Database
Run the Firebase seed script to create the initial admin user:

```bash
npm run firebase:seed
```

This will create an admin user with:
- Email: `velioratechworks@gmail.com`
- Password: `Veliora@2025`

### 2. Access Admin Dashboard
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Login with the admin credentials above

## 🔧 Firebase Configuration Files

### Client Configuration (`src/lib/firebase.ts`)
Handles client-side Firebase operations (authentication, real-time updates).

### Admin Configuration (`src/lib/firebase-admin.ts`)
Handles server-side Firebase operations (API routes, data management).

### Database Helper (`src/lib/prisma.ts`)
Provides a compatibility layer that mimics Prisma's API using Firebase operations.

## 📝 Available Scripts

- `npm run firebase:seed` - Seed the database with initial data
- `npm run dev` - Start development server
- `npm run build` - Build for production

## 🔐 Security Rules

Make sure your Firebase Firestore security rules allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public collections
    match /services/{document} {
      allow read: if true;
    }
    match /projects/{document} {
      allow read: if true;
    }
    match /posts/{document} {
      allow read: if resource.data.isPublished == true;
    }
    
    // Require authentication for admin operations
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

When deploying to Vercel:

1. Set all environment variables in Vercel dashboard
2. Ensure Firebase project is properly configured
3. Deploy normally - Firebase will work automatically

## 🆘 Troubleshooting

### Database Connection Issues
- Verify Firebase project ID and credentials
- Check that environment variables are properly set
- Ensure Firebase project has Firestore enabled

### Authentication Issues
- Verify Firebase Auth is enabled in your project
- Check that admin user was created successfully
- Ensure JWT secrets are properly configured

### Data Not Displaying
- Run `npm run firebase:seed` to populate initial data
- Check browser console for Firebase errors
- Verify Firestore security rules allow read access