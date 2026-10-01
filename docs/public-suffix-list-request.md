# Requesting `der.my.id` for the Public Suffix List

This project runs a developer subdomain service beneath `der.my.id`. To avoid ambiguity for browsers and user agents, the service operator may need to request that the parent zone be added to the Public Suffix List (PSL) if the project is intended to operate as a separate registrable namespace.

## Suggested request summary

```
Subject: Request to add der.my.id to the Public Suffix List

The DERforyou service operates a developer subdomain namespace under der.my.id for
end-user and project hostnames such as example.der.my.id. We are requesting that
this parent domain be considered for inclusion in the Public Suffix List so that
browsers and other user agents do not treat subdomains as registrable domains in a
way that conflicts with the service's tenant model.

Relevant points:

- The parent zone is controlled by the DERforyou service operator.
- Subdomains are allocated dynamically to applicants after review.
- The service enforces approval and policy checks before activation.
- Hostnames are not created or delegated before administrator approval.
- The service reserves infrastructure, API, and security-related hostnames.

We ask the PSL maintainers to review the operational and policy model and confirm
whether der.my.id should be treated as a public suffix for the service's use case.
```

## Practical review checklist

- Confirm that the domain is operated as a service namespace rather than as a
  registrable domain for ordinary end users.
- Confirm that subdomains are assigned by a central service operator.
- Confirm that registrants do not control the parent domain's delegation.
- Include the service's policy and review process in public documentation.
- Keep a short record of the PSL request and any maintainers' response.

## Reference notes

- The parent zone is `der.my.id`.
- The service policy is documented in the legal and domain policy pages of the app.
- Approval workflows and hostname protection policies live in the codebase for the
  registration and moderation system.
