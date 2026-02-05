# BackEndSkills.md

## Overview
This skill provides comprehensive backend development guidance for production-ready applications. Use this when building APIs, databases, server infrastructure, authentication systems, or any server-side logic.

## When to Use This Skill
- Building REST APIs, GraphQL APIs, or WebSocket servers
- Implementing authentication and authorization systems
- Designing database schemas and data models
- Setting up server infrastructure and deployment pipelines
- Creating backend services for mobile or web applications
- Implementing real-time features, background jobs, or microservices
- Any task involving server-side programming, data persistence, or business logic

## Core Principles

### 1. Production-Ready Mindset
Always write backend code with production deployment in mind:
- **Security first**: Never hardcode credentials, always validate inputs, use HTTPS
- **Scalability**: Design for growth (caching, load balancing, database indexing)
- **Observability**: Include logging, monitoring, and error tracking from the start
- **Resilience**: Handle failures gracefully with retries, circuit breakers, and fallbacks
- **Documentation**: API docs, README files, and inline comments for complex logic

### 2. Technology Selection
Choose technologies based on project requirements:
- **Node.js/Express**: Fast prototyping, JavaScript ecosystem, real-time apps
- **Python/FastAPI or Flask**: Data science integration, rapid development, type safety
- **Go**: High performance, concurrent systems, microservices
- **PostgreSQL**: Complex queries, ACID compliance, relational data
- **MongoDB**: Flexible schemas, document storage, rapid iteration
- **Redis**: Caching, sessions, real-time features, pub/sub

## Project Structure

### Standard Backend Architecture
```
project-root/
├── src/
│   ├── api/              # API routes and controllers
│   │   ├── routes/       # Route definitions
│   │   ├── controllers/  # Request handlers
│   │   └── middlewares/  # Custom middleware
│   ├── models/           # Database models/schemas
│   ├── services/         # Business logic layer
│   ├── utils/            # Helper functions
│   ├── config/           # Configuration files
│   └── db/               # Database connection and migrations
├── tests/                # Test files
├── scripts/              # Deployment and utility scripts
├── .env.example          # Environment variable template
├── .gitignore
├── package.json          # or requirements.txt for Python
└── README.md
```

## Essential Components

### 1. Authentication & Authorization

**JWT-based Authentication (Node.js Example)**
```javascript
// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

**Key Security Practices**:
- Hash passwords with bcrypt (cost factor: 10-12)
- Use environment variables for secrets
- Implement rate limiting (express-rate-limit)
- Add CORS configuration
- Validate and sanitize all inputs
- Use helmet.js for security headers

### 2. Database Design

**Schema Design Principles**:
- Normalize to 3NF for relational databases, denormalize strategically
- Use indexes on frequently queried fields
- Add timestamps (created_at, updated_at) to all tables
- Implement soft deletes when data retention is important
- Use foreign keys and constraints for data integrity

**Example PostgreSQL Schema (User & Posts)**:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### 3. API Design

**RESTful API Best Practices**:
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return appropriate status codes (200, 201, 400, 401, 403, 404, 500)
- Version your API (/api/v1/...)
- Use plural nouns for resources (/users, /posts)
- Implement pagination for list endpoints
- Return consistent error responses

**Example API Controller (Node.js/Express)**:
```javascript
// src/api/controllers/userController.js
const userService = require('../../services/userService');
const { validationResult } = require('express-validator');

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const result = await userService.getUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });
    
    res.json({
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
};

module.exports = { getUsers, createUser };
```

### 4. Input Validation

**Always validate incoming data**:
```javascript
// src/api/routes/userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('username').isAlphanumeric().isLength({ min: 3, max: 30 }),
    body('full_name').optional().trim().isLength({ max: 100 })
  ],
  userController.createUser
);

module.exports = router;
```

### 5. Error Handling

**Centralized Error Handler**:
```javascript
// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### 6. Environment Configuration

**Always use environment variables**:
```javascript
// src/config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  redis: {
    url: process.env.REDIS_URL
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET
  }
};
```

**.env.example**:
```
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

REDIS_URL=redis://localhost:6379

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

## Advanced Features

### 1. Caching with Redis
```javascript
// src/services/cacheService.js
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error);

const cacheService = {
  async get(key) {
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },
  
  async set(key, value, ttl = 3600) {
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },
  
  async delete(key) {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
};

module.exports = cacheService;
```

### 2. File Upload Handling
```javascript
// Using multer + AWS S3
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../config/config');

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

const uploadToS3 = async (file) => {
  const key = `uploads/${Date.now()}-${file.originalname}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }));
  
  return `https://${config.aws.s3Bucket}.s3.amazonaws.com/${key}`;
};

module.exports = { upload, uploadToS3 };
```

### 3. Background Jobs
```javascript
// Using Bull queue
const Queue = require('bull');
const emailQueue = new Queue('email', process.env.REDIS_URL);

// Producer
const sendWelcomeEmail = async (userId) => {
  await emailQueue.add('welcome', { userId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
};

// Consumer
emailQueue.process('welcome', async (job) => {
  const { userId } = job.data;
  // Send email logic here
  console.log(`Sending welcome email to user ${userId}`);
});

module.exports = { sendWelcomeEmail };
```

## Testing

### Unit Tests Example (Jest)
```javascript
// tests/services/userService.test.js
const userService = require('../../src/services/userService');
const userModel = require('../../src/models/userModel');

jest.mock('../../src/models/userModel');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      };
      
      const mockUser = { id: 1, ...userData };
      userModel.create.mockResolvedValue(mockUser);
      
      const result = await userService.createUser(userData);
      
      expect(result).toEqual(mockUser);
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          username: userData.username
        })
      );
    });
  });
});
```

## Deployment Checklist

### Pre-Production Requirements
- [ ] Environment variables properly configured
- [ ] Database migrations tested
- [ ] All secrets rotated and secured
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Error logging set up (Sentry, LogRocket)
- [ ] Health check endpoint (/health)
- [ ] Database backups configured
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] API documentation published
- [ ] Monitoring and alerts configured

### Production Server Setup (Node.js)
```javascript
// src/server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', require('./api/routes'));

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});

module.exports = app;
```

## Common Patterns

### Pagination Helper
```javascript
const paginate = (page, limit) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

const buildPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};
```

### API Response Wrapper
```javascript
const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

const errorResponse = (error, message = 'Error') => ({
  success: false,
  message,
  error
});
```

## Documentation Template

### API Documentation (Markdown)
```markdown
# API Documentation

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### POST /api/v1/users
Create a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "johndoe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Errors:**
- 400: Validation error
- 409: Email already exists
- 500: Server error
```

## Final Checklist

When building a backend system, ensure you have:

1. **Security**: Authentication, authorization, input validation, HTTPS
2. **Scalability**: Caching, indexing, connection pooling
3. **Reliability**: Error handling, logging, monitoring, backups
4. **Performance**: Query optimization, caching strategies, load testing
5. **Maintainability**: Clear code structure, documentation, testing
6. **Observability**: Logging, metrics, tracing, alerts

---

**Remember**: Production backends must be secure, scalable, and observable. Never compromise on security or data integrity. Always test thoroughly before deployment.