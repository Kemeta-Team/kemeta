# Git & GitHub Workflow

> **Version:** 1.0
> **Status:** Living Document
> **Last Updated:** August 2026

---

# Purpose

This document defines how our team collaborates using Git and GitHub throughout the project's lifecycle.

The objective is to establish a simple, consistent, and professional development workflow that minimizes merge conflicts, improves collaboration, and maintains a clean Git history.

This is a **Living Document**.

As the project grows, the workflow may evolve to accommodate new team members, CI/CD pipelines, release strategies, and deployment processes.

---

# Branch Strategy

Our repository follows a simple branching strategy designed for small teams while remaining scalable for future growth.

```text
main
│
└── develop
      │
      ├── feature/auth
      ├── feature/trips
      ├── feature/places
      ├── feature/docker
      └── feature/aws
```

## main

* Stable branch.
* Should always be deployable.
* Direct commits are not allowed.
* Only receives tested and reviewed code.

---

## develop

* Main development branch.
* All completed features are merged into this branch.
* Developers should always create feature branches from `develop`.

---

## feature/*

Feature branches are temporary branches created for a single feature or task.

Each feature branch should focus on one specific objective.

Examples:

```text
feature/auth
feature/user-profile
feature/trips
feature/aws-s3
feature/docker
```

After a feature is merged, the branch should be deleted.

---

# Branch Naming Convention

Use meaningful branch names that clearly describe the purpose of the work.

Recommended prefixes:

```text
feature/
bugfix/
refactor/
docs/
test/
chore/
```

Examples:

```text
feature/auth
feature/trip-planner
bugfix/login-validation
refactor/auth-service
docs/coding-standards
```

---

# Development Workflow

The standard workflow for every feature is:

```text
1. Checkout develop

↓

2. Pull latest changes

↓

3. Create a new feature branch

↓

4. Implement the feature

↓

5. Commit changes

↓

6. Push feature branch

↓

7. Open a Pull Request

↓

8. Code Review

↓

9. Apply requested changes (if needed)

↓

10. Merge into develop

↓

11. Delete the feature branch
```

Developers should regularly pull the latest changes from `develop` to reduce merge conflicts.

---

# Commit Message Convention

This project follows the Conventional Commits specification.

Examples:

```text
feat(auth): implement register endpoint

fix(users): resolve duplicate email validation

docs: update architecture documentation

refactor(auth): simplify JWT validation

test(auth): add authentication unit tests

chore: update dependencies
```

Commit messages should be:

* Short
* Descriptive
* Focused on one logical change

Avoid commit messages like:

```text
update

fix

test

final

last update
```

---

# Pull Request Workflow

A Pull Request (PR) is the process of requesting to merge a completed feature into the development branch.

Every completed feature should be submitted through a Pull Request.

The general workflow is:

```text
Feature Branch

↓

Push to GitHub

↓

Open Pull Request

↓

Code Review

↓

Apply Feedback

↓

Approval

↓

Merge into develop

↓

Delete Feature Branch
```

A Pull Request is not only for merging code.

It is also an opportunity to:

* Discuss implementation details.
* Improve code quality.
* Detect bugs.
* Share knowledge across the team.
* Maintain consistent engineering standards.

---

# Code Review Guidelines

Every Pull Request should be reviewed before merging.

During review, consider the following:

* Architecture
* Readability
* Naming conventions
* Business logic placement
* Validation
* Error handling
* Security
* Performance
* Code duplication
* API design
* Documentation updates

Reviews should focus on improving the code, not criticizing the developer.

Constructive feedback is encouraged.

---

# Merge Strategy

The merge strategy may evolve as the project grows.

For the current stage of the project:

* Merge completed and reviewed features into `develop`.
* Keep feature branches short-lived.
* Delete merged feature branches.
* Prefer small Pull Requests over large ones.

Future versions of this document may define a specific merge strategy such as Squash Merge or Rebase Merge.

---

# Conflict Resolution

Merge conflicts are a normal part of collaborative development.

To reduce conflicts:

* Pull frequently from `develop`.
* Keep feature branches small.
* Merge completed work regularly.
* Communicate with teammates before modifying shared files.

If conflicts occur:

1. Pull the latest changes.
2. Resolve the conflict carefully.
3. Test the application.
4. Push the updated branch.
5. Continue the Pull Request process.

---

# Git Best Practices

* Keep feature branches small.
* Commit frequently.
* Write meaningful commit messages.
* Pull changes regularly.
* Review code before merging.
* Delete merged feature branches.
* Keep the repository clean.
* Prefer multiple small Pull Requests over one large Pull Request.

---

# Things to Avoid

Avoid the following practices:

* Direct commits to `main`.
* Long-lived feature branches.
* Extremely large Pull Requests.
* Generic commit messages.
* Mixing multiple unrelated features in one branch.
* Ignoring code review feedback.
* Leaving unused or commented-out code.
* Committing secrets or sensitive information.

---

# Daily Development Workflow

A typical development session should look like this:

```text
Start Development

↓

Checkout develop

↓

Pull latest changes

↓

Create feature branch

↓

Implement feature

↓

Commit changes

↓

Push feature branch

↓

Open Pull Request

↓

Review & Discussion

↓

Merge into develop

↓

Delete feature branch
```

---

# Future Improvements

As the project grows, this workflow may be extended with:

* Protected Branches
* Required Pull Request Reviews
* GitHub Actions
* Continuous Integration (CI)
* Continuous Deployment (CD)
* Release Branches
* Hotfix Workflow
* Semantic Versioning
* Automated Code Quality Checks

---

# Final Notes

Git is more than a version control system.

It is the foundation of team collaboration.

Following a consistent Git workflow improves communication, simplifies code reviews, reduces integration issues, and helps maintain a healthy and scalable codebase.

Every contributor is expected to follow this workflow unless the team agrees on an alternative approach.
