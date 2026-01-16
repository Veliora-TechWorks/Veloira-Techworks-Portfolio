# Supabase Database Setup Guide

This guide will walk you through setting up a free PostgreSQL database on Supabase for your Veliora TechWorks Portfolio.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub account (recommended - fastest)
   - OR Email and password
4. Verify your email if you signed up with email

## Step 2: Create a New Project

1. After logging in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `veliora-portfolio` (or any name you prefer)
   - **Database Password**: Create a strong password and **SAVE IT** (you'll need this!)
     - Example: `VelioraDB@2025!Secure`
     - **IMPORTANT**: Write this down somewhere safe!
   - **Region**: Choose the closest region to your users
     - For India: Select **"Southeast Asia (Singapore)"** or **"Mumbai"**
     - For US: Select **"East US"** or **"West US"**
   - **Pricing Plan**: Select **"Free"** (includes 500MB database, perfect for starting)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the database to be provisioned

## Step 3: Get Your Database Connection String

1. Once your project is ready, click on your project
2. Look at the left sidebar and click on **"Project Settings"** (gear icon at bottom)
3. In the Project Settings menu, look for **"Database"** option
   - If you see it, click on it
   - If you DON'T see it, click on **"Configuration"** or look in the main dashboard
4. **ALTERNATIVE PATH**: Go back to main dashboard (click project name at top)
   - Click on **"Connect"** button (usually at top right)
   - Select **"Connection String"**
   - Choose **"URI"** format
5. You'll see a connection string like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 2
7. Copy the complete connection string

### Example Connection String:
```
postgresql://postgres:VelioraDB@2025!Secure@db.abcdefghijklmnop.supabase.co:5432/postgres
```

### Can't Find Connection String?

**Method 1: From Dashboard**
1. Go to your project dashboard (main page after selecting project)
2. Look for **"Connect"** button at the top
3. Click it and select **"Connection String"** → **"URI"**

**Method 2: From Settings**
1. Click **"Project Settings"** (gear icon)
2. Look through these sections: **"General"**, **"Compute and Disk"**, or **"Infrastructure"**
3. Find the connection details section

**Method 3: Manual Construction**
If you can't find it, you can build it manually:
```
postgresql://postgres:[YOUR-DB-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```
- Find your project reference in the URL: `https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]`
- Replace `[YOUR-DB-PASSWORD]` with your database password
- Replace `[YOUR-PROJECT-REF]` with your project reference

## Step 4: Add to Vercel Environment Variables

1. Go to [https://vercel.com](https://vercel.com) and log in
2. Select your **"Veliora TechWorks Portfolio"** project
3. Click on **"Settings"** tab at the top
4. Click on **"Environment Variables"** in the left sidebar
5. Add the following environment variables one by one:

### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Your Supabase connection string (from Step 3)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

### Variable 2: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate a random secret:
  - Go to [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
  - Copy the generated string
  - OR use this command in terminal: `openssl rand -base64 32`
- **Environment**: Select all
- Click **"Save"**

### Variable 3: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Generate another random secret (same method as above)
- **Environment**: Select all
- Click **"Save"**

### Variable 4: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: Your Vercel deployment URL
  - Example: `https://veliora-portfolio.vercel.app`
  - Find this in your Vercel project dashboard under "Domains"
- **Environment**: Production only
- Click **"Save"**

### Variable 5: Cloudinary (Optional - for image uploads)
If you want image upload functionality:

- **Key**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- **Value**: `dh7asuhkg`
- Click **"Save"**

- **Key**: `CLOUDINARY_API_KEY`
- **Value**: `141884651142421`
- Click **"Save"**

- **Key**: `CLOUDINARY_API_SECRET`
- **Value**: `AjRmclKKHMe3-GNRI_PCUEv7ezc`
- Click **"Save"**

## Step 5: Redeploy Your Application

1. In Vercel, go to the **"Deployments"** tab
2. Click on the three dots (**...**) next to your latest deployment
3. Click **"Redeploy"**
4. Wait for the deployment to complete (2-3 minutes)

## Step 6: Verify Database Connection

1. Once deployed, visit your website: `https://your-app.vercel.app`
2. The site should load without errors
3. The database tables will be automatically created by Prisma

## Step 7: Create Admin User

You need to create an admin user to access the dashboard. You have two options:

### Option A: Using Supabase SQL Editor (Easiest)

1. Go back to your Supabase project
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy and paste this SQL:

```sql
-- Create admin user
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Admin',
  'velioratechworks@gmail.com',
  '$2a$10$YourHashedPasswordHere',
  'ADMIN',
  NOW(),
  NOW()
);
```

5. **IMPORTANT**: You need to hash your password first
   - Go to [https://bcrypt-generator.com/](https://bcrypt-generator.com/)
   - Enter your desired password (e.g., `Veliora@2025`)
   - Copy the generated hash
   - Replace `$2a$10$YourHashedPasswordHere` with your hash
6. Click **"Run"** to execute the query

### Option B: Using Prisma Studio (Alternative)

1. On your local machine, update your `.env` file with the Supabase connection string
2. Run: `npm run db:studio`
3. Create a new User record with:
   - Email: `velioratechworks@gmail.com`
   - Password: Use bcrypt hash from [https://bcrypt-generator.com/](https://bcrypt-generator.com/)
   - Role: `ADMIN`
   - Name: `Admin`

## Step 8: Access Admin Dashboard

1. Go to your deployed site: `https://your-app.vercel.app/admin/login`
2. Login with:
   - Email: `velioratechworks@gmail.com`
   - Password: The password you used (before hashing)
3. You should now have access to the admin dashboard!

## Troubleshooting

### Error: "Failed to connect to database"
- Double-check your DATABASE_URL in Vercel environment variables
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Verify the password doesn't contain special characters that need URL encoding

### Error: "Invalid credentials"
- Make sure you hashed the password correctly using bcrypt
- The bcrypt hash should start with `$2a$` or `$2b$`

### Site loads but shows "No projects yet"
- This is normal! Your database is empty
- Log in to the admin dashboard and start adding projects

## Database Limits (Free Plan)

- **Database Size**: 500 MB
- **Bandwidth**: 5 GB per month
- **API Requests**: Unlimited
- **Rows**: Up to 500,000

This is more than enough for a portfolio website!

## Need Help?

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Vercel Documentation: [https://vercel.com/docs](https://vercel.com/docs)
- Contact: velioratechworks@gmail.com

---

**Congratulations!** Your Veliora TechWorks Portfolio is now live with a production database! 🎉
