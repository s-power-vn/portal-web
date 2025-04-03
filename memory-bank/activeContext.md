# Active Context

## Current Focus Areas

### Expression Editor Component

#### Recent Changes & Improvements

1. Layout Structure

- Implemented flexible layout using CSS Grid and Flexbox
- Grid structure: `grid-cols-[1fr_1fr_2fr_auto]` for main row layout
- Consistent gap spacing using `gap-4` between fields and `gap-1` for field internals
- Removed fixed heights to allow dynamic content sizing

2. Validation Messages

- Added inline validation messages with `text-xs` size
- Messages positioned directly under respective fields
- Conditional rendering of operator validation based on field visibility
- Error messages styled with `text-red-500` for consistency

3. Date Range Handling

- Implemented special handling for datetime 'IN' operator
- Two-column layout for date range inputs using flex
- Separate validation for fromDate and toDate fields

4. Component Structure

- Property Field: Base field with property selection
- Operator Field: Conditionally rendered based on property selection
- Value Field: Dynamic rendering based on property type and operator
- Remove Button: Consistently positioned with trash icon

#### Current Focus

1. Validation Logic

- Property selection validation
- Operator validation (only shown when operator field is visible)
- Value validation based on property type
- Date range validation for 'IN' operator

2. UI/UX Improvements

- Clear visual hierarchy
- Consistent spacing and alignment
- Responsive error message display
- Smooth field transitions

#### Next Steps

1. Continue monitoring validation message positioning
2. Consider adding tooltips for complex operators
3. Evaluate need for additional validation rules
4. Consider adding field-level help text

### Database Security Implementation

#### Recent Changes & Improvements

1. Row Level Security

   - Enabled RLS on all database tables
   - Implemented organization-based data isolation
   - Created role hierarchy (anon -> org_admin)
   - Added JWT-based authentication

2. Access Control

   - Implemented role-based policies
   - Created helper functions for JWT claims
   - Set up organization context management
   - Added special case handling for key tables

3. Policy Implementation
   - SELECT policies for data visibility
   - INSERT/UPDATE policies with role checks
   - DELETE policies with elevated privileges
   - Special policies for organizations table

#### Current Focus

1. Security Testing

   - Policy validation
   - Role permission verification
   - Cross-organization isolation testing
   - JWT claim validation

2. Performance Optimization
   - Policy execution efficiency
   - Query optimization with RLS
   - JWT claim extraction caching

#### Next Steps

1. Comprehensive security testing
2. Performance impact assessment
3. Documentation updates
4. User role management implementation

## Current Focus

### Expression Editor Improvements

- Fixed operator parsing and display for datetime fields
- Enhanced form validation to only show after first submit
- Improved UX with sequential field display:
  - Property select is always visible
  - Operator select shows only after property is selected
  - Value input shows only after operator is selected
- Added proper spacing between multiple expressions
- Fixed date parsing and formatting in the expression editor

### Database Security Implementation

- Implemented comprehensive Row Level Security
- Set up role-based access control
- Created organization-based data isolation
- Added JWT-based authentication

## Recent Changes

- Updated expression editor's validation behavior to be less intrusive
- Improved the visual hierarchy of expression inputs
- Fixed bug with datetime operator parsing
- Implemented database security with Row Level Security
- Created role hierarchy and access policies
- Added JWT-based authentication
- Set up organization-based data isolation

## Next Steps

- Consider adding field-level validation states
- Consider adding animation for sequential field display
- Add more comprehensive testing for expression parsing
- Conduct comprehensive security testing
- Assess performance impact of RLS
- Implement user role management
- Document security patterns and policies

## Active Decisions

- Form validation errors only show after first submit attempt
- Fields appear sequentially to guide user input
- Maintain fixed height with scrollable content for multiple expressions
- Use Row Level Security for data isolation
- Implement role-based access control
- Use JWT claims for context
- Enable organization-based isolation

## Active Considerations

1. Code Organization

   - Maintain clean project structure
   - Follow established patterns
   - Ensure proper separation of concerns

2. Development Practices

   - Enforce TypeScript best practices
   - Follow React Query Kit pattern
   - Maintain consistent coding style

3. Documentation

   - Keep Memory Bank updated
   - Document new features and changes
   - Track progress and decisions

4. Security
   - Policy effectiveness
   - Performance impact
   - Role management
   - Cross-organization isolation

### Organization Management

- Implemented organization list page with modern card-based UI
- Each organization card displays:
  - Organization name
  - User's role in the organization (with color-coded badges)
  - Member count
  - Member avatars (up to 5 visible)

### Role System

- Three role types implemented:
  1. Quản trị viên (org_admin) - Purple badge
  2. Điều hành (org_operator) - Blue badge
  3. Thành viên (org_member) - Green badge

### UI/UX Decisions

- Grid layout: 1/2/3/4 columns responsive
- Card design with hover effects
- Role badges with semantic colors
- Member avatars with overflow indicator
- Vietnamese localization

### API Integration

- Using Supabase for data storage
- Organization structure:
  ```typescript
  type Organization = {
    id: string;
    name: string;
    role: Array<{
      role: string;
    }>;
    members: Array<{
      role: string;
      user: {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
      };
    }>;
  };
  ```

### Recent Changes

1. Implemented organization list page with card layout
2. Added role-based color coding system
3. Localized all text to Vietnamese
4. Enhanced member display with avatars and overflow handling
5. Improved type safety with proper TypeScript types

### Next Steps

1. Implement organization creation form
2. Add organization settings/management
3. Implement member management features
4. Add search and filter capabilities
5. Consider adding organization statistics/metrics
