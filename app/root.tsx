import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
} from "react-router";
import Footer from "./components/base/Footer";
import globalCss from "./global.css?url";
import { initializeTheme } from "./utils/theme";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/logo_dark.ico",
    },
    ...(globalCss ? [{ rel: "stylesheet", href: globalCss }] : []),
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => [
  {
    title: "DER Free Domain Platform",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Toaster richColors position="top-right" />
        <div className="overflow-hidden">{children}</div>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return <Outlet />;
}
