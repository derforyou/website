# AGENTS.md

## Project

This repository contains the full-stack `der.my.id` domain service.

The service provides free `<name>.der.my.id` domain registration, domain ownership management, DNS delegation, WHOIS lookup, user authentication, API access, and administrative management.

## Stack

- vinext
- App Router
- TypeScript
- Better Auth
- Cloudflare D1
- Drizzle ORM
- shadcn/ui
- Resend (primary email provider) and Brevo (fallback email provider)
- Cloudflare API
- OpenAPI

## Non-Negotiable Architecture Rules

### Route Files

Route files are orchestrators.

Do not implement complete pages directly inside route files.

Frontend routes must compose section components.

Example:

`app/(public)/page.tsx`

should compose:

`components/home/**`

Route files must not contain substantial:

- business logic
- database queries
- API calls
- Cloudflare operations
- authentication implementation
- authorization implementation
- validation schemas
- complex calculations
- reusable hooks
- reusable types

### App Router Route Groups

Organize routes by application area using these route groups:

- `app/(public)/**` — public pages, including the home page at `app/(public)/page.tsx`
- `app/(auth)/**` — login, registration, password recovery, and email verification pages
- `app/(dashboard)/dashboard/**` — authenticated user and admin dashboard pages
- `app/api/**` — API route handlers, including Better Auth and versioned API endpoints

Parenthesized route group names are organizational only and do not appear in URLs. For example, `app/(public)/about/page.tsx` maps to `/about`, while `app/(auth)/login/page.tsx` maps to `/login`.

Keep the single dashboard architecture: admin pages belong under `app/(dashboard)/dashboard/admin/**` and map to `/dashboard/admin/**`. Do not create a separate top-level admin dashboard.

Use the following layout responsibilities:

- `app/layout.tsx` is the required root layout. It owns `<html>`, `<body>`, global CSS, metadata, and providers shared by the whole application. Do not put area-specific navigation or page shells here.
- `app/(public)/layout.tsx` owns the shared public-site shell, such as public navigation and footer. It wraps public pages only.
- `app/(auth)/layout.tsx` owns the shared authentication-page shell. Keep it focused on the auth experience and do not include the public-site or dashboard navigation.
- `app/(dashboard)/layout.tsx` owns the authenticated dashboard shell shared by user and admin pages, such as dashboard navigation and sidebar. Admin pages remain within this same shell.
- `app/api/**` contains handlers and does not need a visual layout. Keep request authentication and authorization at the appropriate server boundaries.

Layouts compose presentation and shared providers; they must not contain business workflows. A dashboard layout or proxy check must not replace server-side authorization in protected operations and services.

Keep public, auth, and dashboard page sections in their corresponding `components/**` areas. Keep API handlers thin and delegate server-side work to services and repositories.

### Frontend Sections

Major pages must be split into page-specific sections.

Use structures such as:

`components/home/**`

`components/about/**`

`components/dashboard/**`

`components/domains/**`

`components/admin/**`

Keep components focused and composable.

Do not create unnecessarily large components.

## UI Rules

The application UI uses shadcn/ui.

Use existing shadcn components instead of implementing equivalent UI primitives manually.

Do not introduce another UI component framework.

Do not manually modify existing shadcn primitives.

The existing shadcn preset and primitives are considered fixed.

If a primitive-related error occurs, first fix:

- its usage
- props
- types
- composition
- state
- wrapper components
- calling code

Only modify a primitive when the primitive implementation itself is demonstrably the root cause and there is no correct application-level solution.

Do not redesign the existing shadcn preset.

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
- legal content width

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
- legal pages

Avoid hydration mismatches caused by theme detection.

Follow the existing project's Next.js/vinext-compatible theme provider pattern.

Do not introduce a second theme system if the starter already provides one.

### Primitive Styling Restrictions

All shadcn/ui primitives and other imported UI primitives are already configured by the project's existing preset.

When using an existing primitive, do not override its preset-defined visual styling.

Do not customize primitive:

- colors
- backgrounds
- text colors
- borders
- border colors
- border radius / rounded corners
- shadows
- typography
- dimensions
- hover states
- focus states
- active states
- disabled states

Do not add custom CSS classes to change the visual appearance of an imported primitive.

Do not modify primitive source files to achieve application-specific styling.

The existing preset is the source of truth for primitive styling.

Customization is permitted at the page or layout composition level for structural and responsive purposes, including:

- page-level spacing
- section spacing
- content width
- `max-w-*`
- page-level grid/flex layouts
- responsive positioning
- page-level padding and margins
- section arrangement
- page/layout background composition when appropriate

Do not use page/layout customization as a way to override the visual design of individual primitives.

When a primitive needs to be used differently, prefer its existing API, variants, slots, and supported props rather than custom CSS.

Do not introduce arbitrary Tailwind values for primitive styling, including arbitrary colors, custom border radii, custom borders, or custom shadows, unless explicitly required by an existing project convention.

Preserve the design system established by the preset and prevent visual inconsistencies between primitives.

## Native HTML

Do not use native HTML controls when an appropriate shadcn component exists.

Examples:

- use `Button` instead of a custom button
- use `Input` instead of a custom input
- use `Select` instead of a custom select
- use `Dialog` instead of a custom dialog
- use `DropdownMenu` instead of a custom dropdown
- use `Tabs` instead of a custom tab implementation
- use `Card` where card UI is appropriate

Semantic HTML may be used for document structure when there is no corresponding UI primitive.

## Code Organization

The repository uses these primary directories:

- `app` — routes and route-level composition
- `components` — UI and page sections
- `hooks` — reusable client-side hooks
- `lib` — server-side infrastructure, repositories, services, integrations, utilities
- `types` — shared TypeScript types

Recommended `lib` organization:

- `lib/repository` — database persistence
- `lib/service` — business/application logic
- `lib/auth` — authentication and authorization infrastructure
- `lib/cloudflare` — Cloudflare integration
- `lib/validation` — reusable validation schemas

Follow the existing repository structure when it already provides an equivalent organization.

## Server-Side Logic

Server-side business logic must not be implemented directly in route handlers or UI components.

Use:

`route/API → service → repository/integration`

Repositories are responsible for persistence.

Services are responsible for business workflows and rules.

External integrations are isolated behind dedicated modules.

Do not duplicate business logic across routes.

## Database

The database is Cloudflare D1.

Drizzle ORM is the database abstraction and schema system.

Database naming uses lowercase snake_case.

The database stores:

- users
- Better Auth accounts
- Better Auth sessions
- verification records
- API tokens
- contacts
- domain ownership
- domain submissions
- custom nameservers
- domain lifecycle events
- audit logs

The database does not store DNS records.

Do not create a generic DNS record table.

Cloudflare is the source of truth for DNS records.

## Domain Model

A domain represents:

`<label>.der.my.id`

Domain ownership is represented by:

`domain → user → contact`

A contact belongs to a user and is not directly attached to a domain.

Do not create `domain_contact` unless the data model is explicitly changed in the future.

## Domain Status

Supported domain lifecycle statuses:

- `pending`
- `approved`
- `rejected`
- `suspended`
- `revoked`

Status transitions must be implemented in the service layer.

Do not implement status-transition rules independently in frontend components or API routes.

## DNS Modes

A domain supports:

- `shared`
- `custom`

`shared` means the domain uses the service's shared `der.my.id` DNS infrastructure.

`custom` means the domain uses delegated custom nameservers.

Only nameserver information is stored in D1.

DNS records are never stored in D1.

Switching from `custom` to `shared` must:

1. remove the domain's custom nameservers from D1
2. remove the corresponding Cloudflare delegation/NS records
3. restore shared DNS mode

These operations belong in server-side services.

## Cloudflare

Cloudflare API operations must not be performed directly from React components.

Do not put Cloudflare API calls directly inside frontend routes.

Do not duplicate Cloudflare API integration between endpoints.

Use `lib/cloudflare/**` and service-layer functions.

Cloudflare credentials must remain server-side.

## Authentication

Better Auth is the authentication system.

Supported authentication methods:

- email/password
- GitHub OAuth

Use Resend as the primary email provider and Brevo as the fallback for transactional email, including Better Auth verification and password-reset messages.

### Email Delivery Failover

Route email through one server-side delivery service (for example, `lib/email/**`) with separate provider-specific adapters. Wire Better Auth email callbacks through this service; do not replace or duplicate Better Auth.

For each message, attempt Resend once. If the provider request fails, including a network/API error or rate/quota limit, make at most one direct fallback attempt with Brevo. If Resend succeeds, do not send through Brevo. Validate the recipient and message before provider dispatch so invalid input does not trigger fallback.

The Brevo fallback must call its provider adapter directly, not the shared dispatcher. Do not recursively invoke the dispatcher or retry either provider from the fallback path. If both providers fail, stop and return a sanitized failure; log provider outcomes without credentials or message secrets. This limits a send operation to at most two provider attempts and prevents an unbounded retry loop.

Do not implement a second authentication system beside Better Auth.

### Web Authentication

Web authentication uses Better Auth database-backed sessions.

### API Authentication

API authentication uses bearer tokens.

API tokens must be stored securely as hashes.

Never persist the raw bearer token after token creation.

Web sessions and API bearer tokens are separate authentication mechanisms.

## Authorization

There are exactly two application roles:

- `user`
- `admin`

Do not introduce additional application roles without an explicit requirement.

A normal customer is a `user`.

An administrator is an `admin`.

Authorization must be enforced server-side.

Frontend navigation visibility is not an authorization mechanism.

Every protected server operation must independently enforce authentication and authorization.

## Dashboard

There is one dashboard architecture:

`/dashboard`

Do not create separate top-level user and admin dashboards.

Administrators use the same dashboard and receive additional admin navigation and functionality.

Normal users must not be able to access admin routes or operations.

Admin authorization must be enforced at the server boundary and service layer.

## Guards

Use centralized authentication and authorization helpers.

The application should provide reusable mechanisms for:

- requiring an authenticated user
- requiring verified email when applicable
- requiring an administrator
- resolving the current Better Auth session
- authenticating API bearer tokens
- resolving the API user

Do not scatter raw role checks throughout the application.

Do not rely exclusively on proxy protection.

Authorization must also be enforced at the actual protected resource/service.

## Vinext Proxy

Use vinext's supported proxy mechanism for lightweight request-level concerns where appropriate.

Suitable responsibilities include:

- authentication boundary handling
- protected-route redirects
- authentication-page redirects
- request-level security handling
- lightweight API request handling

Do not place business logic, database queries, domain operations, or Cloudflare API calls in the proxy.

Proxy checks are not a replacement for server-side authorization.

## API

The API uses:

`/api/v1`

The API follows OpenAPI conventions.

Required infrastructure includes:

- `/api/openapi.json`
- `/api/docs`
- `/api/health`
- `/api/v1`

API route handlers must remain thin.

An API route should generally:

1. authenticate
2. validate input
3. call a service
4. format the response

Do not put database workflows or large business operations directly in API routes.

## API Security

API endpoints must:

- authenticate bearer tokens
- validate input
- enforce ownership
- enforce admin authorization
- return appropriate HTTP status codes
- avoid leaking internal errors
- avoid leaking secrets
- avoid trusting client-supplied ownership identifiers

Never allow a user to access another user's domain by manipulating an ID or domain parameter.

## Validation

Validation belongs at server boundaries and in reusable validation modules.

Do not rely on client-side validation.

Validate:

- domain labels
- full domain names
- nameservers
- email addresses
- API inputs
- submission data
- status transitions
- administrative actions

Avoid duplicating the same validation rules in multiple locations.

## WHOIS

The service provides application-level WHOIS lookup.

A native WHOIS server is not required.

