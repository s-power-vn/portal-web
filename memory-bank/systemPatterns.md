# System Patterns

## Architecture Overview

Spower follows a modern frontend architecture with:

- Monorepo structure using Nx
- Component-based development with React
- State management with React Query
- Type-safe development with TypeScript
- API integration with PocketBase

## Project Structure

```
apps/
  spower/
    src/         # Main application source
libs/
  api/          # Shared API interfaces
    src/
  core/         # Shared core functionality
    src/
```

## Key Technical Patterns

1. Component Patterns
   - Functional components with TypeScript
   - Props interface defined with `type`
   - React Query Kit for API calls
   - Hooks for shared logic

2. State Management
   - Tanstack Query for server state
   - React Query Kit for API interfaces
   - Local state with React hooks

3. Routing
   - Tanstack Router for type-safe routing
   - Nested routes for complex views

4. Data Display
   - Tanstack Table for data grids
   - Tanstack Virtual for large lists
   - Shadcn components for UI elements

## Component Relationships

- Clear separation between apps and libs
- Shared core functionality in libs
- Reusable components in core library
- API interfaces in dedicated library
