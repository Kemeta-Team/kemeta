# Backend Coding Standards

> **Version:** 1.0
> **Status:** Living Document
> **Last Updated:** August 2026

---

# Purpose

This document defines the engineering standards that every team member must follow while contributing to the backend project.

The primary goal is **consistency**, **maintainability**, **readability**, and **scalability**.

These standards are not intended to limit developers. Instead, they provide a shared engineering foundation that allows the team to write code that is easy to understand, review, maintain, and extend.

This document is considered a **Living Document**.

As the project grows, new standards may be introduced, existing standards may evolve, and outdated practices may be removed. Every architectural decision and coding convention should reflect the current needs of the project.

---

# General Engineering Principles

Every contribution to the project should follow these core principles.

## Readability over Cleverness

Code is read far more often than it is written.

Always prioritize writing code that is easy to understand over writing code that is short or clever.

---

## Consistency over Personal Preference

The project belongs to the team, not to an individual developer.

Follow the project's conventions even if your personal coding style is different.

---

## Simplicity over Unnecessary Abstraction

Avoid introducing abstractions unless they solve an actual problem.

Prefer straightforward solutions before adding additional layers of complexity.

---

## Single Responsibility

Every class, function, and module should have a single clear responsibility.

Avoid mixing unrelated concerns inside the same component.

---

## Business Logic Belongs in Services

Controllers should coordinate requests.

Services should contain business logic.

Repositories (or Prisma) should manage database operations.

Each layer has one responsibility.

---

## Avoid Code Duplication

Duplicated logic creates maintenance problems.

Whenever business logic is reused in multiple places, consider extracting it into a reusable component.

---

## Write Small Functions

Functions should perform one task only.

If a function becomes difficult to understand, consider splitting it into smaller functions.

---

## Explicit is Better than Implicit

Avoid hidden behaviors.

Prefer descriptive names and explicit logic over shortcuts that reduce readability.

---

# Project Structure Standards

Every feature module should follow the same project structure whenever possible.

Example:

```text
auth/
│
├── dto/
├── guards/
├── strategies/
├── auth.controller.ts
├── auth.service.ts
└── auth.module.ts
```

Maintaining a consistent structure makes navigation easier for every developer.

---

# Naming Conventions

## Classes

Use PascalCase.

Example:

```ts
UserService
TripController
AuthGuard
```

---

## Interfaces

Use PascalCase with the `I` prefix only if the project adopts that convention consistently.

Example:

```ts
IUserRepository
```

---

## DTOs

Every DTO should clearly describe its purpose.

Examples:

```ts
CreateTripDto
UpdateProfileDto
LoginDto
```

---

## Enums

Enum names should be singular and descriptive.

Example:

```ts
UserRole
TripStatus
BookingStatus
```

---

## Functions

Function names should clearly describe what they do.

Examples:

```ts
createTrip()
findUserByEmail()
updateProfile()
deleteActivity()
```

Avoid ambiguous names like:

```ts
process()
handle()
execute()
run()
```

unless their responsibility is obvious.

---

## Boolean Variables

Boolean variables should read naturally.

Examples:

```ts
isActive
isVerified
hasPermission
canEdit
```

---

# Module Standards

Each module should be responsible for one business domain.

Modules should communicate through services rather than accessing each other's internal implementation directly.

Avoid creating large modules that contain unrelated responsibilities.

---

# Controller Standards

Controllers are responsible for:

* Receiving requests.
* Validating incoming data.
* Calling services.
* Returning responses.

Controllers **must not** contain business logic.

Business rules belong inside services.

---

# Service Standards

Services contain the application's business logic.

Services should:

* remain framework-independent whenever possible;
* avoid direct HTTP concerns;
* avoid handling Request or Response objects;
* focus on one business responsibility.

---

# DTO Standards

Every request entering the application must use a DTO.

DTOs must:

* validate incoming data;
* define request contracts;
* remain simple data structures.

Avoid using `any` inside DTOs.

---

# Database Standards

Database access should remain consistent across the project.

General rules:

* Use Prisma Migrations.
* Avoid manual schema changes.
* Prefer UUID identifiers.
* Create indexes when necessary.
* Use transactions for multi-step operations.

---

# Authentication & Authorization Standards

Authentication should be handled through Guards.

Authorization should be implemented using Roles and custom decorators when applicable.

Controllers should never manually verify JWT tokens.

---

# API Design Standards

REST endpoints should use resource-based naming.

Preferred:

```text
GET    /users
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

Avoid action-based endpoint names whenever possible.

Every endpoint should return appropriate HTTP status codes.

---

# Validation Standards

Every public endpoint must validate incoming data.

Use `class-validator` decorators.

Validation should happen before business logic executes.

---

# Error Handling Standards

Errors should be predictable and consistent.

Prefer NestJS Exceptions instead of generic JavaScript errors.

Error messages should be meaningful without exposing internal implementation details.

---

# Logging Standards

Log important business events.

Examples:

* Authentication events
* Background jobs
* External service failures
* Unexpected exceptions

Never log:

* Passwords
* JWT tokens
* Secrets
* Sensitive personal information

---

# Configuration Standards

Application configuration should be centralized.

Prefer using `ConfigService` instead of accessing environment variables throughout the codebase.

Never hardcode secrets or credentials.

---

# Testing Standards

Testing should focus primarily on business logic.

Prefer testing:

* Services
* Utility functions
* Business rules

Controllers usually require minimal testing.

---

# Pull Request Checklist

Every Pull Request should satisfy the following requirements before being merged.

* Project builds successfully.
* No TypeScript errors.
* No ESLint errors.
* No unnecessary commented code.
* No debugging statements.
* Proper validation exists.
* Business logic is inside services.
* Naming conventions are respected.
* Swagger documentation is updated when necessary.
* Database migrations are included when schema changes occur.
* Code has been reviewed by at least one team member.

---

# Continuous Improvement

These standards are expected to evolve throughout the project's lifecycle.

If a rule no longer serves the project or a better practice is identified, the team should discuss it during code review and update this document accordingly.

Engineering standards are not static.

They improve as the team gains experience.