WHOIS resolution follows:

`domain → user → contact`

Do not create a separate WHOIS database.

Only information permitted by the application's WHOIS policy should be exposed publicly.

## Static Content

Legal pages should use Markdown-based content.

Do not place long legal documents directly inside React route files.

Use a shared Markdown/Typography rendering system for legal pages.

Relevant content includes:

- Terms of Service
- Privacy Policy
- Acceptable Use Policy
- Domain Policy
- Domain Rules
- WHOIS Policy
- DNS Policy
- Abuse Policy
- Disclaimer
- Cookie Policy
- Security Policy
- Refund Policy
- Registrant Agreement
- `.my.id` terms
- registrar/registry information

Do not add a blog unless explicitly requested.

## Public Pages

The public application includes:

- `/`
- `/about`
- `/contact`
- `/status`
- `/domains`
- `/domains/check`
- `/whois`
- `/whois/[domain]`
- `/faq`
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

## Authentication Pages

Authentication pages include:

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/verify-email/success`
- `/verify-email/expired`

## User Dashboard

Authenticated functionality includes:

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

## Admin Dashboard

Admin functionality remains inside the same dashboard architecture:

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

All admin operations require server-side admin authorization.

## Component Responsibilities

Components are responsible for:

- presentation
- composition
- local UI interaction
- calling hooks
- displaying server-provided data

Components are not responsible for:

- database access
- Cloudflare API calls
- authentication implementation
- authorization implementation
- complex business rules
- repository operations
- service workflows

## Hooks

Reusable client-side logic belongs in:

`hooks/**`

Do not define reusable hooks directly inside route files or unrelated components.

## Types

Shared types belong in:

`types/**`

Avoid duplicated type definitions.

Prefer inferred Drizzle types when appropriate.

## Error Handling

Use consistent application errors.

Do not expose:

- stack traces
- database internals
- Cloudflare credentials
- authentication secrets
- internal implementation details

Use appropriate HTTP status codes for API responses.

## Security Principles

Always enforce:

- authentication
- authorization
- domain ownership
- server-side validation
- secure API token storage
- secure session handling
- IDOR protection
- admin protection
- secret isolation
- safe error handling
- abuse prevention
- appropriate rate limiting

Never trust client-supplied identity or ownership data when the server can derive it from the authenticated context.

## Dependencies

Do not add dependencies unnecessarily.

Before adding a package:

1. check whether the existing stack already provides the capability
2. verify compatibility with vinext
3. verify Cloudflare Workers/D1 compatibility
4. verify compatibility with the current project versions

Do not replace existing dependencies without a concrete technical reason.

## Existing Starter

Before making architectural changes:

1. inspect the existing repository
2. inspect the package manifest and lockfile
3. inspect the existing routes
4. inspect existing components
5. inspect Better Auth configuration
6. inspect D1 configuration
7. inspect Drizzle configuration and migrations
8. inspect shadcn configuration and primitives
9. inspect vinext configuration
10. inspect proxy configuration
11. inspect environment configuration

Preserve working infrastructure.

Do not recreate functionality that already exists.

## Testing and Verification

Before completing a change:

- run TypeScript type checking
- run linting
- run relevant tests
- run Drizzle/database validation where applicable
- verify the vinext build
- verify Cloudflare/D1 compatibility
- inspect the final diff

Check specifically for:

- accidental primitive modifications
- business logic inside route files
- business logic inside UI components
- duplicated authentication logic
- duplicated authorization logic
- direct database access from components
- direct Cloudflare access from components
- missing ownership checks
- missing admin checks
- raw API token storage
- unnecessary dependencies
- unnecessary client components

## General Rule

Prefer simple, explicit, maintainable architecture.

Keep routes thin.

Keep components focused.

Keep business logic in services.

Keep persistence in repositories.

Keep external integrations isolated.

Keep authentication centralized.

Keep authorization server-side.

Keep database schema in Drizzle.

Keep DNS records out of D1.

Keep shadcn primitives untouched.
