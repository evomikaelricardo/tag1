# SafeTag

## Overview

SafeTag is a modern e-commerce platform specializing in smart emergency tags for kids, pets, luggage, and seniors. The application features a comprehensive product catalog, shopping cart functionality, and order management system with support for multiple payment methods including cash on delivery, credit cards, and bank transfers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Built with React 18, TypeScript, and Vite for fast development and optimized production builds
- **Routing**: Uses Wouter for lightweight client-side routing with pages for home, product details, checkout, and order confirmation
- **UI Framework**: Implements shadcn/ui components with Radix UI primitives for accessible, customizable interface components
- **Styling**: TailwindCSS with CSS custom properties for theming and responsive design
- **State Management**: 
  - React Query for server state management and caching
  - React Context for cart state with localStorage persistence
  - Custom hooks for reusable logic (cart, toast notifications, mobile detection)

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging, JSON parsing, and error handling
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **API Endpoints**: Product catalog, order management, and contact form submission
- **Development Setup**: Vite integration for hot module replacement in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Well-defined tables for products, orders, and contacts with JSON fields for complex data
- **Connection**: Neon Database serverless PostgreSQL with connection pooling
- **Migrations**: Drizzle Kit for database schema migrations and management

### Design Patterns
- **Repository Pattern**: IStorage interface allows for easy storage backend switching
- **Component Composition**: Reusable UI components with proper separation of concerns
- **Custom Hooks**: Encapsulated logic for cart management, toast notifications, and responsive design
- **Error Boundaries**: Comprehensive error handling with user-friendly error displays

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and query building
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **shadcn/ui**: Pre-built component library with Radix UI primitives
- **Radix UI**: Headless, accessible UI components
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon library

### Frontend Libraries
- **React Query**: Server state management and data fetching
- **React Hook Form**: Form handling with validation
- **Wouter**: Lightweight routing library
- **Date-fns**: Date utility functions

### Payment Processing
- **Stripe**: Payment processing integration with React components
- **Multiple Payment Methods**: Cash on delivery, credit cards, and bank transfers

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer