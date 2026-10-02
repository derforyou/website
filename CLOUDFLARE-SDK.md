# Cloudflare SDK

This project uses the official `cloudflare` TypeScript SDK for all Cloudflare API operations.

Installed package:

```text
cloudflare@7.2.0
```

The SDK is the required abstraction layer between the application and the Cloudflare REST API.

## Core Rule

All Cloudflare API operations must use the official TypeScript SDK.

Do not manually construct Cloudflare API URLs.

Do not use:

```text
https://api.cloudflare.com/client/v4
```

directly in application code.

Do not implement Cloudflare API requests using raw `fetch()`.

Do not implement custom HTTP clients for Cloudflare API operations.

Use the SDK client and its typed resources instead.

Cloudflare's official TypeScript SDK provides typed request parameters and response types for the Cloudflare API. 

---

## Client

Create the Cloudflare client through the project's Cloudflare integration layer.

Recommended location:

```text
lib/
└── cloudflare/
    ├── client.ts
    ├── zones.ts
    ├── dns.ts
    ├── accounts.ts
    └── ...
```

The application must not instantiate `Cloudflare` directly throughout services, repositories, API routes, or components.

Use a centralized client:

```ts
import Cloudflare from "cloudflare";

export const cloudflare = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});
```

The exact client location may be changed if the project architecture requires it, but there must be a single reusable Cloudflare client abstraction.

---

## Authentication

Use a server-side Cloudflare API token.

Environment variable:

```env
CLOUDFLARE_API_TOKEN=
```

Never expose the token to client-side code.

Never use:

```text
NEXT_PUBLIC_CLOUDFLARE_API_TOKEN
PUBLIC_CLOUDFLARE_API_TOKEN
VITE_CLOUDFLARE_API_TOKEN
```

or any other public/client-exposed environment variable.

The Cloudflare SDK accepts `CLOUDFLARE_API_TOKEN` through its client configuration. 

---

## Account ID

When an operation requires an account ID, use the application's server-side configuration.

Example:

```env
CLOUDFLARE_ACCOUNT_ID=
```

Do not hardcode account IDs inside application logic.

Example:

```ts
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!accountId) {
  throw new Error("CLOUDFLARE_ACCOUNT_ID is not configured");
}
```

---

## Zone ID

Zone IDs must be obtained through Cloudflare configuration or the SDK.

Do not hardcode a zone ID unless it is intentionally part of immutable project configuration.

For a fixed `der.my.id` zone, it is acceptable to configure:

```env
CLOUDFLARE_ZONE_ID=
```

Example:

```ts
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

if (!zoneId) {
  throw new Error("CLOUDFLARE_ZONE_ID is not configured");
}
```

---

## SDK Usage

Use SDK resources directly.

Example:

```ts
import { cloudflare } from "./client";

const zones = await cloudflare.zones.list();
```

Example with a zone:

```ts
const zone = await cloudflare.zones.get({
  zone_id: zoneId,
});
```

Example DNS operation:

```ts
const records = await cloudflare.dns.records.list({
  zone_id: zoneId,
});
```

Use the SDK's typed request parameters instead of manually constructing request bodies.

---

## Cloudflare Integration Architecture

Cloudflare integrations must remain on the server side.

Recommended dependency direction:

```text
API Route / Server Action
        ↓
Service
        ↓
Cloudflare Integration
        ↓
Cloudflare SDK
        ↓
Cloudflare API
```

For example:

```text
app/api/v1/domains/...
        ↓
lib/service/domain-service.ts
        ↓
lib/cloudflare/dns.ts
        ↓
lib/cloudflare/client.ts
        ↓
cloudflare package
```

Frontend components must never call the Cloudflare API directly.

Client components must never import the `cloudflare` package.

---

## Cloudflare Integration Modules

Cloudflare functionality should be separated by responsibility.

Recommended structure:

```text
lib/cloudflare/
├── client.ts
├── accounts.ts
├── zones.ts
├── dns.ts
├── nameservers.ts
├── pages.ts
├── workers.ts
├── r2.ts
├── kv.ts
└── ...
```

Only create modules for Cloudflare resources actually used by the application.

Do not create unnecessary wrappers around every SDK method.

The integration layer should provide application-oriented operations rather than simply duplicating the entire Cloudflare SDK.

---

## DNS

Cloudflare is the source of truth for DNS records.

The application database must not contain a DNS record table.

DNS operations must use the Cloudflare SDK.

Examples:

```ts
cloudflare.dns.records.list(...)
cloudflare.dns.records.create(...)
cloudflare.dns.records.update(...)
cloudflare.dns.records.delete(...)
```

Do not implement DNS operations using raw HTTP requests.

Do not create:

```ts
fetch("https://api.cloudflare.com/client/v4/zones/...")
```

or equivalent manual URL construction.

---

## Zone Management

Zone operations must use the SDK:

```ts
cloudflare.zones.list(...)
cloudflare.zones.get(...)
cloudflare.zones.create(...)
cloudflare.zones.update(...)
cloudflare.zones.delete(...)
```

