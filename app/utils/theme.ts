export function initializeTheme() {
  if (typeof window === 'undefined') return;

  const updateFavicon = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', prefersDark ? '/logo_light.ico' : '/logo_dark.ico');
    }
  };

  // Update favicon initially
  updateFavicon();

  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
}
