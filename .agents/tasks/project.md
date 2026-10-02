# Der.my.id Full-Stack Implementation Prompt

You are working inside a GitHub Codespace on the `der.my.id` repository.

Your task is to implement and complete the full-stack application using the existing starter project and architecture. Inspect the repository first, understand the existing implementation, and then make the required changes. Do not unnecessarily replace working code.

## Technology Stack

The application uses:

- vinext
- Next.js-compatible App Router architecture provided by vinext
- TypeScript
- Better Auth
- Cloudflare D1
- Drizzle ORM
- shadcn/ui
- Cloudflare-compatible server/runtime architecture
- Markdown-based content for formatted static pages such as legal pages and documentation

The existing shadcn preset has already been applied and all required primitives have already been added.

## Critical UI Rule

All application UI must use shadcn/ui components.

Do not use native HTML elements as UI components when a corresponding shadcn component exists.

Examples:

- Do not create custom `<button>` UI. Use the appropriate shadcn Button.
- Do not create custom `<input>` UI. Use the appropriate shadcn Input.
- Do not create custom `<select>` UI. Use the appropriate shadcn Select.
- Do not create custom dialogs. Use the shadcn Dialog.
- Do not create custom dropdowns. Use the shadcn Dropdown Menu.
- Do not create custom tabs. Use the shadcn Tabs.
- Do not create custom cards when Card is appropriate.
- Do not create custom alerts when Alert is appropriate.

Use semantic HTML only where it is structural content and there is no applicable shadcn primitive.

## Never Modify shadcn Primitives Manually

The existing shadcn primitive implementations must not be edited manually.

Do not modify files under the existing shadcn/ui primitive implementation merely to solve an application-level problem.

If an error involves a primitive:

1. Inspect how the primitive is being consumed.
2. Fix the caller, wrapper, props, types, state, or surrounding implementation.
3. Only modify the primitive if the problem is genuinely caused by the primitive implementation itself and there is no correct application-level solution.

Do not redesign, restyle, or alter the established shadcn preset.

## Application Architecture

The repository must maintain these top-level directories:

- `app`
- `components`
- `hooks`
- `lib`
- `types`

Additional directories may be introduced when architecturally justified, but do not unnecessarily reorganize the existing project.

## Route Files Must Be Orchestrators

Frontend route files must remain extremely thin.

A route file must not contain the complete implementation of a page.

For example:

`app/(public)/page.tsx`

must orchestrate sections from:

`components/home/**`

A page should conceptually look like:

- import page sections
- compose sections
- return the page composition

Do not put substantial UI implementation directly inside `app/page.tsx`.

Apply the same rule to every frontend route.

Use page-specific component sections such as:

- `components/home/hero.tsx`
- `components/home/features.tsx`
- `components/home/how-it-works.tsx`
- `components/home/faq.tsx`
- `components/home/cta.tsx`

Use an appropriate directory structure for every major page.

## App Router Route Groups

Organize routes by application area using these route groups:

- `app/(public)/**` — public pages, including the home page at `app/(public)/page.tsx`
- `app/(auth)/**` — login, registration, password recovery, and email verification pages
- `app/(dashboard)/dashboard/**` — authenticated user and admin dashboard pages
- `app/api/**` — API route handlers, including Better Auth and versioned API endpoints

Parenthesized route group names are organizational only and do not appear in URLs. For example, `app/(public)/about/page.tsx` maps to `/about`, while `app/(auth)/login/page.tsx` maps to `/login`.

Keep the single dashboard architecture: admin pages belong under `app/(dashboard)/dashboard/admin/**` and map to `/dashboard/admin/**`. Do not create a separate top-level admin dashboard.

Keep `app/layout.tsx` as the shared root document and put area-specific shells in a group's `layout.tsx` only when that group needs them. Layouts compose presentation and shared providers; they must not contain business workflows or replace server-side authorization.

Keep public, auth, and dashboard page sections in their corresponding `components/**` areas. Keep API handlers thin and delegate server-side work to services and repositories.

## No Business Logic in Routes or Components

Do not put application business logic directly inside:

- `app/**`
- frontend page route files
- API route files
- section components
- large UI components

This includes:

- database queries
- authorization logic
- authentication logic
- domain validation
- DNS logic
- Cloudflare API operations
- submission state transitions
- role checks
- complicated calculations
- reusable formulas
- data transformation logic
- complex validation
- repository operations
- service operations

Components should primarily be responsible for presentation, composition, user interaction, and calling appropriate hooks/actions.

## Hooks

Reusable client-side logic must be placed under:

`hooks/**`

Examples include:

- domain form state
- domain availability state
- dashboard state
- authentication-related client state
- API token UI state
- reusable table/filter state
- reusable form behavior

Do not place reusable hooks or substantial state logic directly in route files.

## Types

Shared TypeScript types must be placed under:

`types/**`

Do not repeatedly define the same domain types in unrelated components.

Create appropriate types for concepts such as:

- user
- role
- user status
- domain
- domain status
- DNS mode
- domain submission
- submission status
- nameserver
- contact
- API token
- audit event
- WHOIS response

Use inferred Drizzle types where appropriate rather than duplicating database types unnecessarily.

## Database Architecture

Use Cloudflare D1 as the database.

Use Drizzle ORM for all database schema definitions and database access.

The database must not store DNS records.

The database represents:

- users
- authentication accounts
- sessions
- verification records
- API bearer tokens
- contacts
- domain ownership
- domain submissions
- custom nameservers
- domain lifecycle events
- audit logs

Cloudflare remains the DNS source of truth.

Do not create a generic `dns_records` table.

## Core Database Entities

The implementation must support these entities:

- `user`
- `account`
- `session`
- `verification`
- `api_token`
- `contact`
- `domain`
- `domain_submission`
- `domain_nameserver`
- `domain_event`
- `audit_log`

Use lowercase snake_case naming.

Do not use camelCase for database table names or database field names.

## Domain Ownership

A domain represents:

`<label>.der.my.id`

The database must maintain ownership through the relationship:

`domain -> user -> contact`

A contact is associated with the user, not directly with a domain.

Do not create a `domain_contact` table unless a future requirement explicitly changes this model.

A user's contact information is therefore reused for WHOIS information for domains owned by that user.

## Domain Status

Support at least:

- `pending`
- `approved`
- `rejected`
- `suspended`
- `revoked`

The implementation must enforce valid status transitions through the service layer.

Do not scatter status-transition logic throughout components or route handlers.

## DNS Mode

A domain supports:

- `shared`
- `custom`

`shared` means the domain uses the service's shared nameserver infrastructure under `der.my.id`.

`custom` means the user delegates DNS through custom nameservers.

The database stores custom nameservers, but does not store DNS records.

When switching from custom nameservers back to shared DNS:

1. Remove the custom nameserver records from the database.
2. Remove the corresponding Cloudflare delegation/NS records through the appropriate Cloudflare API operation.
3. Restore the domain to the shared DNS mode.

This behavior must be implemented through server-side services, not frontend code.

## Cloudflare Integration

Cloudflare API operations must be isolated from route handlers and UI components.

Create appropriate modules under:

`lib/**`

Use a dedicated integration/service structure such as:

`lib/cloudflare/**`

and/or:

`lib/service/**`

Do not call the Cloudflare API directly from a React component.

Do not call the Cloudflare API directly from a frontend route component.

Do not duplicate Cloudflare API logic between multiple endpoints.

## Repository and Service Layers

Server-side logic must be separated into appropriate layers.

Use:

`lib/repository/**`

for persistence/database operations.

Use:

`lib/service/**`

for business logic and application workflows.

Use:

`lib/cloudflare/**`

for Cloudflare integration.

Use:

`lib/auth/**`

for authentication and authorization helpers where appropriate.

Use:

`lib/validation/**`

for reusable validation schemas and validation logic where appropriate.

Use other `lib/**` modules when justified.

The general dependency direction should be:

route/API
→ service
→ repository/integration
→ database/external service

Do not bypass the service layer for business-critical operations.

## Authentication

Use Better Auth.

There are two authentication mechanisms:

