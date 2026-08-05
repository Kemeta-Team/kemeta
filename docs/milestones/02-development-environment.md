# Milestone 02 — Development Environment & Containerization

> **Version:** 1.0
> **Status:** Not Started
> **Estimated Duration:** 1–2 Weeks

---

# Mission

Create a standardized, reproducible, and scalable local development environment where every team member can run the project with minimal setup and identical configurations.

This milestone focuses on containerizing the backend application and its dependencies to ensure consistency across development environments.

---

# Why This Milestone?

One of the most common challenges in software development is environment inconsistency.

Different operating systems, package versions, database configurations, or missing dependencies often lead to unexpected issues.

Containerization eliminates these problems by ensuring that every developer works inside the same environment.

This milestone also prepares the project for future CI/CD pipelines and cloud deployment.

---

# Learning Objectives

By the end of this milestone, every team member should understand:

* Docker fundamentals and container lifecycle
* Images vs Containers
* Dockerfile best practices
* Multi-stage Docker builds
* Docker networking
* Docker volumes
* Docker Compose architecture
* Environment variables inside containers
* Containerized PostgreSQL
* Containerized Redis
* Health checks
* Service dependencies
* Development vs Production containers
* Persistent data management
* Building reproducible development environments

---

# Engineering Goals

During this milestone, the team should aim to:

* Standardize the development environment.
* Eliminate machine-specific configurations.
* Containerize all required services.
* Keep Docker images lightweight.
* Separate development and production configurations.
* Improve onboarding for future contributors.
* Prepare the project for deployment automation.

---

# Technologies

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| Docker                | Application Containerization  |
| Docker Compose        | Multi-container orchestration |
| PostgreSQL            | Database Container            |
| Redis                 | Cache Container               |
| NestJS                | Backend Service               |
| Environment Variables | Configuration Management      |

**Not included in this milestone**

* AWS Deployment
* GitHub Actions
* CI/CD Pipeline
* Monitoring
* Production Infrastructure

These topics will be introduced in future milestones.

---

# Deliverables

At the end of this milestone, the project should include:

* Dockerfile for the backend application
* Docker Compose configuration
* PostgreSQL container
* Redis container
* Shared Docker network
* Persistent database volumes
* Environment configuration for containers
* Development startup documentation

---

# Engineering Tasks

During this milestone the team should:

* Create the backend Dockerfile.
* Configure Docker Compose.
* Containerize PostgreSQL.
* Containerize Redis.
* Configure networking between services.
* Configure persistent volumes.
* Configure environment variables.
* Validate application startup inside Docker.
* Document local development setup.
* Ensure identical environments across all developers.

---

# Definition of Done

This milestone is considered complete when:

* The backend runs successfully inside Docker.
* PostgreSQL is fully containerized.
* Redis is fully containerized.
* All services communicate correctly.
* Persistent storage works correctly.
* The application starts using Docker Compose.
* Every developer can run the project using the documented setup.

---

# Quality Checklist

Before closing this milestone, verify that:

* Docker images build successfully.
* Docker Compose starts all required services.
* No hardcoded container configuration exists.
* Environment variables are externalized.
* Database persistence survives container recreation.
* Containers restart correctly.
* Startup instructions are documented.
* Development setup is reproducible.

---

# Acceptance Criteria

The milestone will be accepted when:

* A new developer can clone the repository.
* The project starts successfully using Docker Compose.
* Backend, PostgreSQL, and Redis communicate correctly.
* No manual database installation is required.
* Local environments are consistent across all team members.

---

# Common Mistakes

Avoid the following:

* Using a single container for all services.
* Hardcoding secrets inside Docker images.
* Ignoring `.dockerignore`.
* Running development and production using identical Dockerfiles.
* Storing persistent data inside containers instead of volumes.
* Using unnecessary large base images.

---

# Recommended Resources

* Official Docker Documentation
* Docker Compose Documentation
* NestJS Docker Guide
* PostgreSQL Docker Image Documentation
* Redis Docker Image Documentation

---

# Notes

This is a Living Document.

The containerization strategy may evolve as the project grows.

Future improvements may include multi-stage builds, image optimization, production Compose files, and orchestration using Kubernetes.

---

# Next Milestone

**Milestone 03 — Code Quality & Automation**

Focus Areas:

* ESLint & Prettier
* Husky
* lint-staged
* Conventional Commits
* Git Hooks
* GitHub Actions
* Automated Testing
* Build Validation
