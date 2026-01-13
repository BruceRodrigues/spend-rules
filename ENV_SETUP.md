# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

## Required Variables

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spend_rules?schema=public"

# NextAuth.js Authentication
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

## Optional Variables (for OAuth)

```env
# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Generating AUTH_SECRET

You can generate a secure secret key using:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file
