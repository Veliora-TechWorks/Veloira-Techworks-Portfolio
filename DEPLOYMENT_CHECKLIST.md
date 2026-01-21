# Image Upload Deployment Checklist

## Pre-Deployment Verification

### 1. Environment Variables
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- [ ] `CLOUDINARY_API_KEY` is set  
- [ ] `CLOUDINARY_API_SECRET` is set
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY` is properly formatted
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL` is set
- [ ] `FIREBASE_ADMIN_PROJECT_ID` matches Firebase project

### 2. API Routes
- [ ] `/api/upload` handles multiple files
- [ ] `/api/media` returns media list
- [ ] Document size validation (900KB limit)
- [ ] Error handling for failed uploads

### 3. Firebase Configuration
- [ ] Firebase Admin SDK initialized
- [ ] Firestore rules allow admin access
- [ ] Media collection exists and accessible

### 4. Cloudinary Setup
- [ ] Cloudinary account active
- [ ] Upload folder configured (`veliora-techworks`)
- [ ] API credentials valid

## Post-Deployment Testing

### Automated Tests
Visit `/test` page and run automated tests:
- Environment variables check
- Upload API endpoint test
- Firebase connection test

### Manual Testing
1. **Admin Media Page** (`/admin/media`)
   - Select category (not "all")
   - Upload single image
   - Upload multiple images
   - Verify images appear in gallery
   - Test drag & drop functionality

2. **Project Creation** (`/admin/projects`)
   - Create new project
   - Upload project images
   - Verify images save as Cloudinary URLs (not base64)
   - Check document size stays under 1MB

3. **Image Display**
   - Visit project detail pages
   - Verify images load correctly
   - Test image modal functionality
   - Check responsive behavior

### Error Scenarios
- [ ] Large file upload (>10MB)
- [ ] Invalid file types
- [ ] Network timeout
- [ ] Cloudinary quota exceeded
- [ ] Firebase permission errors

## Troubleshooting

### Common Issues
1. **Environment Variables**: Check Vercel/hosting platform env vars
2. **CORS Errors**: Verify API routes are properly configured
3. **Firebase Errors**: Check service account permissions
4. **Cloudinary Errors**: Verify API credentials and quotas
5. **Document Size**: Ensure using URLs not base64 data

### Debug Steps
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check server logs for API errors
4. Test with smaller files first
5. Verify Firebase/Cloudinary dashboards

## Success Criteria
- [ ] Multiple image upload works
- [ ] Images stored in Cloudinary
- [ ] URLs saved in Firebase (not base64)
- [ ] No document size limit errors
- [ ] Images display correctly on frontend
- [ ] Modal functionality works
- [ ] Responsive design maintained