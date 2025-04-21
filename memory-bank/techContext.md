# Technical Context

## Technology Stack

- React 18 with Vite
- TypeScript
- TailwindCSS
- PostgreSQL with PostgREST
- PocketBase
- Nx Monorepo

## Frameworks and Libraries

### Core Frameworks

- React 18.3.1
- Vite 5.4.11
- Nx 20.3.1
- TailwindCSS 3.4.17
- TypeScript 5.7.3

### Data Management

- PostgreSQL
- PostgREST
- Tanstack Query 5.68.0
- React Query Kit 3.3.1
- PocketBase 0.25.1
- Supabase PostgrestJS 1.19.4

### UI Components

- Shadcn/UI (via @minhdtb/storeo-theme)
- Radix UI
- Lucide React 0.359.0
- Tremor 3.16.2

### Routing and Navigation

- Tanstack Router 1.114.23
- Tanstack Virtual File Routes 1.114.12

### Form Handling

- React Hook Form 7.51.1
- Yup 1.4.0
- Hookform Resolvers 3.3.4

### Data Display

- Tanstack Table 8.20.6
- Tanstack Virtual 3.10.8
- Tanstack Match Sorter 8.19.4
- XYFlow/React 12.4.3

### Editor Components

- TipTap 2.11.5
- React PDF 9.1.0
- React Print 0.1.142

### Utilities

- Lodash 4.17.21
- Luxon 3.4.4
- UUID 9.0.1
- Zipson 0.2.12
- CLSX 2.1.0
- UUIDv7 0.3.4

## Project Libraries

- @minhdtb/storeo-core - Core utilities and shared functions
- @minhdtb/storeo-theme - UI component library based on Shadcn

## Development Setup

- Node.js environment
- PNPM package manager
- TypeScript configuration
- ESLint and Prettier
- Vite dev server
- Nx commands for development:
  - `nx serve spower` - Start development server
  - `nx build spower` - Build for production
  - `nx lint` - Run linting

## Technical Constraints

### TypeScript

- Prefer `type` over `interface`
- Strict type checking
- Type-safe API calls using React Query Kit

### Components

- Functional components only
- Props defined with TypeScript types
- No code comments policy
- Follow Shadcn component patterns

### API Integration

- React Query Kit pattern for API calls
- PocketBase for legacy backend services
- PostgREST for PostgreSQL access
- Organized by domain in libs/api/src/api/

### Styling

- TailwindCSS for styling
- Shadcn/Radix for UI components
- Consistent class naming conventions
- Custom theme colors (appBlue, appBlueLight, appWhite)

### Database Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Role-based access control (anon, authenticated, org_member, org_operator, org_admin)
- Organization-based data isolation
- Helper functions for JWT claims extraction
