# Team Check-in System - Backend

A secure Node.js/Express backend for managing team check-ins with JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   # Copy the example environment file
   cp ../.env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

3. **Development:**
   ```bash
   # Start development server with hot reload
   npm run dev
   
   # Start auth server (in separate terminal)
   npm run auth
   ```

4. **Production:**
   ```bash
   # Build the project
   npm run build
   
   # Start production server
   npm start
   ```

## 📁 Project Structure

```
src/
├── auth/           # Authentication service
│   ├── config.ts   # Auth configuration
│   ├── keys.ts     # JWT key management
│   ├── server.ts   # Auth server
│   └── types.ts    # Auth type definitions
├── middlewares/    # Express middlewares
│   ├── auth.ts     # JWT authentication middleware
│   ├── errorHandler.ts
│   └── validateRequest.ts
├── models/         # Data models (in-memory)
│   ├── checkin.ts
│   └── response.ts
├── routers/        # API route handlers
│   ├── checkins.ts # Check-in management
│   ├── reports.ts  # Reporting endpoints
│   └── responses.ts # Response management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── validators/     # Request validation schemas
```

## 🔐 Authentication

The system uses JWT tokens with RS256 signing. Two user roles are supported:

- **Manager**: Can create check-ins and view all responses
- **Member**: Can submit responses and view their own responses

### Auth Endpoints

- `POST /signup` - Register a new user
- `POST /login` - Authenticate and receive JWT token
- `GET /.well-known/jwks.json` - Public key for token verification

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

## 📡 API Endpoints

### Health Check
- `GET /health` - Service health status

### Check-ins (Manager only)
- `POST /checkins` - Create a new check-in
- `GET /checkins` - List all check-ins

### Responses (Member only)
- `POST /responses` - Submit a response to a check-in
- `GET /responses/me` - View your own responses

### Reports (Manager only)
- `GET /reports/checkin/:checkInId` - Get responses for a specific check-in
- `GET /reports/checkin/user/:userId` - Get all responses by a user
- `GET /reports/summary` - Get summary of all check-ins and responses

## ⚠️ Important Notes

### Data Persistence
**Current implementation uses in-memory storage.** All data (users, check-ins, responses) will be lost when the server restarts.

### Key Management
RSA keys are generated on server startup. In production, use persistent key storage or a key management service.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run auth` - Start standalone auth server