### Web Authentication

Use Better Auth database-backed sessions for the web application.

Web authentication must protect authenticated routes and server-side operations.

### API Authentication

The API uses bearer tokens similar to APIs provided by platforms such as Vercel, Cloudflare, and GitHub.

API tokens must be stored securely as hashes.

Never store the raw bearer token after creation.

API requests must authenticate using the bearer token and resolve the associated user.

Web sessions must not be treated as API bearer tokens.

API bearer tokens must not be treated as web sessions.

## Authorization

There are exactly two application roles:

- `user`
- `admin`

Do not introduce `member`, `staff`, `moderator`, or other application roles unless explicitly required later.

A normal customer is `user`.

An administrator is `admin`.

Authentication and authorization must be enforced server-side.

Never rely only on frontend navigation visibility for security.

If an admin navigation item is hidden from a normal user, that is only a UI concern. The actual endpoint/service/page must independently enforce authorization.

## Admin Dashboard

There is only one dashboard system.

Do not create separate top-level user and admin dashboards.

Use:

`/dashboard`

as the authenticated application root.

Administrators may see additional administration navigation and access admin functionality from the same dashboard architecture.

Normal users must not be able to access administrator functionality by manually entering URLs or calling API endpoints.

Admin authorization must be enforced in:

- server-side route protection
- service-layer authorization
- API authorization
- mutation operations

Avoid duplicating role-checking code throughout the application. Create centralized authorization helpers/guards.

## Authentication and Authorization Guards

Create reusable guards/helpers for concepts such as:

- require authenticated user
- require verified email where required
- require admin
- resolve current session
- resolve current API token
- resolve authenticated API user

Use the appropriate guard at the server boundary.

Do not rely on client-side state for authorization.

Do not put authentication logic directly into every page.

Do not put raw role comparisons throughout unrelated components.

## Vinext Proxy

Inspect the installed vinext version and its current proxy capabilities before implementing middleware/proxy behavior.

Use the vinext-supported proxy mechanism where appropriate for request-level concerns such as:

- authentication boundary handling
- route protection
- redirecting unauthenticated users
- redirecting authenticated users away from authentication pages where appropriate
- API authentication boundary handling where appropriate
- request normalization
- security-related request filtering

Do not put business logic, database queries, domain operations, or Cloudflare API calls into the proxy.

The proxy should remain lightweight and request-oriented.

Server-side authorization must still be enforced at the actual protected resource/service boundary. Proxy protection must never be the sole authorization mechanism.

## Public Pages

Implement the public application pages including:

- `/`
- `/about`
- `/contact`
- `/status`
- `/domains`
- `/domains/check`
- `/whois`
- `/whois/[domain]`
- `/faq`
- `/docs`
- `/docs/getting-started`
- `/docs/domains`
- `/docs/dns`
- `/docs/api`
- `/legal`
- `/legal/terms`
- `/legal/privacy`
- `/legal/acceptable-use`
- `/legal/domain-policy`
- `/legal/domain-rules`
- `/legal/whois-policy`
- `/legal/dns-policy`
- `/legal/abuse`
- `/legal/disclaimer`
- `/legal/cookies`
- `/legal/security`
- `/legal/refund`
- `/legal/registrant-agreement`
- `/legal/myid`
- `/legal/registrar`

Do not create a blog unless explicitly requested.

## Markdown Content

Formatted documentation and legal content must use Markdown typography.

Do not hard-code long legal documents directly inside React route components.

Organize Markdown content in an appropriate content directory and render it through a reusable Markdown/Typography system.

Legal and documentation pages should share a consistent layout and typography implementation.

Use shadcn-compatible styling.

## Auth Pages

