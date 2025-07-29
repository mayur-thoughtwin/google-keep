# Google Keep Clone - Backend

A NestJS backend application with Google OAuth2 authentication for a Google Keep clone.

## Features

- Google OAuth2 Authentication
- JWT Token-based Authorization
- GraphQL API with Apollo Server
- PostgreSQL Database with TypeORM
- User Management

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Google OAuth2 credentials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=google_keep

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL (for redirect after Google auth)
FRONTEND_URL=http://localhost:3001
```

### 3. Google OAuth2 Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URIs to: `http://localhost:3000/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

### 4. Database Setup

1. Create a PostgreSQL database named `google_keep`
2. Update the database credentials in your `.env` file
3. Run the application - TypeORM will automatically create the tables

### 5. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback (handles redirect)
- `GET /auth/profile` - Get current user profile (requires JWT token)

### GraphQL

- GraphQL Playground: `http://localhost:3000/graphql`

Available queries:
- `me` - Get current user profile (requires authentication)
- `users` - Get all users (requires authentication)

## Authentication Flow

1. User visits `/auth/google`
2. User is redirected to Google for authentication
3. After successful authentication, Google redirects to `/auth/google/callback`
4. The callback creates/updates the user and generates a JWT token
5. User is redirected to frontend with the JWT token
6. Frontend stores the token and uses it for authenticated requests

## Frontend Integration

To integrate with your frontend:

1. Redirect users to `http://localhost:3000/auth/google` for login
2. Handle the callback at `http://localhost:3001/auth/callback?token=<jwt_token>`
3. Store the JWT token (in localStorage, cookies, etc.)
4. Include the token in the Authorization header for API requests:
   ```
   Authorization: Bearer <jwt_token>
   ```

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.module.ts      # Auth module configuration
│   ├── auth.service.ts     # Auth business logic
│   ├── auth.controller.ts  # Auth REST endpoints
│   ├── google.strategy.ts  # Google OAuth strategy
│   ├── jwt.strategy.ts     # JWT strategy
│   ├── guards/             # Authentication guards
│   └── decorators/         # Custom decorators
├── entities/               # Database entities
│   └── user.entity.ts      # User entity
├── user/                   # User module
│   └── user.resolver.ts    # GraphQL user queries
├── db/                     # Database configuration
└── main.ts                 # Application entry point
```

## Security Notes

- Keep your JWT_SECRET secure and unique
- Never commit your `.env` file to version control
- Use HTTPS in production
- Consider implementing refresh tokens for better security
- Validate and sanitize all user inputs

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```