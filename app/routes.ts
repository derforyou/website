import {
    type RouteConfig,
    index,
    layout,
    route,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  layout("routes/mainLayout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/auth/signin", "routes/auth/signin.tsx"),
    route("/auth/signup", "routes/auth/signup.tsx"),
    route("/auth/verify", "routes/auth/verify.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/domains", "routes/domains.tsx"),
    route("/domains/register", "routes/domains/register.tsx"),
    route("/settings", "routes/settings.tsx"),
    route("/settings/account", "routes/settings/account.tsx"),
    route("/settings/contact", "routes/settings/contact.tsx"),
    route("/settings/api-keys", "routes/settings/api-keys.tsx"),
  ]),
] satisfies RouteConfig;
