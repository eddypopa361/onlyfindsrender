# replit.md

## Overview

This is a full-stack React e-commerce application built with Express.js backend, serving as a designer product showcase platform. The application displays products with affiliate links to CNfans and focuses on providing an intuitive product browsing experience with filtering, search, and categorization capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js RESTful API
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Uploads**: Multer middleware for CSV import functionality
- **Static Assets**: Express static file serving

### Database Schema
- **Products Table**: Core entity with fields for title, price, image, buyUrl, viewUrl, category, subCategory, brand, featured, and carousel flags
- **Users Table**: Basic user management (appears to be for admin functionality)
- **Migration System**: Drizzle Kit for database migrations

## Key Components

### Product Management
- **Product Display**: Grid-based product cards with lazy loading
- **Filtering System**: Multi-level filtering by category, subcategory, and brand
- **Search Functionality**: Text-based product search across titles and brands
- **Pagination**: Server-side pagination for performance
- **Featured Products**: Special designation for homepage carousel and best sellers

### Content Sections
- **Hero Section**: Main landing area with promotional content
- **Best Sellers**: Featured products showcase
- **About Section**: Information about the business
- **FAQ Section**: Frequently asked questions
- **Product Details**: Individual product pages with recommendations

### Admin Features
- **CSV Import**: Bulk product import functionality
- **Product Management**: CRUD operations for products
- **Brand Management**: Scripts for brand normalization and correction

## Data Flow

1. **Product Loading**: Products are fetched via REST API with pagination and filtering
2. **Image Handling**: Static image serving through Express with optimized paths
3. **Search & Filter**: Real-time filtering and search with debounced API calls
4. **Product Details**: Individual product pages with related product recommendations
5. **CSV Import**: Admin functionality for bulk product uploads with validation

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Static Files**: Local file system storage for uploaded images

### Third-party Services
- **CNfans**: Affiliate link platform for product purchasing
- **ImageKit**: CDN service for optimized image delivery (some images)

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment
- **Development Server**: Vite dev server with HMR
- **TypeScript**: Full type safety across frontend and backend

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/` directory
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Database**: Drizzle Kit handles schema migrations

### Production Setup
- **Server**: Single Express server serves both API and static files
- **Environment**: Relies on `DATABASE_URL` environment variable
- **Assets**: Static file serving from `uploads/` directory
- **Performance**: Production build includes code splitting and optimization

### Development Workflow
- **Hot Reload**: Vite HMR for frontend changes
- **Database**: `npm run db:push` for schema changes
- **Import Scripts**: Various TypeScript scripts for data management and cleanup
- **File Structure**: Monorepo structure with shared schema between client and server

The application is designed to be easily deployable on platforms like Replit, with configuration specifically optimized for serverless PostgreSQL databases and includes comprehensive product management tools for maintaining the e-commerce catalog.