Implement:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/verify-email/success`
- `/verify-email/expired`

Support:

- email/password
- GitHub OAuth

Do not duplicate authentication implementation outside Better Auth.

## Dashboard Pages

Implement the authenticated dashboard architecture including:

- `/dashboard`
- `/dashboard/domains`
- `/dashboard/domains/new`
- `/dashboard/domains/[domain]`
- `/dashboard/domains/[domain]/settings`
- `/dashboard/domains/[domain]/dns`
- `/dashboard/domains/[domain]/submissions`
- `/dashboard/domains/[domain]/activity`
- `/dashboard/requests`
- `/dashboard/requests/[request]`
- `/dashboard/whois`
- `/dashboard/contact`
- `/dashboard/api-tokens`
- `/dashboard/api-tokens/new`
- `/dashboard/sessions`
- `/dashboard/security`
- `/dashboard/settings`
- `/dashboard/settings/profile`
- `/dashboard/settings/account`
- `/dashboard/settings/email`

## Admin Pages

Administrators use the same dashboard architecture.

Implement admin functionality under the dashboard namespace, including:

- `/dashboard/admin`
- `/dashboard/admin/domains`
- `/dashboard/admin/domains/[domain]`
- `/dashboard/admin/requests`
- `/dashboard/admin/requests/[request]`
- `/dashboard/admin/users`
- `/dashboard/admin/users/[user]`
- `/dashboard/admin/contacts`
- `/dashboard/admin/whois`
- `/dashboard/admin/moderation`
- `/dashboard/admin/abuse`
- `/dashboard/admin/audit-logs`
- `/dashboard/admin/system`
- `/dashboard/admin/settings`

Do not expose these pages to normal users.

## API

The API must follow an OpenAPI-oriented architecture.

Implement:

- `/api/openapi.json`
- `/api/docs`
- `/api/health`
- `/api/v1`

Use consistent JSON response structures, validation, authentication, authorization, HTTP status codes, and error handling.

API routes must be thin.

API route handlers should:

1. parse the request
2. authenticate
3. validate input
4. invoke the appropriate service
5. return the response

They must not contain large business logic implementations.

## API Resources

Support API resources for:

- authentication/session information where appropriate
- user profile
- contact
- domains
- domain availability
- domain submission
- nameservers
- WHOIS
- API tokens
- admin domain management
- admin requests
- admin users
- abuse management
- audit logs

Use `/api/v1`.

## Validation

Use a consistent validation system.

Validation must occur at server boundaries.

Do not trust client-side validation.

Domain names, labels, nameservers, email addresses, API inputs, status transitions, and other externally supplied values must be validated server-side.

Validation schemas should be reusable and placed outside route/component files.

## Error Handling

Create a consistent application error model.

Do not expose internal stack traces, database errors, Cloudflare credentials, or sensitive implementation details to clients.

Use appropriate HTTP status codes.

Differentiate at least:

- authentication errors
- authorization errors
- validation errors
- not found
- conflict
- rate limiting
- external service errors
- internal errors

## Security

Apply secure defaults.

Pay particular attention to:

- authentication
- authorization
- API token storage
- session handling
- CSRF protections where applicable
- input validation
- domain ownership checks
- IDOR prevention
- admin authorization
- Cloudflare API credentials
- sensitive logging
- rate limiting
- abuse prevention

A user must only be able to manipulate domains that they own.

An administrator may manage domains and users according to the defined admin permissions.

Never trust a `user_id` supplied by the client when the authenticated identity can determine it.

## Domain Ownership Security

Every domain mutation must verify ownership or administrator authorization server-side.

For example, a request for:

`/dashboard/domains/example.der.my.id`

must not retrieve or mutate another user's domain merely because the requester knows the domain name.

The same rule applies to API endpoints.

## Email Verification

Email verification is handled by Better Auth.

Resend is the email delivery provider.

The application must require email verification where the product flow requires it.

Do not implement an independent authentication system that conflicts with Better Auth.

Do not duplicate Better Auth verification records.

## WHOIS

WHOIS is web-based and application-controlled.

There is no native WHOIS server requirement.

The WHOIS lookup should:

1. resolve the requested domain
2. determine the owning user
3. obtain the user's contact information
4. return the permitted registration/contact information

Do not create a separate WHOIS database.

Respect privacy and the application's published WHOIS policy.

## Code Organization

Use clear separation such as:

- `app/**` — routes and route-level composition
- `components/**` — UI and page sections
- `hooks/**` — reusable client-side hooks
- `lib/repository/**` — database persistence
- `lib/service/**` — business/application services
- `lib/cloudflare/**` — Cloudflare integration
- `lib/auth/**` — authentication/authorization infrastructure
- `lib/validation/**` — validation schemas
- `types/**` — shared types
- database schema/migrations — appropriate Drizzle structure

Do not blindly follow these exact subdirectories if the existing starter already has a better equivalent. Preserve consistency with the repository.

## Component Rules

Components should remain composable.

Avoid giant components.

A page should be assembled from sections.

A section should be assembled from smaller reusable components when necessary.

Do not place database access in React components.

Do not place Cloudflare API calls in React components.

Do not place authorization decisions that affect security only in React components.

## Styling

Use the existing shadcn design system.

Do not introduce another UI framework.

Do not replace the existing shadcn preset.

Do not modify the existing primitive implementation to achieve application styling.

Use Tailwind/shadcn conventions already present in the repository.

Maintain visual consistency across public pages, authentication pages, dashboard pages, admin pages, and documentation/legal pages.

## Responsive Design, Themes, and Icons

### Responsive / Mobile-First Design

The entire application must be responsive and mobile-friendly.

Design and implement every page for multiple viewport sizes, including:

- mobile phones
- small tablets
- large tablets
- laptops
- desktop monitors
- large/high-resolution displays

Use the existing Tailwind CSS responsive utilities and shadcn/ui conventions.

Do not design only for desktop and add mobile support as an afterthought.

Every major UI section must be checked for:

- narrow viewport layout
- responsive spacing
- responsive typography
- responsive grids
- responsive flex layouts
- navigation behavior
- table overflow or mobile alternatives
- form layout
- dialog/sheet behavior
- long text wrapping
- buttons and controls
- dashboard sidebar behavior
- header behavior
- documentation/legal content width

Avoid fixed widths that can cause horizontal overflow.

Prefer responsive constraints such as:

- `w-full`
- `max-w-*`
- responsive grid columns
- responsive flex direction
- responsive padding/margins
- appropriate overflow handling

Do not use JavaScript viewport detection when CSS responsive behavior is sufficient.

The UI must remain usable without horizontal scrolling at common mobile viewport widths.

### Dashboard Responsiveness

The dashboard must support mobile and desktop layouts.

The desktop sidebar must not simply remain fixed and overflow the mobile viewport.

Use appropriate responsive shadcn components such as Sheet/Drawer patterns when necessary.

Dashboard tables must be responsive.

When a table cannot reasonably fit on a small viewport, use an appropriate responsive presentation rather than allowing the entire application viewport to overflow horizontally.

### Theme System

Implement light/dark theme support using the project's existing theme infrastructure and the standard Next.js-compatible theme approach already available in the starter.

The application must support:

- light
- dark
- system

The default behavior should respect the user's system preference when no explicit theme has been selected.

Use a theme switcher based on the shadcn `ToggleGroup` primitive.

The theme switcher should provide the available theme modes through the appropriate `ToggleGroup`/`ToggleGroupItem` components.

Do not implement a custom theme-switching control when the existing shadcn ToggleGroup can be used.

Do not manually modify the shadcn ToggleGroup primitive.

Ensure theme switching works correctly across:

- public pages
- authentication pages
- dashboard pages
- admin pages
- documentation
- legal pages

Avoid hydration mismatches caused by theme detection.

Follow the existing project's Next.js/vinext-compatible theme provider pattern.

Do not introduce a second theme system if the starter already provides one.

### Brand Icons

Use `@icon-packs/react-simple-icons` for brand/company/service icons whenever a corresponding Simple Icons icon exists.

This applies to brands and services such as:

- GitHub
- Cloudflare
- Resend
- other external providers or technologies represented in the UI

Do not manually draw SVG brand logos.

Do not create custom brand icon components when the corresponding icon is available from `@icon-packs/react-simple-icons`.

Use the existing icon package consistently throughout the application.

For generic interface icons, continue using the project's existing icon system and shadcn-compatible icon conventions.

Brand icons and generic UI icons are separate concerns.

### Primitive Styling Restrictions

The shadcn/ui primitives and other imported UI primitives have already been configured through the project's existing preset.

When importing or using an existing primitive, do not override or customize its preset-defined visual styling.

This includes, but is not limited to:

- colors
- background colors
- text colors
- borders
- border colors
- border radius / rounded corners
- shadows
- typography
- component dimensions
- visual states
- hover styles
- focus styles
- active styles
- disabled styles

Do not add custom CSS classes merely to change the visual appearance of an imported primitive.

Do not modify primitive source files to achieve application-specific styling.

The existing preset is the source of truth for primitive styling.

Customization is allowed at the page or layout composition level when it is required for the page structure or responsive layout. For example:

- page-level spacing
- section spacing
- content width and `max-w-*`
- page-level grid/flex layout
- responsive positioning
- page-level padding and margins
- section arrangement
- page-level background/layout composition when appropriate

Page/layout customization must not be used to override the visual design of individual primitives.

When a primitive does not visually match the intended page, first compose it using its existing API, variants, slots, and supported props. Do not introduce custom CSS to override the preset.

Do not introduce arbitrary Tailwind values such as arbitrary colors, custom border radii, custom borders, or custom shadows for primitives unless they are explicitly required by an existing project convention.

The goal is to preserve the design system established by the preset and prevent visual drift between components.

## Static and Dynamic Rendering

Use server/client boundaries deliberately.

Do not mark an entire page as client-side merely because one small section needs interactivity.

Keep static content server-rendered where possible.

Use client components only when browser-side interactivity actually requires them.

## Before Editing

First inspect:

- `package.json`
- lockfile
- existing `app`
- existing `components`
- existing `hooks`
- existing `lib`
- existing `types`
- existing Drizzle configuration
- existing Better Auth configuration
- existing D1 bindings/configuration
- existing shadcn configuration
- vinext configuration
- existing proxy implementation
- environment variable definitions
- existing migrations
- existing tests

Determine what already works before adding replacements.

## Dependency Rule

Do not install a new package if the existing stack already provides the required capability.

If a missing dependency is genuinely necessary, verify compatibility with vinext, Cloudflare Workers/D1, and the current project versions before adding it.

Do not replace established dependencies without a concrete reason.

## Implementation Strategy

Implement the system incrementally.

Recommended order:

1. inspect the repository
2. preserve and verify the existing starter
3. establish database schema and Drizzle configuration
4. establish Better Auth and authentication boundaries
5. establish centralized authorization
6. establish repository layer
7. establish service layer
8. establish Cloudflare integration
9. establish API authentication
10. establish OpenAPI structure
11. establish public layouts and pages
12. establish authentication pages
13. establish dashboard architecture
14. establish admin dashboard functionality
15. establish WHOIS
16. establish documentation/legal Markdown rendering
17. establish error handling
18. establish validation
19. establish tests
20. run type checking, linting, tests, and production/build validation

Do not implement a fake backend merely to make the UI appear functional.

All important functionality must connect to the actual D1/Drizzle/Better Auth/Cloudflare architecture.

## Quality Requirements

Before considering the implementation complete:

- TypeScript must type-check.
- Drizzle schema must be valid.
- D1-compatible database operations must work.
- Better Auth must work with the configured D1 database.
- Email/password authentication must work.
- GitHub OAuth integration must be correctly wired.
- Email verification must use Resend through the configured integration.
- Web sessions must be protected.
- API bearer authentication must be protected.
- Admin authorization must be enforced server-side.
- Domain ownership must be enforced server-side.
- Cloudflare operations must be isolated from UI/routes.
- API routes must remain thin.
- Frontend route files must remain orchestrators.
- Business logic must not be embedded in components.
- Existing shadcn primitives must remain untouched unless absolutely necessary.
- Legal and documentation pages must use Markdown typography.
- No unnecessary blog implementation should be added.
- No DNS record storage should be introduced.
- No unnecessary role should be introduced.

After implementation, inspect the final diff and remove duplicated logic, dead code, unnecessary dependencies, and accidental primitive modifications.

Do not merely make the project compile. Preserve the architecture and constraints defined above.
