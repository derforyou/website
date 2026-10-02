# Database

Database schema and data model for the `der.my.id` domain service.

The application uses **Cloudflare D1** with **Drizzle ORM**.

## Design Principles

- Database is the source of truth for application users, authentication, domains, submissions, ownership, and audit history.
- Cloudflare is the source of truth for DNS records and DNS infrastructure.
- DNS records must **not** be stored in the database.
- WHOIS is a web-only application feature. There is no native WHOIS server.
- Domain ownership is resolved through `domain → user → contact`.
- Custom nameservers are stored in the database because they represent domain delegation configuration.
- API tokens are stored only as hashes. Raw bearer tokens must never be stored.
- All timestamps should use a consistent UTC representation.
- Database identifiers should use stable unique IDs.
- Table and column names use `snake_case`.

---

## Entities

### `user`

Application users and their authorization state.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique user identifier |
| `name` | text | No | — | User display name |
| `email` | text | No | — | User email address |
| `email_verified` | boolean | No | `false` | Whether the email address has been verified |
| `image` | text | Yes | `NULL` | Optional profile image URL |
| `role` | text | No | `user` | Application role: `user` or `admin` |
| `status` | text | No | `active` | Account status: `active`, `suspended`, or `banned` |
| `created_at` | timestamp | No | — | Account creation timestamp |
| `updated_at` | timestamp | No | — | Last account update timestamp |

---

### `account`

Better Auth account records.

Supports password authentication and GitHub OAuth.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique account identifier |
| `user_id` | text | No | — | References `user.id` |
| `account_id` | text | No | — | Provider-specific account identifier |
| `provider_id` | text | No | — | Authentication provider, e.g. `credential` or `github` |
| `access_token` | text | Yes | `NULL` | OAuth access token |
| `refresh_token` | text | Yes | `NULL` | OAuth refresh token |
| `access_token_expires_at` | timestamp | Yes | `NULL` | OAuth access token expiration |
| `refresh_token_expires_at` | timestamp | Yes | `NULL` | OAuth refresh token expiration |
| `scope` | text | Yes | `NULL` | OAuth scope |
| `password` | text | Yes | `NULL` | Password hash for credential authentication |
| `created_at` | timestamp | No | — | Account creation timestamp |
| `updated_at` | timestamp | No | — | Last account update timestamp |

---

### `session`

Better Auth web session records.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique session identifier |
| `user_id` | text | No | — | References `user.id` |
| `token` | text | No | — | Session token |
| `expires_at` | timestamp | No | — | Session expiration timestamp |
| `ip_address` | text | Yes | `NULL` | Client IP address |
| `user_agent` | text | Yes | `NULL` | Client user agent |
| `created_at` | timestamp | No | — | Session creation timestamp |
| `updated_at` | timestamp | No | — | Last session update timestamp |

---

### `verification`

Better Auth verification records.

Used for operations such as email verification and other verification flows.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique verification identifier |
| `identifier` | text | No | — | Verification target identifier |
| `value` | text | No | — | Verification value/token |
| `expires_at` | timestamp | No | — | Verification expiration timestamp |
| `created_at` | timestamp | No | — | Verification creation timestamp |
| `updated_at` | timestamp | No | — | Last verification update timestamp |

---

### `api_token`

API bearer tokens for programmatic access.

Only a cryptographic hash of the token is stored.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique token identifier |
| `user_id` | text | No | — | References `user.id` |
| `name` | text | No | — | User-defined token name |
| `token_hash` | text | No | — | Hash of the bearer token |
| `token_prefix` | text | No | — | Non-secret token prefix for identification |
| `last_used_at` | timestamp | Yes | `NULL` | Last time the token was used |
| `expires_at` | timestamp | Yes | `NULL` | Optional expiration timestamp |
| `revoked_at` | timestamp | Yes | `NULL` | Revocation timestamp |
| `created_at` | timestamp | No | — | Token creation timestamp |
| `updated_at` | timestamp | No | — | Last token update timestamp |

---

### `contact`

WHOIS/registrant contact information.

