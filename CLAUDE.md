# CLAUDE.md
sempre me responda em portugues do brasil

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NFCFA Web is a Next.js 15 application for managing a football club association platform. It implements Clean Architecture with domain-driven design principles, featuring club management, member enrollment, training administration, and administrative dashboards.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js TypeScript rules

## Architecture

### Clean Architecture Structure

The application follows Clean Architecture with these layers:

- **Domain** (`src/domain/`): Core business entities, enums, and services
- **Application** (`src/application/`): Use cases and gateway interfaces
- **Infrastructure** (`src/infraestructure/`): External adapters, API implementations, and configurations
- **Presentation** (`src/app/`): Next.js App Router pages and components

### Key Architecture Patterns

- **Dependency Injection**: Container system in `src/infraestructure/containers/container.ts`
- **Gateway Pattern**: API abstractions with implementations for external service calls
- **Use Cases**: Business logic encapsulation in `src/application/use-cases/`
- **DTO Contracts**: API interface definitions in `src/contracts/api/`

### Authentication & Authorization

- **Next-Auth v5**: JWT-based authentication with refresh token rotation
- **Role-based Access**: ADMIN role for administrative features
- **Route Protection**: Middleware handles authentication and authorization
- **Family System**: Users belong to families with affiliation status

### State Management

- **Zustand**: Global state for UI components (`src/store/`)
- **TanStack Query**: Server state management with cache invalidation
- **React Hook Form**: Form state with Zod validation

### Key Features

- **Multi-tenant Club System**: Clubs have principals, members, and enrollment requests
- **Training Management**: CRUD operations for club training sessions
- **Admin Dashboard**: User management, club oversight, and system administration
- **Member Enrollment**: Request/approval workflow for club membership
- **Responsive Design**: Tailwind CSS with Radix UI components

## File Structure Conventions

- **Pages**: App Router structure in `src/app/` with route groups for admin vs user areas
- **Components**: Reusable UI in `src/components/ui/`, feature-specific in page directories
- **Hooks**: Custom React hooks in `src/hooks/` for business logic integration
- **Actions**: Server actions in `src/infraestructure/actions/` for form handling

## Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Authentication**: NextAuth v5 with JWT strategy
- **UI**: Radix UI primitives with Tailwind CSS v4
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

## Backend Integration

The application connects to a backend API via:
- Environment variable: `NEXT_PUBLIC_BACKEND_URL`
- Gateway implementations handle HTTP requests with JWT tokens
- OpenAPI specification available in `openapi.json`

## Development Notes

- TypeScript strict mode enabled with path mapping (`@/*` → `src/*`)
- ESLint configured for Next.js with TypeScript rules
- Spelling note: Infrastructure folder uses "infraestructure" (Portuguese spelling)