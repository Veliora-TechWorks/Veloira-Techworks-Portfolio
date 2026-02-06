# Firestore Index Deployment

## Important: Deploy Indexes for Optimal Performance

After deployment, you MUST deploy the Firestore indexes to ensure fast article fetching.

### Option 1: Automatic Deployment (Recommended)
```bash
firebase deploy --only firestore:indexes
```

### Option 2: Manual Creation
Go to Firebase Console → Firestore Database → Indexes and create:

**Composite Index for Posts:**
- Collection: `posts`
- Fields:
  - `isPublished` (Ascending)
  - `createdAt` (Descending)
- Query Scope: Collection

### Verify Index Status
1. Go to Firebase Console
2. Navigate to Firestore Database → Indexes
3. Ensure the index status is "Enabled" (not "Building")

### Performance Impact
- **Without Index**: 2-5 seconds query time
- **With Index**: 100-300ms query time

## Additional Optimizations Applied

1. **API Caching**: 5-minute cache with stale-while-revalidate
2. **Query Optimization**: Direct Firestore filtering instead of client-side
3. **Data Limiting**: Max 50 posts per request
4. **Field Selection**: Only necessary fields returned
5. **Client Memoization**: useMemo for filtered results
