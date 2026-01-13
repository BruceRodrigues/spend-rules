# Spend Rules

A full-stack application for analyzing credit card expenses by automatically categorizing purchases.

## Getting Started

This is a Next.js project using Bun as the package manager and runtime.

### Prerequisites

- Bun installed on your system
- PostgreSQL database (local or remote)

### Installation

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spend_rules?schema=public"

# NextAuth.js
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. Set up the database:

```bash
# Generate Prisma Client
bun run db:generate

# Run migrations
bun run db:migrate
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Code Quality

- Lint: `bun run lint`
- Format: `bun run format`
- Lint and fix: `bun run lint:fix`
