<div align="center">

# 🇪🇬 Kemeta

### AI-Powered Smart Tourism Platform for Egypt

*Helping tourists explore Egypt with confidence through AI-powered trip planning, verified information, smart navigation, and personalized travel experiences.*

---

![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=for-the-badge&logo=node.js)
![NestJS](https://img.shields.io/badge/NestJS-Backend-red?style=for-the-badge&logo=nestjs)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![OpenAI](https://img.shields.io/badge/OpenAI-AI-412991?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-success?style=for-the-badge)

</div>

---

# 📖 Table of Contents

- About
- Problem Statement
- Why Kemeta?
- Features
- System Architecture
- Tech Stack
- AI Services
- Smart Map
- Dashboard
- Database
- Installation
- Environment Variables
- Running the Project
- Docker
- API
- Security
- Roadmap
- Team
- License

---

# 🌍 About Kemeta

Kemeta is an AI-powered tourism platform designed to transform how travelers explore Egypt.

Instead of forcing tourists to search across dozens of websites, blogs, Facebook groups, and unreliable sources, Kemeta provides a single intelligent platform that combines:

- AI Trip Planning
- Verified Tourism Information
- Interactive Maps
- Safety Guidance
- Personalized Recommendations
- Real-time AI Assistant

The platform leverages Artificial Intelligence, Retrieval-Augmented Generation (RAG), and modern web technologies to deliver accurate, personalized, and trustworthy travel experiences.

---

# 🎯 Vision

To become the most trusted AI-powered travel companion for tourists visiting Egypt.

Kemeta aims to eliminate uncertainty, reduce travel risks, and make every visitor's journey easier, safer, and more enjoyable.

---

# 🚀 Mission

Our mission is to bridge the information gap between international tourists and Egypt's tourism ecosystem by providing:

- Trusted information
- AI-generated travel plans
- Interactive navigation
- Smart recommendations
- Safety awareness
- Verified tourism knowledge

---

# ❗ Problem Statement

Travelers visiting Egypt often face significant challenges during both planning and their actual trips.

These include:

- Scattered travel information
- Unverified pricing
- Tourist scams
- Unsafe recommendations
- Fake tour guides
- Poor trip planning tools
- Lack of centralized trusted information

Current solutions solve only part of the problem.

Some focus only on booking.

Others only provide static information.

Kemeta combines planning, navigation, AI assistance, verified knowledge, and safety into one platform.

---

# 💡 Why Kemeta?

Unlike traditional tourism applications, Kemeta focuses on intelligence rather than simple booking.

The platform provides:

✅ AI-generated itineraries

✅ Verified tourism knowledge

✅ Personalized recommendations

✅ Real-time AI assistant

✅ Smart interactive maps

✅ Nearby emergency services

✅ Tourist police locations

✅ Hospitals

✅ Restaurants

✅ Safe travel guidance

---

# ✨ Key Features

## 🤖 AI Trip Generator

Generate complete travel itineraries based on:

- Budget
- Duration
- Interests
- Travel Style
- Group Size
- Preferred Attractions

Instead of chatting with an AI, users simply answer a guided questionnaire.

The AI generates a structured itinerary optimized for the user's preferences.

---

## 📦 Ready-Made Packages

Users can browse professionally curated travel packages.

Each package includes:

- Destination
- Duration
- Estimated Cost
- Attractions
- Daily Schedule
- Transportation Tips

Perfect for tourists who don't want to build their own itinerary.

---

## 🎨 Customize Your Trip

Users may manually select attractions.

Kemeta then intelligently reorganizes the selected locations into the most efficient travel sequence using AI optimization.

This minimizes travel time while maximizing the visitor experience.

---

## 💬 AI Chatbot

Kemeta includes a Retrieval-Augmented Generation (RAG) chatbot.

Instead of generating random responses, the chatbot retrieves verified tourism information before answering.

Users can ask:

- Is this area safe?
- How much should I pay?
- Nearby restaurants?
- Opening hours?
- Tourist police?
- Emergency contacts?
- Historical information?

Responses are grounded in trusted sources.

---

## 🗺 Smart Interactive Map

The Smart Map provides:

- Tourist Attractions
- Restaurants
- Hospitals
- Tourist Police
- Danger Zones
- Navigation
- Nearby Services
- Location Awareness

The map enhances tourist safety while improving navigation.

---

# 🏗 System Architecture

Kemeta follows a modern layered architecture that separates business logic, AI services, and data storage for better scalability and maintainability.

```
                    +----------------------+
                    |      Frontend        |
                    |  React + Dashboard   |
                    +----------+-----------+
                               |
                         HTTPS / REST
                               |
+--------------------------------------------------------------+
|                    NestJS Backend API                         |
|--------------------------------------------------------------|
| Authentication                                                |
| User Management                                               |
| Trips                                                        |
| Packages                                                     |
| Places                                                       |
| Smart Map                                                    |
| Chat                                                         |
| AI Gateway                                                   |
| Dashboard                                                    |
+----------------------+----------------------+----------------+
                       |                      |
              PostgreSQL               AI Services
                 Prisma             OpenAI / RAG Engine
                       |                      |
                 Redis Cache           Vector Database
```

---

# 🧠 AI Architecture

Kemeta integrates Artificial Intelligence into multiple modules.

Instead of using AI as a simple chatbot, it powers the entire travel experience.

## AI Components

### AI Trip Generator

Input

- Budget
- Duration
- Interests
- Travel Style
- Nationality

↓

Questionnaire Engine

↓

Prompt Builder

↓

LLM

↓

Structured JSON Response

↓

Trip Builder

↓

Personalized Itinerary

---

### RAG Chatbot

User Question

↓

Embedding

↓

Vector Search

↓

Knowledge Retrieval

↓

Context Injection

↓

LLM

↓

Grounded Response

Unlike traditional AI chatbots, Kemeta never answers from the model alone.

Every answer is grounded in verified tourism content.

---

# ⚙ Backend Architecture

The backend is built using **NestJS** following Clean Architecture principles.

```
src/

├── auth/
├── users/
├── trips/
├── places/
├── packages/
├── chatbot/
├── ai/
├── dashboard/
├── maps/
├── notifications/
├── uploads/
├── common/
├── prisma/
├── config/
├── guards/
├── interceptors/
├── filters/
├── middleware/
└── main.ts
```

Each module is isolated and follows the same architecture.

```
module/

controller

↓

service

↓

repository

↓

Prisma ORM

↓

PostgreSQL
```

---

# 📂 Project Structure

```
Kemeta

frontend/

backend/

prisma/

docker/

docs/

public/

uploads/

scripts/

README.md

docker-compose.yml

package.json
```

---

# 🌐 Request Flow

```
Client

↓

API Gateway

↓

Authentication

↓

Business Logic

↓

Repository

↓

Prisma ORM

↓

PostgreSQL

↓

JSON Response
```

AI Requests

```
Client

↓

Backend

↓

Prompt Builder

↓

OpenAI

↓

Structured JSON

↓

Database

↓

Frontend
```

---

# 🔐 Authentication

Kemeta uses secure authentication mechanisms.

Supported features include:

- User Registration
- Login
- JWT Authentication
- Refresh Tokens
- Password Hashing
- Role Based Authorization
- Protected Routes

Roles

```
Admin

Manager

Content Editor

User
```

---

# 🛡 Security Features

Kemeta prioritizes user security.

Implemented protections include:

- JWT Authentication

- Password Hashing

- Input Validation

- Rate Limiting

- Secure HTTP Headers

- CORS Protection

- SQL Injection Protection

- XSS Prevention

- Environment Variables

- Request Validation

- Exception Filters

---

# 💾 Database Overview

The platform relies on PostgreSQL using Prisma ORM.

Core entities include:

```
Users

Trips

TripPlaces

Places

Packages

Questionnaires

ChatHistory

Categories

Reviews

Favorites

Notifications
```

---

# 🗄 Main Database Relations

```
User

│

├── Trips

│      ├── Trip Places

│      └── Chat History

│

├── Questionnaire

│

└── Favorites

----------------------------

Trip

│

├── Places

├── AI Itinerary

└── Budget

----------------------------

Place

│

├── Category

├── Coordinates

├── Reviews

└── Images
```

---

# 📍 Smart Map Module

One of Kemeta's flagship features.

The Smart Map provides:

- Tourist Attractions

- Restaurants

- Hotels

- Cafés

- Hospitals

- Tourist Police

- Pharmacies

- Emergency Contacts

- Dangerous Areas

- Nearby Services

- Navigation Assistance

Future versions will include:

- Offline Maps

- Live Traffic

- Smart Alerts

- Crowd Density

- Weather Overlay

---

# 🏛 Admin Dashboard

The administration dashboard provides complete control over platform content.

Dashboard Modules

## 👤 Users

Manage:

- Users

- Roles

- Permissions

- Account Status

---

## 🗺 Places

CRUD Operations

- Attractions

- Museums

- Historical Sites

- Restaurants

- Hotels

- Cafés

- Parks

---

## 📦 Packages

Manage travel packages.

- Create

- Update

- Publish

- Archive

---

## 🤖 AI

Configure

- Prompts

- Knowledge Sources

- AI Responses

- Categories

---

## 💬 Chat

Monitor

- Conversations

- Reports

- Feedback

---

## 📊 Analytics

Dashboard Statistics

- Active Users

- Trips Generated

- Most Visited Places

- Popular Packages

- AI Usage

- Daily Requests

- Revenue (Future)

---

## 📢 Content Management

Manage

- Articles

- FAQs

- Travel Guides

- Safety Tips

- Announcements

---

# 📡 REST API

Kemeta exposes RESTful APIs.

Examples:

```
POST   /auth/login

POST   /auth/register

GET    /users

GET    /places

POST   /trips

GET    /packages

POST   /chat

GET    /dashboard/stats
```

API responses follow a unified structure.

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
``` 
 ---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User Interface |
| TypeScript | Type Safety |
| Bootstrap / Tailwind CSS | Responsive UI |
| Axios | HTTP Client |
| React Router | Routing |
| Leaflet | Interactive Maps |
| OpenStreetMap | Map Provider |

---

## Backend

| Technology | Purpose |
|------------|---------|
| NestJS | Backend Framework |
| Node.js | Runtime |
| Prisma ORM | Database ORM |
| PostgreSQL | Primary Database |
| Redis | Caching |
| JWT | Authentication |
| Passport | Authentication Strategies |
| Zod / class-validator | Validation |
| Swagger | API Documentation |

---

## Artificial Intelligence

| Technology | Purpose |
|------------|---------|
| OpenAI | AI Trip Generation |
| RAG | Knowledge Retrieval |
| Vector Database | Semantic Search |
| Embeddings | Context Retrieval |
| Prompt Engineering | Personalized Responses |

---

## DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| GitHub Actions | CI/CD |
| Vercel | Frontend Deployment |
| Railway / Render | Backend Deployment |
| PostgreSQL Cloud | Production Database |

---

# ⚙ Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

OPENAI_API_KEY=

REDIS_URL=

PORT=3000

NODE_ENV=development

CORS_ORIGIN=http://localhost:5173
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/<your-org>/kemeta.git
```

Enter the project

```bash
cd kemeta
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start development server

```bash
npm run start:dev
```

---

# 🐳 Running with Docker

Build the containers

```bash
docker compose build
```

Run

```bash
docker compose up
```

Detached mode

```bash
docker compose up -d
```

Stop containers

```bash
docker compose down
```

---

# 📚 API Documentation

After running the backend, Swagger documentation will be available at:

```
http://localhost:3000/api
```

The API includes:

- Authentication
- Users
- Trips
- Packages
- Places
- Chatbot
- Smart Map
- Dashboard
- AI Services

---

# 🧪 Testing

Run unit tests

```bash
npm run test
```

Run e2e tests

```bash
npm run test:e2e
```

Generate coverage

```bash
npm run test:cov
```

---

# 📈 Roadmap

### Version 1.0

- AI Trip Generator
- Smart Map
- Dashboard
- Packages
- RAG Chatbot

---

### Version 2.0

- Hotel Booking
- Flight Integration
- Marketplace
- Reviews
- Notifications
- Multi-language Support

---

### Version 3.0

- Offline Maps
- Voice Assistant
- Live Events
- AI Travel Companion
- Community Features
- Business Dashboard

---

# 🔒 Security

Kemeta follows modern security best practices.

Implemented protections include:

- JWT Authentication
- Refresh Tokens
- Password Hashing
- Role-Based Access Control
- Input Validation
- Rate Limiting
- CORS Protection
- Secure HTTP Headers
- Environment Isolation
- ORM-based SQL Injection Protection

---

# ⚡ Performance

Performance optimizations include:

- Redis Caching
- Database Indexing
- Lazy Loading
- Efficient Pagination
- Optimized Queries
- Modular Architecture
- AI Response Caching
- CDN-ready Static Assets

---

# 📖 Documentation

Project documentation includes:

- System Blueprint
- Architecture Diagrams
- ERD
- Database Design
- API Reference
- AI Workflow
- Deployment Guide

---

# 🤝 Contributing

We welcome contributions from the community.

### Steps

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/my-feature
```

Commit changes

```bash
git commit -m "Add new feature"
```

Push

```bash
git push origin feature/my-feature
```

Create a Pull Request.

---

# 👥 Team

Kemeta is developed by a passionate team dedicated to transforming tourism in Egypt through AI and modern technologies.

Special thanks to every contributor, designer, researcher, and developer involved in bringing this vision to life.

---

# 📜 License

This project is licensed under the MIT License.

See the LICENSE file for more details.

---

# ❤️ Acknowledgments

We would like to thank:

- The Egyptian tourism community
- Open-source contributors
- OpenAI
- Prisma
- NestJS
- React
- PostgreSQL
- Leaflet
- OpenStreetMap

---

<div align="center">

## 🇪🇬 Made with ❤️ for Egypt

### Empowering Tourists Through Artificial Intelligence

If you like this project, don't forget to ⭐ the repository.

---

**Kemeta — Discover Egypt Smarter**

</div> 
