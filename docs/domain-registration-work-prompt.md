Prompt: Continue Domain Registration Improvements

Continue the subdomain registration work in this repository. Read this prompt together with the latest repository instructions, verify the actual code when starting, then implement and test the changes through completion. Do not assume previous work has already modified the code.

Objective

Build a complete "*.der.my.id" subdomain registration workflow that:

- requires administrator approval before activation;
- protects service-reserved names and hostnames;
- allows applicants to choose between service-managed DNS and custom nameservers;
- allows applicants to view their registration status;
- provides a dedicated administrator domain moderation page;
- does not modify live DNS before approval;
- includes documentation for requesting "der.my.id" to be added to the Public Suffix List (PSL).

Existing Conditions

- "app/routes/dashboard/domains/register.tsx" is currently a UI placeholder. Registration and availability are not connected and the submit button is disabled.
- "app/routes/api/v1/domains.ts" currently only handles GET/listing.
- "app/routes/api/v1/domains.availability.ts" currently checks name format and database duplication.
- The domain zone is "der.my.id".
- "server/database/schema.ts" currently has a "domain" table with "active" and "suspended" status. Approval workflow and DNS/nameserver preferences do not yet exist.
- "server/services/cloudflare.ts" provides functionality for reading and creating DNS records.
- ".env.example" contains "CLOUDFLARE_API_TOKEN" and "CLOUDFLARE_ZONE_ID".
- Production secrets are stored as Cloudflare Pages secrets. Never print or commit secret values.
- A previous "npm run build" succeeded, but that does not validate the new changes.

1. Verify the Repository

1. Check git status and the latest repository instructions.
2. Never reset, overwrite, discard, or otherwise destroy existing user changes.
3. Inspect existing migrations, schema, routing, authentication, authorization, and UI patterns before implementing changes.

2. Inspect the Cloudflare DNS Zone

Use the same local ".env" authentication:

CLOUDFLARE_API_TOKEN
CLOUDFLARE_ZONE_ID

Perform a read-only inspection.

Only print information that is necessary, such as:

- record name;
- record type;
- content/target when relevant;
- proxy status when relevant.

Never print:

- API tokens;
- the entire environment;
- Authorization headers;
- other secrets.

Existing DNS records must be treated as input for identifying system-reserved hostnames. Do not modify or delete any existing record.

If Cloudflare access fails, document the failure and continue using an initial reservation list explicitly marked as requiring confirmation.

3. Reserved Names and Hostname Protection

Create a maintainable reserved-name policy in TypeScript and/or JSON.

Organize the policy into sensible categories, for example:

- system/infrastructure;
- security/authentication;
- API/services;
- abuse/phishing;
- brands/organizations;
- hostnames already used by the system.

Include relevant hostnames actually discovered in the Cloudflare zone inspection.

Normalize user input before validation so simple case, hostname-format, or normalization variations cannot bypass the policy.

Do not over-block generic substrings. A reserved word appearing inside an otherwise valid name should not automatically make the entire name unavailable unless the policy explicitly requires that behavior.

Use the same policy for:

- availability checks;
- registration submission;
- backend validation.

The backend must always perform the final validation. Availability is not a security boundary.

4. Authentication and Administrator Authorization

Use the same authentication model as normal users.

The existing authentication flow uses email magic login/link and has no password system.

Administrators are determined by their authenticated email address.

The administrator configuration must support multiple emails using a comma-separated environment variable:

ADMIN_EMAIL=admin@example.com,owner@example.com,moderator@example.com

Create a reusable helper for parsing this configuration.

The helper must:

1. read the configured environment variable;
2. split it using ",";
3. trim whitespace around each value;
4. remove empty values;
5. normalize email addresses consistently with the application's authentication comparison rules;
6. return an array of administrator emails;
7. provide a reusable function for checking whether an authenticated email belongs to that array.

Conceptually:

ADMIN_EMAIL
    ↓
"admin@example.com, owner@example.com, moderator@example.com"
    ↓
