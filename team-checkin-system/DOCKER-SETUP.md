# Docker + LocalStack + DynamoDB Setup

## 🐳 Docker Services

This setup includes:
- **LocalStack**: AWS services emulation (DynamoDB, etc.)
- **Backend API**: Main application server
- **Auth Server**: JWT authentication service

## 🚀 Quick Start

### 1. Start All Services
```bash
docker-compose up -d
```

This will start:
- LocalStack on `http://localhost:4566`
- Backend API on `http://localhost:4000`
- Auth Server on `http://localhost:3001`

### 2. Initialize DynamoDB Tables
```bash
# Wait for LocalStack to be ready (about 30 seconds)
sleep 30

# Initialize tables
cd backend
npm run init-tables
```

### 3. Test the Setup
```bash
# Health check
curl http://localhost:4000/health

# JWKS endpoint
curl http://localhost:3001/.well-known/jwks.json
```

## 📋 Manual Setup Steps

### 1. Build and Start Services
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 2. Check Service Status
```bash
# View logs
docker-compose logs -f

# Check specific service
docker-compose logs backend
docker-compose logs localstack
```

### 3. Initialize DynamoDB Tables
```bash
# From backend directory
cd backend
npm run init-tables
```

## 🔧 Development Workflow

### Local Development (Recommended)
```bash
# Start only LocalStack
docker-compose up localstack -d

# Run backend locally
cd backend
npm run dev

# In another terminal, run auth server
cd backend
npm run auth

# Initialize tables
npm run init-tables
```

### Full Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up --build
```

## 🗄️ DynamoDB Operations

### View Tables
```bash
# List tables
aws --endpoint-url=http://localhost:4566 dynamodb list-tables

# Scan CheckIns table
aws --endpoint-url=http://localhost:4566 dynamodb scan --table-name CheckIns

# Scan Responses table
aws --endpoint-url=http://localhost:4566 dynamodb scan --table-name Responses
```

### Reset Data
```bash
# Delete and recreate tables
aws --endpoint-url=http://localhost:4566 dynamodb delete-table --table-name CheckIns
aws --endpoint-url=http://localhost:4566 dynamodb delete-table --table-name Responses

# Reinitialize
cd backend && npm run init-tables
```

## 🧪 Testing with Docker

### API Testing
```bash
# Create manager
curl -X POST http://localhost:3001/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"Manager123!","role":"manager"}'

# Login
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"Manager123!"}'

# Create check-in (use token from login)
curl -X POST http://localhost:4000/checkins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Weekly Check-in",
    "dueDate": "2024-12-31T23:59:59Z",
    "questions": [{"text": "How was your week?"}]
  }'
```

## 📊 Data Persistence

**Important**: LocalStack data is stored in `./localstack` directory and persists between container restarts.

To reset all data:
```bash
docker-compose down
rm -rf localstack/
docker-compose up -d
# Reinitialize tables
cd backend && npm run init-tables
```

## 🛑 Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove everything
docker-compose down --rmi all -v
```
