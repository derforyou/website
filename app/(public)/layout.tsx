import type { Metadata } from "next";

import { PublicSiteLayout } from "@/components/public-site-layout";

export const metadata: Metadata = {
  title: { default: "Public", template: "%s | der.my.id" },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicSiteLayout>{children}</PublicSiteLayout>;
}