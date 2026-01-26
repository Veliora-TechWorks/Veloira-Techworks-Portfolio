# Image Upload Fix for Production Deployment

## Issue
Image upload functionality works locally but fails after deployment in admin pages (posts, projects, media).

## Root Cause
Missing or incorrectly configured Cloudinary environment variables in the production environment.

## Solution

### 1. Verify Environment Variables in Production

Ensure these environment variables are set in your deployment platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dh7asuhkg
CLOUDINARY_API_KEY=141884651142421
CLOUDINARY_API_SECRET=AjRmclKKHMe3-GNRI_PCUEv7ezc
```

### 2. Update Next.js Configuration

The current next.config.js needs to include Cloudinary domain and environment variables:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'dh7asuhkg.cloudinary.com'],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
```

### 3. Add Environment Variable Validation

Create a validation API endpoint to check if environment variables are properly set.

### 4. Deployment Platform Specific Instructions

#### For Vercel:
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add the three Cloudinary variables
4. Redeploy the application

#### For Netlify:
1. Go to Site Settings → Environment Variables
2. Add the three Cloudinary variables
3. Trigger a new deployment

### 5. Test the Fix

After deployment:
1. Go to `/admin/media`
2. Try uploading an image
3. Check browser console for any errors
4. Verify the image appears in the media library

## Additional Debugging

If the issue persists, check:
1. Browser console for JavaScript errors
2. Network tab for failed API requests
3. Server logs for backend errors
4. Cloudinary dashboard for upload attempts

## Fallback Solution

If Cloudinary continues to fail, consider switching to:
1. Firebase Storage (already configured)
2. AWS S3
3. Direct file uploads to your server

The upload API route can be modified to use Firebase Storage instead of Cloudinary as a backup solution.