# 01-architecture.md

## Kemeta Backend Architecture

### 1. Purpose

This document is the official reference for the Kemeta backend architecture.

It defines:

* System structure
* Module boundaries
* Request lifecycle
* Dependency flow
* Shared components
* Backend conventions
* Future scalability direction

All contributors must follow the architecture described in this document when implementing new features or refactoring existing code.

---

## 2. System Overview

Kemeta follows a **Modular Monolith Architecture**.

The application is deployed as a single backend service, while the internal codebase is divided into independent feature modules with clear boundaries.

### High-Level Structure

```text
Frontend (React / Next.js)
          │
          ▼
      REST API
          │
          ▼
   NestJS Backend
          │
 ┌────────┴────────┐
 │                 │
 ▼                 ▼
Core Modules   Shared Components
          │
          ▼
      Prisma ORM
          │
          ▼
     PostgreSQL
```

---

## 3. Architectural Principles

The backend must follow these principles:

* **Modular** — each feature lives in its own module.
* **Single Responsibility** — each class has one clear purpose.
* **Dependency Injection** — services depend on abstractions, not implementations.
* **No Shared Business Logic** — duplicated logic must be extracted into shared services.
* **Controller Thinness** — controllers should only orchestrate requests and responses.
* **Database Access Through Prisma Only** — direct SQL queries are not allowed unless explicitly approved.

---

## 4. Project Structure

```text
src/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── trips/
│   ├── places/
│   ├── activities/
│   ├── packages/
│   ├── chatbot/
│   ├── ai/
│   └── notifications/
│
├── core/
│   ├── guards/
│   ├── decorators/
│   ├── interceptors/
│   ├── filters/
│   └── middleware/
│
├── common/
│   ├── dto/
│   ├── types/
│   ├── constants/
│   └── utils/
│
├── config/
├── prisma/
├── main.ts
└── app.module.ts
```

---

## 5. Module Boundaries

### Auth Module

Responsible for:

* Registration
* Login
* Refresh Tokens
* Logout
* Password Hashing
* JWT Generation

Auth must **not** contain user profile business logic.

---

### Users Module

Responsible for:

* User profile
* Update profile
* Language preferences
* Country information
* Avatar management
* Role retrieval

---

### Trips Module

Responsible for:

* Trip creation
* Trip timeline
* Trip status
* Budget management
* Trip activities association

---

### Places Module

Responsible for:

* Tourist attractions
* Categories
* Place metadata
* Coordinates
* Images
* Search and filtering

---

### Activities Module

Responsible for:

* Day activities
* Scheduling
* Ordering
* Completion status

---

## 6. Internal Layering

Every feature module follows the same internal structure.

```text
module/
│
├── controllers/
├── services/
├── dto/
├── entities/
├── repositories/
└── module.ts
```

### Dependency Direction

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma Service
    ↓
PostgreSQL
```

Rules:

* Controllers must not access Prisma directly.
* Services must not depend on Controllers.
* Repositories must contain only persistence logic.

---

## 7. Request Lifecycle

```text
HTTP Request
      ↓
Middleware
      ↓
Guards
      ↓
Interceptors (Before)
      ↓
Validation Pipes
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
Prisma
      ↓
PostgreSQL
      ↓
JSON Response
```

This flow must remain consistent across all modules.

---

## 8. Authentication & Authorization Flow

```text
Client
   ↓
/auth/login
   ↓
JWT Access Token
Refresh Token
   ↓
Protected Route
   ↓
JwtAuthGuard
   ↓
request.user
   ↓
RolesGuard
   ↓
Controller
```

### Important Convention

Authenticated user data must always be attached as:

```ts
request.user
```

Using `request.User` or any other naming is not allowed.

---

## 9. Shared Core Components

### Guards

* `JwtAuthGuard`
* `RolesGuard`

### Decorators

* `@Roles()`
* `@CurrentUser()` *(future)*

### Filters

* `GlobalExceptionFilter`

### Interceptors

* `ResponseTransformInterceptor`
* `LoggingInterceptor` *(future)*

---

## 10. API Response Convention

All successful responses should follow:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error responses should follow:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

This convention is mandatory for all new endpoints.

---

## 11. Database Conventions

### Primary Keys

* Use `uuid` for all primary keys.

### Status Fields

Use enums instead of raw strings.

Examples:

* `UserRole`
* `TripStatus`
* `BookingStatus`
* `ActivityStatus`

### Migrations

Only Prisma migrations are allowed:

```bash
npx prisma migrate dev
```

`prisma db push` must not be used for shared development environments.

---

## 12. Configuration Management

Environment variables must be accessed only through `ConfigService`.

Forbidden:

```ts
process.env.JWT_SECRET
```

Required:

```ts
this.configService.get<string>('JWT_SECRET')
```

---

## 13. Logging Strategy

For the current phase, use NestJS built-in `Logger`.

Logging levels:

* `log` — normal operations
* `warn` — unexpected but recoverable situations
* `error` — failures requiring investigation
* `debug` — development only

Sensitive data (passwords, tokens, secrets) must never be logged.

---

## 14. Documentation Requirements

Every module must provide:

* Swagger decorators
* DTO validation rules
* Example request body
* Example response body
* Error response examples

Undocumented endpoints are considered incomplete.

---

## 15. Future Infrastructure Direction

The architecture is designed to evolve in phases.

### Phase 1 — Local Development

* NestJS
* PostgreSQL
* Prisma

### Phase 2 — Containerization

* Docker
* Docker Compose
* Redis

### Phase 3 — Cloud Deployment

* AWS EC2
* AWS RDS
* AWS S3
* Nginx Reverse Proxy
* GitHub Actions CI/CD

The current architecture must remain compatible with these future phases.

---

## 16. Non-Negotiable Rules

The following rules are **mandatory**:

### ❌ Forbidden

* Business logic inside Controllers
* Direct Prisma access from Controllers
* Raw SQL without approval
* `any` in production code
* Accessing `process.env` outside configuration layer
* Returning inconsistent API responses
* Skipping DTO validation

### ✅ Required

* DTO validation
* Typed responses
* Service layer abstraction
* Repository separation
* Swagger documentation
* Prisma migrations
* Authentication guards for protected routes
* Consistent response structure

---

## 17. Definition of Architectural Compliance

A Pull Request is considered architecturally compliant only if:

* It respects module boundaries.
* It follows the defined dependency direction.
* It uses DTO validation.
* It does not introduce business logic into Controllers.
* It uses shared core components when applicable.
* It maintains the unified API response structure.
* It includes Swagger documentation.

Any Pull Request violating these rules must be rejected during code review.

---

## 18. Architecture Ownership

This document is a **living document**.

Any architectural change that affects module boundaries, request flow, shared components, database conventions, or deployment compatibility must be reviewed by the team before implementation and reflected in this document after approval.

---

**Document Version:** 1.0
**Status:** Active
**Last Updated:** August 2026
**Owners:** Kemeta Backend Team
