# Milestone 04 — Cloud Infrastructure & Deployment

> **Version:** 1.0
> **Status:** Not Started
> **Estimated Duration:** 2–3 Weeks

---

# Mission

Deploy the backend application to a real cloud environment and establish a reliable, secure, and maintainable production infrastructure.

This milestone transforms the project from a local development application into a publicly accessible production-ready service.

---

# Why This Milestone?

Modern backend development extends beyond writing APIs.

Engineers are expected to understand how applications are deployed, configured, monitored, and maintained in cloud environments.

This milestone introduces cloud infrastructure concepts while preparing the project for future CI/CD automation.

---

# Learning Objectives

By the end of this milestone, every team member should understand:

* AWS Core Services
* EC2 Fundamentals
* Amazon RDS
* Amazon S3
* Security Groups
* IAM Basics
* Linux Server Administration
* Nginx Reverse Proxy
* HTTPS Configuration
* Environment Variables in Production
* Process Management
* Basic Infrastructure Security
* Deployment Strategies

---

# Engineering Goals

During this milestone, the team should aim to:

* Deploy the backend successfully.
* Build a secure infrastructure.
* Separate infrastructure from application code.
* Protect sensitive configuration.
* Create a repeatable deployment process.
* Prepare the project for future automation.

---

# Technologies

| Technology    | Purpose              |
| ------------- | -------------------- |
| AWS EC2       | Application Hosting  |
| Amazon RDS    | Managed Database     |
| Amazon S3     | File Storage         |
| Ubuntu Server | Operating System     |
| Nginx         | Reverse Proxy        |
| PM2           | Process Management   |
| SSL/TLS       | Secure Communication |

**Not included in this milestone**

* Full CI/CD Pipeline
* Monitoring
* Kubernetes
* Auto Scaling
* Load Balancing

These topics will be introduced in later milestones.

---

# Deliverables

At the end of this milestone, the project should include:

* Running backend on AWS
* Production PostgreSQL database
* Production environment configuration
* Secure HTTPS endpoint
* Reverse proxy configuration
* File storage integration
* Deployment documentation

---

# Engineering Tasks

During this milestone the team should:

* Provision AWS infrastructure.
* Configure EC2.
* Configure RDS.
* Configure S3.
* Install and configure Nginx.
* Configure HTTPS.
* Deploy the backend.
* Configure production environment variables.
* Validate production deployment.
* Document deployment process.

---

# Definition of Done

This milestone is considered complete when:

* The backend is publicly accessible.
* HTTPS is configured correctly.
* Database connectivity is stable.
* File uploads work successfully.
* Environment variables are secured.
* Deployment steps are documented.
* The application remains stable after deployment.

---

# Quality Checklist

Before closing this milestone, verify that:

* Production secrets are protected.
* HTTPS is enforced.
* Nginx routes requests correctly.
* Server configuration is documented.
* Deployment is reproducible.
* Infrastructure follows security best practices.

---

# Acceptance Criteria

The milestone will be accepted when:

* Users can access the deployed backend.
* Production services communicate successfully.
* Deployment can be repeated with documented steps.
* The infrastructure supports future CI/CD integration.

---

# Common Mistakes

Avoid the following:

* Exposing secrets in repositories.
* Running applications as root.
* Skipping HTTPS.
* Hardcoding production configuration.
* Deploying without environment isolation.
* Ignoring server security updates.

---

# Recommended Resources

* AWS Documentation
* EC2 User Guide
* Amazon RDS Documentation
* Amazon S3 Documentation
* Nginx Documentation
* PM2 Documentation

---

# Notes

This is the project's first production deployment milestone.

Future milestones will automate deployment, improve scalability, and introduce monitoring, observability, and production optimization.

---

# Next Milestone

**Milestone 05 — CI/CD Pipeline**

Focus Areas:

* Deployment Automation
* GitHub Actions
* Docker Registry
* Automated Releases
* Zero-Downtime Deployment
* Deployment Verification