[
  "admin@example.com",
  "owner@example.com",
  "moderator@example.com"
]

Do not duplicate comma-splitting logic throughout the application.

Do not store administrator credentials or the administrator list in the database.

Do not create a separate password-based administrator authentication system.

Administrator login must continue to use the existing email magic-login flow, with the administrator always required to complete the existing OTP/login verification mechanism.

Authorization must be based on the authenticated server-side user identity.

Never trust client-provided fields such as:

role=admin
isAdmin=true
email=...

Every administrator API endpoint and action must perform server-side authorization.

Do not expose the configured administrator email list to normal users.

5. Registration and Approval Workflow

Implement registration submission with at least these request states:

pending
approved
rejected

Keep operational domain states such as:

active
suspended

separate from the registration approval state unless there is a clear reason to combine them.

A registration request should store the information required for moderation, including as appropriate:

- applicant/user;
- requested subdomain;
- approval status;
- submission timestamp;
- decision timestamp;
- administrator who made the decision, when appropriate;
- rejection reason/notes;
- registration purpose/notes when required;
- DNS mode;
- custom nameservers when selected.

The availability check is informational only. It must never be treated as an atomic reservation.

The backend must revalidate the requested name and conflicts when the registration is submitted.

6. DNS Selection

The registration form must require the applicant to select one of:

Our DNS
Custom nameservers

For "Our DNS":

- store the selected mode;
- do not claim that every record will automatically be Cloudflare-proxied;
- set "proxied" explicitly only when the record type and configuration support it.

For "Custom nameservers":

- collect the required nameservers;
- validate their format and allowed count;
- store them;
- do not claim that delegation is active unless an actual delegation/configuration mechanism confirms it.

The UI must describe DNS and proxy limitations accurately.

7. Administrator Domain Moderation

Create a dedicated administrator domain moderation page following the repository's existing routing, authentication, authorization, and UI conventions.

The moderation interface must allow an authorized administrator to:

- view pending registration requests;
- inspect request details;
- approve registrations;
- reject registrations;
- view registered domains;
- suspend domains;
- forcibly delete domains/registrations according to the application's rules.

All moderation actions must be protected by server-side administrator authorization.

Operations must be safe against repeated requests and retries.

For forced deletion, define and implement consistent behavior for the associated registration data and DNS records.

Never delete DNS records belonging to unrelated services or records not owned by the relevant domain registration.

8. DNS Provisioning

Do not modify live DNS when a user submits a registration request.

The workflow should generally be:

submit
  ↓
pending
  ↓
administrator review
  ↓
approved
  ↓
DNS provisioning, if required

DNS provisioning must be:

- idempotent;
- safe to retry;
- unable to delete unrelated existing records;
- unable to replace unrelated zone records;
- explicit about record type and proxy support;
- capable of reporting provisioning failure.

If approval succeeds but DNS provisioning fails, persist enough state/error information for the failure to be investigated or retried. Do not report the domain as fully active if provisioning did not complete.

9. User Registration UI

Update the registration page so users can:

- enter a subdomain name;
- check availability;
- receive a clear reason when a name is unavailable or reserved;
- choose "Our DNS" or "Custom nameservers";
- enter nameservers when required;
- submit the registration;
- see the resulting "pending", "approved", or "rejected" status;
- see an appropriate rejection reason when available.

Follow existing repository UI and component conventions. Avoid unrelated UI refactoring.

10. Administrator UI

Add the dedicated domain moderation page.

The page must not be protected merely by hiding a URL. All API requests and mutation actions must independently enforce administrator authorization on the server.

Show administrators enough information to moderate registrations without exposing secrets or unnecessary private user data.

11. Database and Migrations

Design the schema changes to remain compatible with Cloudflare D1.

Before creating a new migration:

- inspect all existing migrations;
- understand their ordering and conventions;
- do not create conflicting schema changes.

Add the required persistence for:

- registration requests;
- approval/rejection;
- DNS mode;
- custom nameservers;
- moderation/suspension/deletion information where necessary.

