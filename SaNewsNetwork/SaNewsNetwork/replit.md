# SA News JK - News Portal Application

## Overview

SA News JK is a modern news portal application built as a full-stack web application with a React frontend and Express.js backend. The application provides a comprehensive news reading experience with content management capabilities, user authentication, and a responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code, using a shared schema for type consistency across the stack.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight routing library)
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth integration with session management
- **API Design**: RESTful API structure with proper error handling

### Database Design
- **ORM**: Drizzle ORM with type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Authentication System
- **Provider**: Replit OAuth for user authentication
- **Session Management**: Express sessions stored in PostgreSQL
- **Authorization**: Role-based access control (admin/user roles)
- **Security**: Secure cookies and CSRF protection

### Content Management
- **Articles**: Full CRUD operations for news articles with categories, publishing status, and rich metadata
- **Videos**: Video content management with external platform integration (YouTube, Instagram, Facebook, Twitter)
- **Categories**: Organized content categorization (Breaking News, Politics, Business, Sports, Technology, Health, Environment)

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui components built on Radix UI
- **Typography**: Custom font stack (Playfair Display, Open Sans)
- **Theme System**: CSS variables-based theming with dark mode support

### API Structure
- **Authentication Endpoints**: User login, logout, and profile management
- **Content Endpoints**: Article and video CRUD operations with filtering and pagination
- **Search Functionality**: Content search across articles
- **File Upload**: Image handling for article thumbnails

## Data Flow

1. **User Authentication**: Users authenticate via Replit OAuth, creating sessions stored in PostgreSQL
2. **Content Retrieval**: Frontend requests content through React Query, which fetches from Express API endpoints
3. **Database Operations**: API endpoints use Drizzle ORM to perform type-safe database operations
4. **Real-time Updates**: React Query handles cache invalidation and background refetching
5. **Admin Operations**: Authenticated admin users can create, update, and delete content through protected API endpoints

## External Dependencies

### Production Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit OAuth service
- **Image Hosting**: External image URLs (Unsplash integration for demo content)
- **Video Platforms**: YouTube, Instagram, Facebook, Twitter (embedded content)

### Development Dependencies
- **Build Tools**: Vite, ESBuild, TypeScript compiler
- **Code Quality**: ESLint, Prettier (implied by structure)
- **Development Server**: Vite dev server with HMR

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server for frontend, tsx for backend development
- **Database**: Connected to Neon Database instance
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID, ISSUER_URL

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Served directly by Express in production
- **Database**: Production PostgreSQL instance with connection pooling

### Deployment Considerations
- **Environment**: Designed for Replit deployment with specific integrations
- **Session Storage**: PostgreSQL-backed session store for scalability
- **Asset Serving**: Express serves both API endpoints and static frontend assets
- **Health Checks**: Built-in request logging and error handling

The application uses modern web development practices with TypeScript for type safety, React Query for efficient data fetching, and Drizzle ORM for database operations. The architecture supports both development and production environments with appropriate optimizations for each.