Use the SDK's generated request and response types.

---

## Nameservers

Custom nameserver and delegation operations must use the appropriate Cloudflare SDK resource.

The application database may store the desired/configured nameservers in:

```text
domain_nameserver
```

but Cloudflare remains the infrastructure source of truth.

The application must synchronize database state and Cloudflare state through the service layer.

---

## Type Safety

Prefer the generated Cloudflare SDK types.

Example:

```ts
import Cloudflare from "cloudflare";

const params: Cloudflare.ZoneCreateParams = {
  account: {
    id: accountId,
  },
  name: "example.com",
  type: "full",
};
```

Do not recreate Cloudflare request or response interfaces manually when an SDK type already exists.

Avoid:

```ts
type CloudflareZone = {
  id: string;
  name: string;
};
```

when the SDK already provides the corresponding Cloudflare type.

The SDK's request and response types are generated from Cloudflare's API specification. 

Application-specific types may still be created when transforming Cloudflare data into an internal domain model.

---

## Error Handling

Cloudflare SDK errors must be handled by the Cloudflare integration/service layer.

Do not expose raw SDK errors directly to clients.

Bad:

```ts
return Response.json(error);
```

Preferred:

```text
Cloudflare SDK error
        ↓
Cloudflare integration
        ↓
Application service
        ↓
Application error
        ↓
API error response
```

The public API should return the application's standardized error format.

---

## Retries and Rate Limits

Do not implement arbitrary retry loops in individual API routes.

If retry behavior is required, centralize it in the Cloudflare integration layer.

Cloudflare API errors must be distinguishable from application validation errors.

Do not retry:

- invalid authentication
- invalid authorization
- invalid request parameters
- missing resources
- permanent configuration errors

Transient failures may be retried when appropriate.

---

## Logging

Do not enable verbose Cloudflare SDK logging in production unless explicitly required.

The SDK supports configurable log levels, including:

```text
debug
info
warn
error
off
```

The default warning-level behavior should generally be retained. 

Never log:

- API tokens
- authorization headers
- secrets
- sensitive request payloads
- sensitive Cloudflare credentials

The Cloudflare SDK documentation specifically warns that debug logging can include HTTP request/response headers and bodies. 

---

## Raw API Access

Raw HTTP access to Cloudflare is prohibited for normal application development.

Do not write:

```ts
fetch("https://api.cloudflare.com/client/v4/...");
```

Do not write:

```ts
const baseUrl = "https://api.cloudflare.com/client/v4";
```

Do not create:

```ts
cloudflareFetch(...)
cloudflareRequest(...)
cloudflareApi(...)
```

as a replacement for the official SDK.

If an undocumented Cloudflare API endpoint is genuinely required, first verify whether the installed SDK version already exposes the resource.

The official SDK supports custom/undocumented requests when necessary, so this should remain an SDK-level operation rather than a manually implemented HTTP client. 

---

## SDK Version

The project currently uses:

```json
{
  "cloudflare": "^7.2.0"
}
```

Do not rely on internal SDK paths.

Use public package exports.

For example:

```ts
import Cloudflare from "cloudflare";
```

Do not import internal implementation files unless explicitly required by the official SDK documentation.

Cloudflare SDK `7.x` reorganized several internal exports, including replacing `APIClient` with `BaseCloudflare`. Application code should therefore avoid depending on internal SDK implementation details. 

---

## Runtime

The Cloudflare TypeScript SDK supports server-side TypeScript/JavaScript and Cloudflare Workers. 

Cloudflare credentials and privileged API operations must remain server-side.

Do not bundle privileged Cloudflare API credentials into browser/client code.

---

## Tree-Shakable Client

For performance-sensitive environments, the SDK provides a tree-shakable client:

```ts
import { createClient } from "cloudflare/tree-shakable";
```

Only use the tree-shakable client when there is a concrete bundle-size or dependency reason.

The standard client is preferred for normal server-side application code because it provides the complete typed Cloudflare API surface.

---

## Cloudflare API Scope

Any Cloudflare operation required by the application must first be checked against the installed SDK.

Relevant project operations may include:

- account management
- zone lookup
- zone management
- DNS record management
- nameserver/delegation management
- Workers
- R2
- KV
- Pages
- Cloudflare API configuration
- other Cloudflare resources required by the application

Use the corresponding SDK resource instead of manually accessing the REST API.

---

## Rule for New Cloudflare Features

When implementing a new Cloudflare feature:

1. Check whether the installed `cloudflare` SDK exposes the required resource.
2. Use the SDK resource and generated types.
3. Add an integration module under `lib/cloudflare/` when appropriate.
4. Keep Cloudflare API calls out of routes and UI components.
5. Keep credentials server-side.
6. Convert Cloudflare-specific errors into application-level errors.
7. Never manually construct `https://api.cloudflare.com/client/v4` URLs.

The official Cloudflare SDK is the required API boundary for this project.
