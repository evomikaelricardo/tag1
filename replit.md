# Overview

SafeTag Pro is a modern e-commerce web application specializing in smart emergency safety tags for families, pets, and personal items. The application features a comprehensive product catalog with categories for kids, pets, luggage, and seniors, integrated payment processing through Stripe, and a complete shopping cart experience. Built as a full-stack TypeScript application with a React frontend and Express backend, it provides a seamless shopping experience for emergency safety products.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool and development server
- **Routing**: Wouter for lightweight client-side routing with support for product details, checkout, and order confirmation pages
- **State Management**: TanStack Query (React Query) for server state management and caching, with React Context for cart state
- **UI Components**: Radix UI primitives with shadcn/ui component library, providing a consistent design system
- **Styling**: Tailwind CSS with CSS custom properties for theming, supporting both light and dark modes
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations and schema management
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development and PostgreSQL for production
- **API Design**: RESTful API endpoints for products, orders, and contact management

## Data Storage Solutions
- **Database**: PostgreSQL as the primary database, configured through Neon serverless for scalability
- **ORM**: Drizzle ORM with TypeScript schema definitions shared between client and server
- **Schema**: Three main entities - products (catalog with features and categories), orders (customer purchases with Stripe integration), and contacts (customer inquiries)
- **Migrations**: Drizzle Kit for database schema migrations and version control

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Payment Security**: Stripe integration with secure payment intent creation and webhook handling
- **Data Validation**: Zod schemas for runtime type checking and API request validation

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment processing with React Stripe.js for frontend payment forms and server-side payment intent creation
- **Integration**: Secure payment flows with order status tracking and payment confirmation

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL database with connection pooling and automatic scaling
- **Replit Integration**: Development environment with custom Vite plugins for error handling and development tools

### UI and Design
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Consistent icon library for user interface elements
- **Google Fonts**: Typography with Inter font family for modern, readable text

### Development Tools
- **TypeScript**: Full type safety across the application stack
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind CSS integration