Each user has one contact record.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique contact identifier |
| `user_id` | text | No | — | References `user.id`; unique |
| `name` | text | No | — | Registrant/contact name |
| `organization` | text | Yes | `NULL` | Organization name |
| `email` | text | No | — | Contact email |
| `phone` | text | Yes | `NULL` | Contact phone number |
| `address` | text | Yes | `NULL` | Street address |
| `city` | text | Yes | `NULL` | City |
| `state` | text | Yes | `NULL` | State/province |
| `postal_code` | text | Yes | `NULL` | Postal/ZIP code |
| `country` | text | Yes | `NULL` | Country |
| `created_at` | timestamp | No | — | Contact creation timestamp |
| `updated_at` | timestamp | No | — | Last contact update timestamp |

---

### `domain`

Registered `der.my.id` domains.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique domain identifier |
| `user_id` | text | No | — | References `user.id` |
| `name` | text | No | — | Full domain name, e.g. `example.der.my.id` |
| `label` | text | No | — | Domain label, e.g. `example` |
| `status` | text | No | `pending` | `pending`, `approved`, `rejected`, `suspended`, or `revoked` |
| `dns_mode` | text | No | `shared` | DNS mode: `shared` or `custom` |
| `approved_at` | timestamp | Yes | `NULL` | Approval timestamp |
| `suspended_at` | timestamp | Yes | `NULL` | Suspension timestamp |
| `revoked_at` | timestamp | Yes | `NULL` | Revocation timestamp |
| `created_at` | timestamp | No | — | Domain creation timestamp |
| `updated_at` | timestamp | No | — | Last domain update timestamp |

---

### `domain_submission`

Domain registration and DNS-mode submission requests.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique submission identifier |
| `domain_id` | text | No | — | References `domain.id` |
| `user_id` | text | No | — | References `user.id` |
| `dns_mode` | text | No | — | Requested DNS mode: `shared` or `custom` |
| `status` | text | No | `pending` | `pending`, `approved`, `rejected`, or `cancelled` |
| `reason` | text | Yes | `NULL` | Rejection/cancellation or processing reason |
| `admin_note` | text | Yes | `NULL` | Internal administrative note |
| `reviewed_by` | text | Yes | `NULL` | References `user.id` of reviewing admin |
| `reviewed_at` | timestamp | Yes | `NULL` | Review timestamp |
| `created_at` | timestamp | No | — | Submission creation timestamp |
| `updated_at` | timestamp | No | — | Last submission update timestamp |

---

### `domain_nameserver`

Custom nameservers configured for domains using custom DNS delegation.

This table stores nameservers only. It does not store DNS records.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique nameserver identifier |
| `domain_id` | text | No | — | References `domain.id` |
| `nameserver` | text | No | — | Nameserver hostname |
| `position` | integer | No | — | Nameserver ordering |
| `created_at` | timestamp | No | — | Nameserver creation timestamp |
| `updated_at` | timestamp | No | — | Last nameserver update timestamp |

---

### `domain_event`

Domain lifecycle history.

Records important state transitions and domain-related actions.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique event identifier |
| `domain_id` | text | No | — | References `domain.id` |
| `actor_user_id` | text | Yes | `NULL` | User/admin responsible for the event |
| `event` | text | No | — | Event identifier |
| `from_status` | text | Yes | `NULL` | Previous domain status |
| `to_status` | text | Yes | `NULL` | New domain status |
| `metadata` | json | Yes | `NULL` | Additional structured event data |
| `created_at` | timestamp | No | — | Event creation timestamp |

---

### `audit_log`

Application-wide administrative and security audit records.

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| `id` | text | No | — | Unique audit log identifier |
| `actor_user_id` | text | Yes | `NULL` | User/admin responsible for the action |
| `action` | text | No | — | Action identifier |
| `entity_type` | text | No | — | Type of affected entity |
| `entity_id` | text | Yes | `NULL` | Identifier of affected entity |
| `metadata` | json | Yes | `NULL` | Additional structured audit data |
| `ip_address` | text | Yes | `NULL` | Client IP address |
| `user_agent` | text | Yes | `NULL` | Client user agent |
| `created_at` | timestamp | No | — | Audit event timestamp |

---

## Relationships

