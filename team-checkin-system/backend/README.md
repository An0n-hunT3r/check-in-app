# Team Check-in System - Backend API

A Node.js + Express + TypeScript backend API for team check-ins with JWT authentication and DynamoDB storage.

## 🏗️ Architecture

- **Framework**: Node.js + Express + TypeScript
- **Authentication**: JWT with RS256 signing
- **Database**: DynamoDB (via LocalStack for local development)
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Structured JSON logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- LocalStack running (for DynamoDB)

### Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Development

```bash
# Start main API server (port 4000)
npm run dev

# Start auth server (port 3001) - in another terminal
npm run auth

# Initialize DynamoDB tables
npm run init-tables
```

### Testing

```bash
# Health check
curl http://localhost:4000/health

# JWKS endpoint
curl http://localhost:3001/.well-known/jwks.json
```

## 📚 API Documentation

### Authentication Endpoints (Port 3001)

**Signup**
```bash
POST /signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "manager" | "member"
}
```

**Login**
```bash
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**JWKS (Public Keys)**
```bash
GET /.well-known/jwks.json
```

### Main API Endpoints (Port 4000)

**Health Check**
```bash
GET /health
```

**Check-ins** (Manager only for POST, authenticated for GET)
```bash
POST /checkins
GET /checkins
Authorization: Bearer <token>
```

**Responses** (Member only for POST, own responses for GET)
```bash
POST /responses
GET /responses/me
Authorization: Bearer <token>
```

**Reports** (Manager only)
```bash
GET /reports/checkin/:checkInId
GET /reports/checkin/user/:userId
GET /reports/summary
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### CheckIns Table
```typescript
{
  id: string;           // Primary key (UUID)
  title: string;
  dueDate: string;      // ISO date string
  createdBy: string;    // Manager user ID
  createdAt: string;    // ISO timestamp
  questions: {
    id: string;         // UUID
    text: string;
  }[];
}
```

### Responses Table
```typescript
{
  id: string;           // Primary key (UUID)
  checkInId: string;    // Foreign key to CheckIns
  userId: string;       // User ID who submitted
  createdAt: string;    // ISO timestamp
  answers: {
    questionId: string; // References question.id
    answer: string;
  }[];
}
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication server
│   ├── server.ts        # Auth server main
│   ├── config.ts        # Auth-specific config
│   ├── keys.ts          # JWT key generation
│   └── types.ts         # Auth types
├── middlewares/         # Express middlewares
│   ├── auth.ts          # JWT verification
│   ├── validateRequest.ts # Zod validation
│   └── errorHandler.ts  # Global error handling
├── models/              # Data models
│   ├── checkin.ts       # CheckIn CRUD operations
│   └── response.ts      # Response CRUD operations
├── routers/             # API routes
│   ├── checkins.ts      # Check-in endpoints
│   ├── responses.ts     # Response endpoints
│   └── reports.ts       # Reporting endpoints
├── scripts/             # Utility scripts
│   └── init-tables.ts   # DynamoDB table setup
├── types/               # TypeScript types
│   ├── auth.ts          # Auth-related types
│   └── express.d.ts     # Express augmentation
├── utils/               # Utilities
│   └── logger.ts        # Structured logging
├── validators/          # Zod schemas
│   ├── checkinValidator.ts
│   ├── responseValidator.ts
│   └── authValidator.ts
├── config.ts            # Centralized configuration
└── main.ts              # Main application entry
```

## 🧪 Testing

### Manual Testing Flow

1. **Start Services**
   ```bash
   # Start development server with hot reload
   npm run dev
   
   # Start auth server (in separate terminal)
   npm run auth
   
   # Initialize Tables
   npm run init-tables
   ```

2. **Create Manager**
   ```bash
   curl -X POST http://localhost:3001/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"manager@test.com","password":"Manager123!","role":"manager"}'
   ```

3. **Login and Get Token**
   ```bash
   curl -X POST http://localhost:3001/login \
     -H "Content-Type: application/json" \
     -d '{"email":"manager@test.com","password":"Manager123!"}'
   ```

4. **Create Check-in**
   ```bash
   curl -X POST http://localhost:4000/checkins \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{
       "title": "Weekly Check-in",
       "dueDate": "2024-12-31T23:59:59Z",
       "questions": [{"text": "How was your week?"}]
     }'
   ```

5. **Create Member and Submit Response**
   ```bash
   # Create member
   curl -X POST http://localhost:3001/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"member@test.com","password":"Member123!","role":"member"}'
   
   # Login as member
   curl -X POST http://localhost:3001/login \
     -H "Content-Type: application/json" \
     -d '{"email":"member@test.com","password":"Member123!"}'
   
   # Submit response
   curl -X POST http://localhost:4000/responses \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <member-token>" \
     -d '{
       "checkInId": "<checkin-id>",
       "answers": [{"questionId": "<question-id>", "answer": "Great week!"}]
     }'
   ```

## 🐳 Docker Integration

The backend is designed to work with Docker and LocalStack:

```yaml
# docker-compose.yml (from project root)
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DYNAMO_ENDPOINT=http://localstack:4566
      - JWKS_URL=http://auth:3001/.well-known/jwks.json
```