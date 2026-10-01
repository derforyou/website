# DERforyou

DERforyou is a developer-domain service with a public landing page, account flows, domain workspace, and service policies. It is built with React Router, Cloudflare Pages, D1, Tailwind CSS v4, and shadcn/ui using the Radix base.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

The development server is available at `http://localhost:5173`.

Useful commands:

```bash
npm run build
npm run typecheck
npm run db:migrate:local
npm run deploy
```

Set local values in `.env`. Configure production secrets and bindings in Cloudflare Pages. Required environment keys are listed in `.env.example`.

## Application routes

- `/` is the public DERforyou landing page.
- `/legal/*` contains the Privacy Policy, Terms, Acceptable Use Policy, Domain Policy, and abuse-reporting information.
- `/auth/*` contains sign-in, account creation, and verification screens.
- `/dashboard/*` contains all workspace routes: overview, domains, registration, settings, contact profile, and API keys.

Authenticated route modules live under `app/routes/dashboard/`. The parent `/dashboard` route is the natural boundary for Better Auth session middleware.

## Authentication and data

Better Auth uses D1, email one-time codes, and optional GitHub OAuth when credentials are configured. Verification mail is sent through Resend with Brevo as a fallback. Cloudflare services provide hosting, database, and DNS integration points.

The current domain-registration, API-key management, and profile-editing screens are presentation-only and are not yet connected to route actions. Do not treat a hostname preview as an availability check or reservation.

## UI and styling

The project uses the shadcn CLI configuration in `components.json`, the CLI-generated `app/global.css`, Tailwind CSS v4's Vite plugin, and Radix-based shadcn components. Add UI components with:

```bash
npx shadcn@latest add <component>
```

## Legal readiness

The published policy pages describe the current code-level data flows and service rules. Have Indonesian counsel review them against the operating entity, production retention/deletion procedures, Cloudflare configuration, and actual domain eligibility or suspension practices before relying on them as final legal terms. No policy can guarantee that a domain or service will never be blocked.