Use appropriate constraints and indexes to reduce registration conflicts.

Do not treat an availability query as an atomic reservation.

12. Testing

Add focused tests for:

- name validation;
- reserved names;
- hostname normalization;
- availability;
- registration submission;
- duplicate/conflict handling;
- administrator email parsing;
- multiple administrator emails;
- whitespace around comma-separated emails;
- administrator authorization;
- non-admin authorization failure;
- approval;
- rejection;
- suspension;
- forced deletion;
- "Our DNS";
- custom nameservers;
- nameserver validation;
- DNS provisioning/idempotency where supported by the repository's test setup.

In particular, verify that:

ADMIN_EMAIL=admin@example.com, owner@example.com

produces:

[
  "admin@example.com",
  "owner@example.com"
]

and that both authenticated users can be recognized as administrators.

Run the relevant checks, including:

npm run build

and the repository's available typecheck, lint, and test commands.

Report any command that cannot be executed and explain why.

13. Public Suffix List Documentation

Create a Markdown tutorial, for example:

docs/public-suffix-list.md

The document must explain how to request "der.my.id" for inclusion in the Public Suffix List (PSL).

Clearly distinguish adding "der.my.id" to the PSL from ordinary DNS configuration.

Cover at least:

1. What the Public Suffix List is.
2. Why public-suffix classification matters.
3. Why "der.my.id" may be relevant to the PSL "PRIVATE" section when subdomains are delegated to unrelated parties.
4. Relevant PSL requirements and considerations.
5. How to demonstrate ownership/control of the domain.
6. The expected PSL entry format.
7. How to propose the change to the official PSL repository.
8. How to create the Pull Request.
9. What information should be included in the Pull Request.
10. Potential reasons for rejection.
11. Effects of PSL inclusion on cookies/site boundaries and software using the PSL.
12. The difference between PSL inclusion and security/trust certification.
13. Links to the official PSL documentation and repository.

Use current official PSL documentation as the primary reference.

Do not claim that inclusion is guaranteed.

Do not include credentials, API tokens, or other secrets in the documentation.

Important Constraints

- Never store administrator credentials or secrets in the database, source code, terminal output, or tracked files.
- Never store the administrator email configuration in the database.
- Do not create a separate administrator password system.
- Do not trust client-provided administrator roles or identities.
- Do not modify live DNS when a registration is submitted.
- Do not delete or replace existing unrelated DNS records.
- Do not assume that a Cloudflare zone means every subdomain is automatically proxied.
- Do not claim custom nameserver delegation is active without actual confirmation.
- Approval and DNS provisioning must be idempotent.
- Availability checks are not atomic reservations.
- Do not perform unrelated large-scale refactoring.
- Preserve all existing user changes.
- Do not use DNS inspection as authorization to modify the zone.
- Do not put secrets into tracked test fixtures.
- Do not assume previous work was implemented; verify the actual repository state first.

Expected Result

The completed implementation should provide:

1. A functional subdomain registration form.
2. Registration requests stored as "pending".
3. User-visible registration status.
4. Administrator authorization based on authenticated email.
5. Support for multiple administrators through comma-separated "ADMIN_EMAIL".
6. A reusable helper that parses "ADMIN_EMAIL" into an array.
7. Mandatory existing email/OTP authentication for administrators.
8. A dedicated administrator domain moderation page.
9. Administrator approval and rejection.
10. Administrator suspension and forced deletion.
11. Protected reserved names and system hostnames.
12. Consistent reserved-name validation for availability and submission.
13. A required DNS choice between "Our DNS" and custom nameservers.
14. No DNS changes before approval.
15. Safe and idempotent DNS provisioning after approval.
16. D1-compatible migrations.
17. Focused automated tests and successful relevant validation commands where possible.
18. "docs/public-suffix-list.md" explaining how to request "der.my.id" for inclusion in the PSL using current official PSL guidance.
19. A clear final report of implemented changes, validation results, failures, blockers, and required follow-up actions.
