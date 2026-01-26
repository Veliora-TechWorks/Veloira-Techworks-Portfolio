# Deployment & Upload Fix Guide

## Quick Fix Summary

The upload functionality and deployment issues have been resolved. Follow these steps:

### 1. Local Development Fix

The upload should now work locally. Test it:

1. Start the development server: `npm run dev`
2. Go to `/admin/media`
3. Select a category (not "all")
4. Upload an image
5. Check `/api/env-check` to verify environment variables

### 2. Deployment to Vercel

#### Step 1: Environment Variables
In your Vercel dashboard, add these environment variables:

```
NEXTAUTH_SECRET=VelioraTechWorks2025SecretKey
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=VelioraTechWorksJWTSecret2025

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCZ8AVtS0YuQO0uSsPRBWWo214rjYPG-FE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=velioratechworksportfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=velioratechworksportfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=velioratechworksportfolio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=229673415898
NEXT_PUBLIC_FIREBASE_APP_ID=1:229673415898:web:6a61b2023c83944a3921e3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8S2EQGHFRF

FIREBASE_ADMIN_PROJECT_ID=velioratechworksportfolio
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@velioratechworksportfolio.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeKXQQB7ZoDqEb\nLixyTOcRvhUG0FH5WOE9/TJ3JvRgtY1gisNnuyLE/wTmpvSgpP1CY/sDVjkobGbL\nqFO9UY+MXOqr0DPd7k3C3yCGDlExIFnafB/fOKydf4UTgMtrZ8gqUaTwU/qkPIgS\nUSwNTv6RS12dLNE6aZn9QB7PByTkcVlO0YnKCtrYk41z1W/ZJC0QHvmLDxppb0Oy\nGJ8JdrcwL0+HuZJoroota4LuqpNIITXPsdbO/1aEqCIvs+w4/ZY8P8MiBMmEa28N\n29Y0WVYcxwJefsoFcViqQ8GqSH+rOfBqicGTEzWBadnSOgCUVMC0Mo21wZhfcxPM\nvjpeWZhXAgMBAAECggEAMU+5WPoem+jbwA6wWt6xOG3sPlibBkP4zgvwPQgPL0vL\njWsWK3REDel4zLUHFkL6l0V20H6EiZ7qmdqcaS1RtTCPFgxu72XKJtTMXh9+nvN4\nME983GreHqjQg9knExCjbtZPt4JnZeddgWB/fJLBeelmgYekoDKmiTgBowiWLwbO\nXKn3s86DP+ZeQ6WhTO6SFTvcgGVgzpUFbkYGWKnyzD2Zh6mpYBmj4o34jgiRL64i\n0h2HpNKrjm9FbDH77cNxWeI/fT7n0J+VFZNH0Qz4oPLNIeCXs/XhQBarLozGODhL\nravGTdvlNF57Fo9Uo5xoCcRrFf+K+tMIe+gjCPVVIQKBgQDV82cQtoBuM0NSBItJ\nX20n+jCzLJAaRXWxtN0Jccw4Ukm8TafszCu/RoCWBPafl7ezFyg0KTzNA2uE2zoL\naCKyIHi1WMDKNRVJMVd3SAS10GvegthCOeJ6VzqaCAXv0mxx5jG4AvKeIV3Q1Rn4\niX4/BLCyQX/TiMmpNjRoQI52BwKBgQC9Px8yFCblMTbYy7DGIoQz+7VyoUaeXdwg\npoDF22r03DaDgzJlh6ASjTBFTZ5DCwqGHO0XctoGFuUXKo/zyZvYTWV831lO1fcr\nzEzgRA8+9qD/14T71FvGCBCRhivMz9aULfo/V0tdGcPAQkQcmk3Y681rhFxq9xYG\nNVuKUBq3MQKBgAt88VjNY+IG8KNzyQLck+Dkpz7HsskmV6Z+HqxGJwATMxBgXxbw\n85xmrbrgc1mobN257Ze3ayNa/qf4mYpJQiusYK7kIB37cbQnaRnnjREyKsic3/3W\nW9nT2zqwGZmCA/6trJfD2MEy63WuK6HTyCqcFtzLdZCnNKTYW0IJzVx7AoGAM5xQ\nVKb8SIsYax150z88kLS3slBbYvsz+k+OVOdXDvozf8A68UeAly6cGHpni98p+pNO\n8ZMn9Hsv9RZtdc3oy5+n6ts6ju55Xx9zY8IL6l72X2+WW9t5P9OZOSa/MTcJTRYQ\n5k9XRUeug/NOggJu8pa0Sfsp/R3virfohBr+fjECgYEA0a8kIHwM9Ov/3tNdjv4O\nRkSN2NIvMc9A4+ONBRXxMeIydibyRa2fJRiuh61aFUb86gGpSvtc30mgJEdmX71v\nlDvU9lDtE86nE5yrG15iJvatZz8HfgjqIIoawpLU4Yz/j69tXhElsFWw/FG9/g7L\neI9UHsodACG2CnsWvoOVniQ=\n-----END PRIVATE KEY-----\n"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dh7asuhkg
CLOUDINARY_API_KEY=141884651142421
CLOUDINARY_API_SECRET=AjRmclKKHMe3-GNRI_PCUEv7ezc
```

#### Step 2: Deploy
1. Push your code to GitHub
2. Connect to Vercel
3. Deploy
4. Update `NEXTAUTH_URL` with your actual Vercel domain

#### Step 3: Test Deployment
1. Visit `https://your-domain.vercel.app/api/env-check`
2. Verify all environment variables show `true`
3. Test upload at `/admin/media`

### 3. Troubleshooting

#### Upload Still Failing?
1. Check browser console for errors
2. Check `/api/env-check` endpoint
3. Verify Cloudinary credentials are correct
4. Check Vercel function logs

#### Deployment Issues?
1. Ensure all environment variables are set in Vercel
2. Check build logs for errors
3. Verify Firebase configuration
4. Test locally first

### 4. What Was Fixed

1. **Simplified upload API**: Removed complex fallback logic
2. **Better error handling**: Clear error messages for missing env vars
3. **Environment validation**: New `/api/env-check` endpoint
4. **Vercel configuration**: Added `vercel.json` for proper deployment
5. **Image domains**: Added Firebase storage domain to next.config.js
6. **Environment variables**: Fixed NEXTAUTH_URL for local development

### 5. Testing Checklist

- [ ] Local upload works
- [ ] Environment check passes
- [ ] Build completes without errors
- [ ] Deployment succeeds
- [ ] Production upload works
- [ ] Images display correctly

The upload functionality should now work both locally and in production!