| From | Relationship | To | Description |
|---|---|---|---|
| `user` | 1:N | `account` | A user can have multiple authentication accounts |
| `user` | 1:N | `session` | A user can have multiple active/previous sessions |
| `user` | 1:N | `api_token` | A user can have multiple API tokens |
| `user` | 1:1 | `contact` | Each user has one WHOIS/registrant contact |
| `user` | 1:N | `domain` | A user can own multiple domains |
| `user` | 1:N | `domain_submission` | A user can create multiple submissions |
| `user` | 1:N | `domain_event` | A user can perform domain-related actions |
| `user` | 1:N | `audit_log` | A user/admin can perform audited actions |
| `domain` | 1:N | `domain_submission` | A domain can have multiple submissions |
| `domain` | 1:N | `domain_nameserver` | A custom-DNS domain can have multiple nameservers |
| `domain` | 1:N | `domain_event` | A domain has a lifecycle event history |
| `domain_submission` | N:1 | `user` | `reviewed_by` identifies the reviewing admin |

### WHOIS Ownership

WHOIS information is resolved through:

```text
domain
  ↓ user_id
user
  ↓ user_id
contact
```

There is no `domain_contact` table.

---

## DNS Architecture

DNS records are intentionally not represented as database entities.

```text
Application Database
        │
        ├── domain
        └── domain_nameserver
                  │
                  ▼
             Cloudflare
                  │
                  └── DNS records
```

Cloudflare remains the source of truth for DNS records.

The database only tracks:

- domain ownership
- domain status
- DNS mode
- custom nameserver configuration
- domain lifecycle events

---

## DNS Mode

### `shared`

The domain uses the shared `der.my.id` DNS infrastructure.

```text
domain.dns_mode = shared
```

No custom nameserver records are stored in `domain_nameserver`.

### `custom`

The domain delegates DNS through custom nameservers.

```text
domain.dns_mode = custom
```

Custom nameservers are stored in `domain_nameserver`.

When changing from `custom` to `shared`:

1. Delete the domain's `domain_nameserver` records.
2. Remove the corresponding Cloudflare delegation/NS configuration.
3. Set `domain.dns_mode` to `shared`.
4. Record the operation in `domain_event` and/or `audit_log`.

When changing from `shared` to `custom`:

1. Validate the submitted nameservers.
2. Store them in `domain_nameserver`.
3. Configure the corresponding Cloudflare delegation.
4. Set `domain.dns_mode` to `custom`.
5. Record the operation in `domain_event` and/or `audit_log`.

---

## Authentication

Web authentication and API authentication are separate mechanisms.

### Web

```text
Better Auth
    ↓
session
    ↓
authenticated web request
```

Web users authenticate through Better Auth and DB-backed sessions.

Supported providers:

- Email/password
- GitHub OAuth

### API

```text
Authorization: Bearer <token>
              ↓
        token hash lookup
              ↓
           api_token
              ↓
        authenticated API request
```

API tokens are independent from web sessions.

Raw API bearer tokens must never be stored in the database.

---

## Authorization

The application has exactly two roles:

| Role | Description |
|---|---|
| `user` | Normal authenticated user |
| `admin` | Administrative user |

Authorization must always be enforced server-side.

UI navigation may hide administrative functionality from normal users, but UI visibility is not an authorization mechanism.

API routes, services, and administrative operations must independently verify the user's authorization.

---

## Status Values

### User Status

```text
active
suspended
banned
```

### User Role

```text
user
admin
```

### Domain Status

```text
pending
approved
rejected
suspended
revoked
```

### DNS Mode

```text
shared
custom
```

### Domain Submission Status

```text
pending
approved
rejected
cancelled
```

---

## Data Ownership

The application database owns application state.

| Data | Source of Truth |
|---|---|
| Users | D1 |
| Authentication accounts | D1 / Better Auth |
| Sessions | D1 / Better Auth |
| API tokens | D1 |
| Contacts | D1 |
| Domain ownership | D1 |
| Domain lifecycle/status | D1 |
| Domain submissions | D1 |
| Custom nameservers | D1 + Cloudflare configuration |
| DNS records | Cloudflare |
| DNS infrastructure | Cloudflare |
| WHOIS presentation | Application + D1 |
| Audit history | D1 |

The database must not attempt to become a replacement for Cloudflare's DNS system.
