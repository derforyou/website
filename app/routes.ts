import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/publicLayout.tsx", [
    index("routes/_index.tsx"),
    route("/legal/privacy", "routes/legal/privacy.tsx"),
    route("/legal/terms", "routes/legal/terms.tsx"),
    route("/legal/acceptable-use", "routes/legal/acceptable-use.tsx"),
    route("/legal/domain-policy", "routes/legal/domain-policy.tsx"),
    route("/legal/abuse", "routes/legal/abuse.tsx"),
  ]),
  route("/dashboard", "routes/dashboard/layout.tsx", [
    index("routes/dashboard/index.tsx"),
    route("domains", "routes/dashboard/domains/index.tsx"),
    route("domains/register", "routes/dashboard/domains/register.tsx"),
    route("domains/moderation", "routes/dashboard/domains/moderation.tsx"),
    route("domains/:domainId", "routes/dashboard/domains/manage.tsx"),
    route("settings", "routes/dashboard/settings/index.tsx"),
    route("settings/account", "routes/dashboard/settings/account.tsx"),
    route("settings/contact", "routes/dashboard/settings/contact.tsx"),
    route("settings/api-keys", "routes/dashboard/settings/api-keys.tsx"),
  ]),
  layout("routes/authLayout.tsx", [
    route("/auth/signin", "routes/auth/signin.tsx"),
    route("/auth/signup", "routes/auth/signup.tsx"),
    route("/auth/verify", "routes/auth/verify.tsx"),
  ]),
] satisfies RouteConfig;
