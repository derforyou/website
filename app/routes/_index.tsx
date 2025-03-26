import Hero from "#/components/routes/landing/Hero";
import type { LinksFunction } from "react-router";

export const links: LinksFunction = () => [
  {
    href: "banner.jpg",
    rel: "preload",
    as: "image",
  },
];

export default function Index() {
  return (
    <div className="min-h-svh">
      <Hero />
    </div>
  );
}
