# Career Platform - Sign Up Once, Apply Everywhere

A comprehensive job application platform built with Next.js, PostgreSQL, and Better Auth that allows users to create a profile once and apply to multiple job listings with a single click.

## Features

### ✅ Implemented
- **Multi-Method Authentication**
  - Email/Password authentication
  - Google OAuth (requires configuration)
  - Session management with Better Auth
  
- **User Onboarding**
  - Comprehensive profile creation
  - Resume upload (PDF)
  - Job preferences (status, field, location, experience)
  - Role/specialization selection
  
- **Job Discovery Feed**
  - Integration with multiple job APIs:
    - Arbeitnow (free, no auth required)
    - RemoteOK (free, public API)
    - Adzuna (requires API key)
  - Smart filtering based on user profile
  - Real-time job syncing
  
- **Application System**
  - Auto-generated application emails
  - Customizable email templates
  - Application tracking
  - Direct link to job postings

### 🚧 Future Features (Not Yet Implemented)
- LinkedIn OAuth integration
- Phone OTP authentication
- Gmail API integration for auto-sending emails
- User-posted job opportunities
- Advanced matching algorithm
- Application status tracking
- Resume parsing and scoring

## Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **File Upload**: Local file system (can be upgraded to cloud storage)
- **Job APIs**: Arbeitnow, RemoteOK, Adzuna

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd career-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - For Google OAuth (optional)
- `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` - For Adzuna API (optional)

4. Push database schema
```bash
npx drizzle-kit push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

### For Users

1. **Sign Up**: Create an account using email or Google
2. **Onboarding**: Complete your profile with preferences and upload resume
3. **Dashboard**: View personalized job recommendations
4. **Sync Jobs**: Click "Sync Jobs" to fetch latest listings from APIs
5. **Apply**: Click "Apply" on any job to generate a personalized application

### For Administrators

**Sync Job Listings** (can be run as a cron job):
```bash
curl -H "Authorization: Bearer dev-secret-123" http://localhost:3000/api/sync-listings
```

## API Endpoints

- `POST /api/auth/[...all]` - Authentication endpoints (Better Auth)
- `POST /api/onboarding` - Save user profile
- `GET /api/profile` - Get user profile
- `GET /api/listings` - Get filtered job listings
- `GET /api/sync-listings` - Sync jobs from external APIs (requires auth token)

## Database Schema

### Users & Auth
- `users` - User accounts
- `sessions` - Active sessions
- `accounts` - OAuth provider accounts

### Application Data
- `profiles` - User profiles and preferences
- `listings` - Job listings from various sources
- `applications` - Application tracking
- `gmail_tokens` - Gmail OAuth tokens (for future use)

## Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### Job API Setup

**Adzuna** (optional):
1. Sign up at [Adzuna Developer](https://developer.adzuna.com/)
2. Get your App ID and API Key
3. Add to `.env`

**Arbeitnow & RemoteOK**:
- No configuration needed - free public APIs

## Development

### Type Checking
```bash
npm run typecheck
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Main dashboard
│   ├── signin/        # Sign in page
│   ├── signup/        # Sign up page
│   ├── onboarding/    # Profile creation
│   ├── apply/         # Application pages
│   └── page.tsx       # Landing page
├── db/
│   ├── index.ts       # Database connection
│   └── schema.ts      # Database schema
└── lib/
    ├── auth.ts        # Server-side auth
    └── auth-client.ts # Client-side auth
```

## Security Notes

- Passwords are hashed using bcrypt
- Sessions are securely managed by Better Auth
- File uploads are validated (PDF only)
- API endpoints are protected with authentication
- Environment variables for sensitive data

## Legal Compliance

This platform:
- Does NOT scrape LinkedIn, Naukri, Internshala, or Unstop
- Only uses legal, public APIs with proper attribution
- Stores user data securely with encryption at rest
- Provides users control over their data
- Follows GDPR/data protection best practices

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

- [ ] LinkedIn OAuth integration
- [ ] Phone OTP authentication
- [ ] Gmail API auto-send functionality
- [ ] User-posted job opportunities
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Application status tracking
- [ ] Resume builder
- [ ] Interview preparation resources
- [ ] Mobile app
