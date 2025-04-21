# Active Context

## Current Focus Areas

### Project Management Features

The project is currently focused on implementing and refining the project management features, including:

- Project listing with virtualized table
- Project details and settings
- Project-related issue tracking
- Customer association
- Construction-specific features

### Organization Management

Ongoing improvements to organization management, including:

- Role-based access control implementation
- Member management
- Organization settings
- Data isolation between organizations

### Database Security Implementation

Recent focus on implementing comprehensive database security:

- Row Level Security (RLS) on all tables
- Role-based access policies
- JWT-based authentication
- Organization-based data isolation

### API Error Handling & Localization

Error handling improvements have been a focus area:

- Consistent error structure in Vietnamese
- Standardized error message format
- Proper error propagation
- Clear user feedback

## Recent Changes

### Project Management

- Implemented virtualized project list table with infinite scrolling
- Added project detail views and tabs
- Created project settings page with edit capabilities
- Added issue badge component to show issue count
- Implemented customer association

### Database Security

- Implemented comprehensive Row Level Security (RLS)
- Set up role hierarchy (anon → org_admin)
- Created organization-based data isolation
- Added JWT-based authentication
- Implemented helper functions for JWT claims

### UI Improvements

- Enhanced table components with virtualization
- Added proper loading indicators
- Implemented responsive layouts for all views
- Fixed styling issues in various components
- Added Vietnamese localization for all text

## Next Steps

### Project Management

- Complete remaining project view tabs
- Enhance issue tracking functionality
- Add filtering and sorting to project list
- Improve project creation form
- Add project statistics dashboard

### Organization Management

- Complete organization settings pages
- Add member invitation workflow
- Enhance role management interface
- Add organization activity tracking
- Implement organization-level dashboard

### Performance Optimization

- Evaluate RLS performance impact
- Optimize API queries
- Implement caching strategies
- Review virtualization implementation
- Optimize large list rendering

## Active Decisions

### Technical Decisions

- Use Tanstack Virtual for handling large lists
- Implement RLS for database security
- Use React Query Kit pattern for API calls
- Follow functional component pattern
- Maintain Vietnamese localization for all user-facing text

### UI/UX Decisions

- Consistent table styling with sticky headers
- Loading indicators for async operations
- Infinite scrolling for large lists
- Responsive layout with TailwindCSS
- Vietnamese as the primary language

### Security Decisions

- Row Level Security as primary security mechanism
- Role-based access control (org_member, org_operator, org_admin)
- Organization-based data isolation
- JWT-based authentication
- Secure API access patterns

## Active Considerations

### Performance

- Impact of RLS on query performance
- Virtualization for large data sets
- Efficient API fetching strategies
- Optimistic updates for better UX
- Pagination and infinite scroll implementation

### Security

- Policy effectiveness across all entities
- Role permission boundaries and escalation
- Cross-organization data isolation verification
- JWT claim extraction optimization
- Comprehensive security testing

### Developer Experience

- Code organization and maintainability
- Consistent patterns across the codebase
- Documentation of key concepts
- Type safety and error handling
- Memory Bank maintenance
