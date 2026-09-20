# Ordering System

A full-stack, end-to-end online ordering platform built with TypeScript, React, PostgreSQL, and Redis. This project is a complete architectural migration and feature extension of an earlier JavaScript/MongoDB implementation, redesigned around a layered backend architecture, relational data integrity, and a token-based authentication system.

## Table of Contents

- [Overview](#overview)
- [Technical Highlights](#technical-highlights)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Core Features](#core-features)
- [Authentication and Security](#authentication-and-security)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Engineering Notes](#engineering-notes)

## Overview

The Ordering System is a two-sided e-commerce application supporting both customer-facing ordering workflows and an administrative back office. The platform manages the full order lifecycle, including daily inventory allocation, order placement, payment slip verification, and real-time order status tracking.

This repository represents a ground-up migration of an earlier project from a JavaScript and MongoDB stack to a fully typed TypeScript stack backed by PostgreSQL, undertaken to improve data integrity, type safety, and maintainability. The migration preserved all original business logic while introducing a formal relational schema, a modern authentication model, and a set of previously unimplemented customer-facing features.

## Technical Highlights

- Migrated a MongoDB document model with embedded arrays (addresses, order items, payment and delivery information) to a normalized PostgreSQL relational schema using Prisma, enforcing referential integrity at the database level.
- Replaced a single long-lived JWT stored in a cookie with a short-lived access token and refresh token pair, including server-side token invalidation on rotation and logout via Redis.
- Identified and remediated an authorization gap in the original payment confirmation flow, where any authenticated user could attach a payment slip to another user's order by supplying its identifier. Ownership verification was added prior to processing.
- Removed NoSQL-injection-oriented sanitization middleware (`express-mongo-sanitize`, `xss-clean`) that was no longer applicable once the data layer moved to Prisma's parameterized queries, reducing dependency surface without reducing security posture.
- Implemented real-time order status propagation to authenticated customers via Socket.IO, scoped to per-user rooms, eliminating the need for client-side polling.
- Extended the platform with a complete customer-facing ordering experience (menu browsing, cart, checkout, order history, and address management) built against an API that had previously only been exercised by the administrative interface.

## Technology Stack

**Frontend**
- React with TypeScript, built using Vite
- Tailwind CSS
- Zustand for state management
- Socket.IO client for real-time updates
- Axios with interceptor-based token refresh

**Backend**
- Node.js with Express and TypeScript
- PostgreSQL with Prisma ORM
- Redis, used for refresh token invalidation
- Socket.IO for server-to-client real-time events
- JSON Web Tokens for authentication
- Helmet, HPP, and rate limiting for baseline HTTP hardening

**Infrastructure**
- Docker Compose for local PostgreSQL and Redis provisioning

## System Architecture

The backend follows a layered architecture with a clear separation of concerns:

```
routes/       HTTP endpoint definitions
controllers/  Request and response handling
services/     Business logic and data access
validation/   Request payload schema validation
types/        Shared TypeScript type definitions
```

This structure was adopted to keep transport-layer concerns, business rules, and data access independently testable and maintainable as the system grows.

## Core Features

**Customer-facing**
- Menu browsing with category filtering, search, and live daily stock availability
- Shopping cart bound to a single pickup date, reflecting the system's per-day inventory model
- Checkout supporting both pickup and delivery fulfillment, with saved delivery addresses
- Order history and a detailed order view with a live payment countdown, slip upload, and real-time status updates
- Account profile management, including saved address management

**Administrative**
- Dashboard with order and revenue summaries
- Product management, including category assignment and reassignment
- Category management
- Daily inventory management, with per-day stock capacity control
- Order approval and fulfillment workflows, including real-time order intake
- Customer and role management

## Authentication and Security

The system uses a short-lived access token and long-lived refresh token model:

```
Login/Register  ->  Access token (15 min, returned in response body, sent as a Bearer header)
                     Refresh token (7 days, HTTP-only cookie)

On each request  ->  Access token attached automatically via request interceptor

On expiry (401)  ->  Client interceptor calls POST /auth/refresh (refresh cookie)
                      New access token issued and the original request retried automatically

On logout        ->  Refresh token invalidated in Redis
```

Passwords are hashed prior to storage. Authorization checks are enforced at the route level for administrative endpoints and at the resource level for user-owned data (for example, order and address ownership).

## Project Structure

```
Ordering-System/
├── client/               React, TypeScript, Vite, Tailwind CSS
├── server/               Express, TypeScript, Prisma, PostgreSQL, Redis
└── docker-compose.yml    Local PostgreSQL and Redis services
```

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose

### 1. Start dependent services

```bash
docker compose up -d
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Configure DATABASE_URL, JWT secrets, and Cloudinary credentials

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed     # creates a sample administrator account and sample catalog data
npm run dev       # starts the API server
```

### 3. Frontend setup

```bash
cd client
cp .env.example .env

npm install
npm run dev       # starts the development server
```

## Engineering Notes

The following items were identified and deliberately addressed during the migration, rather than being defects introduced by it:

1. **Order status event emission.** The frontend contained an event listener for order status updates that the original backend never emitted. Emission was added to all relevant order state transitions (approval, rejection, and status update).
2. **Unused administrative routes.** Controller functions for user role management and user deletion existed in the original codebase but were never exposed via a route. These were wired up and exposed as authenticated administrative endpoints.
3. **Dead code in dashboard statistics.** A status value referenced in dashboard aggregation logic did not correspond to any value in the order status enumeration and was removed.
4. **Referential integrity on product deletion.** The original data model allowed products referenced by existing orders to be deleted outright, resulting in orphaned references. The relational schema enforces foreign key constraints, preventing deletion of products with associated orders.

---

This project was developed as an independent portfolio exercise in system migration, backend architecture, and full-stack application design.
