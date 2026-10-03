export function getLiveBaseUrl() {
  const value = process.env.AUTH_TEST_BASE_URL;

  if (!value) {
    throw new Error("Set AUTH_TEST_BASE_URL to the deployment URL to run live auth tests.");
  }

  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("AUTH_TEST_BASE_URL must use HTTP or HTTPS.");
  }

  return url;
}

export function liveRequest(path, init = {}) {
  const url = new URL(path, getLiveBaseUrl());
  return fetch(url, {
    ...init,
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
}
