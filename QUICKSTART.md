# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Access the Application
The application is now running at the preview URL provided by the platform.

### Step 2: Sign Up
1. Click "Get Started Free" on the landing page
2. Choose one of the following options:
   - **Email/Password**: Enter your name, email, and password (minimum 8 characters)
   - **Google Sign-In**: Click "Sign up with Google" (requires Google OAuth configuration)

### Step 3: Complete Your Profile
After signing up, you'll be redirected to the onboarding page:

1. **Select what you're looking for:**
   - Student — Looking for internship
   - Student — Looking for placement
   - Working professional — Looking for job change

2. **Choose your field:**
   - Tech
   - Non-tech
   - Core engineering
   - Other (specify custom field)

3. **Select roles/specializations** (multi-select):
   - Software Development, Data Science, Design, Marketing, etc.
   - Add custom roles as needed

4. **Set location preferences:**
   - Remote, Bangalore, Mumbai, Delhi, etc.
   - Add custom locations

5. **Select experience level:**
   - Fresher, 0-2 years, 2-5 years, 5+ years

6. **Enter contact email** for job applications

7. **Upload your resume** (PDF format only)

8. Click "Complete Profile"

### Step 4: Load Job Listings
1. You'll be redirected to your dashboard
2. Click the **"Sync Jobs"** button to fetch latest job listings from:
   - RemoteOK (remote tech jobs)
   - Arbeitnow (European jobs)
   - Adzuna (if API keys are configured)

### Step 5: Apply to Jobs
1. Browse the job listings on your dashboard
2. Click **"Apply"** on any interesting position
3. Review the auto-generated application email
4. Edit the email if needed
5. Click **"Open Application Page"** to apply directly on the company's website

## 🔑 Optional Configuration

### Enable Google Sign-In
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret
8. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
9. Restart the application

### Enable Adzuna Job API
1. Sign up at [Adzuna Developer](https://developer.adzuna.com/)
2. Create an application to get API credentials
3. Add to `.env`:
   ```
   ADZUNA_APP_ID=your-app-id
   ADZUNA_APP_KEY=your-api-key
   ```
4. Sync jobs again to fetch from Adzuna

## 📋 Features Available

✅ **Working Now:**
- Email/password authentication
- Google OAuth (when configured)
- Comprehensive onboarding form
- Resume upload
- Job listing synchronization from multiple free APIs
- Personalized job recommendations
- Auto-generated application emails
- Application tracking

⏳ **Coming Soon:**
- LinkedIn OAuth
- Phone OTP authentication
- Gmail API integration for auto-sending emails
- User-posted job opportunities
- Advanced filtering
- Email notifications

## 🎯 Tips for Best Results

1. **Complete your profile thoroughly** - The more details you provide, the better the job recommendations
2. **Upload a well-formatted PDF resume** - This will be used to generate personalized applications
3. **Sync jobs regularly** - New jobs are posted daily, sync to stay updated
4. **Customize application emails** - Review and edit the auto-generated text before applying
5. **Add multiple locations** - Increase your chances by being open to different locations

## 🔧 Troubleshooting

### "No job listings available"
- Click the "Sync Jobs" button to fetch listings
- Wait a few seconds for the APIs to respond
- Refresh the page

### "Failed to sign in with Google"
- Ensure Google OAuth is configured in `.env`
- Check that the redirect URI matches exactly
- Restart the development server after updating `.env`

### Resume upload fails
- Ensure the file is in PDF format
- File size should be reasonable (< 10MB)
- Check that the `public/uploads` directory exists and is writable

### Jobs don't match my profile
- The matching algorithm is basic in this version
- Filter by field is implemented
- Advanced matching will be added in future updates

## 📧 Support

For issues, questions, or feature requests:
1. Check the main README.md for detailed documentation
2. Review the database schema in `src/db/schema.ts`
3. Check the API routes in `src/app/api/`
4. Open an issue on GitHub (if applicable)

## 🎉 You're All Set!

Enjoy using the Career Platform. Happy job hunting! 🚀
