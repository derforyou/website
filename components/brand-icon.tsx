"use client";

import { useEffect, useState } from "react";

const ICON_EXPORTS = {
  cloudflare: "siCloudflare",
  github: "siGithub",
  resend: "siResend",
} as const;

type BrandIconName = keyof typeof ICON_EXPORTS;

export type SimpleIconData = {
  path: string;
};

declare global {
  interface Window {
    module?: { exports: Record<string, SimpleIconData> };
    __SIMPLE_ICONS__?: Record<string, SimpleIconData>;
  }
}

export function BrandIcon({ name, size = 14 }: { name: BrandIconName; size?: number }) {
  const [path, setPath] = useState("");

  useEffect(() => {
    const updatePath = () => {
      setPath(window.__SIMPLE_ICONS__?.[ICON_EXPORTS[name]]?.path ?? "");
    };

    updatePath();
    window.addEventListener("simple-icons-ready", updatePath);
    return () => window.removeEventListener("simple-icons-ready", updatePath);
  }, [name]);

  return (
    <svg
      aria-hidden="true"
      className="shrink-0 fill-current"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {path ? <path d={path} /> : null}
    </svg>
  );
}