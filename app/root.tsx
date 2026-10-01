import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
} from "react-router";
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
  ];
};

export const meta: MetaFunction = () => [
  {
    title: "DERforyou | Developer domains",
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
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <div className="min-h-svh">{children}</div>
        </TooltipProvider>
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
