"use client";

import Script from "next/script";

export function SimpleIconsLoader() {
  const handleLoad = () => {
    const icons = window.module?.exports;
    if (!icons) return;

    window.__SIMPLE_ICONS__ = icons;
    Reflect.deleteProperty(window, "module");
    window.dispatchEvent(new Event("simple-icons-ready"));
  };

  const handleError = () => {
    Reflect.deleteProperty(window, "module");
  };

  return (
    <Script
      id="simple-icons-library"
      src="https://cdn.jsdelivr.net/npm/simple-icons@16.33.0/index.min.js"
      strategy="lazyOnload"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}