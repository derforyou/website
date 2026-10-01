const EMAIL_KEY = "der:auth-email";
const SENT_COUNT_KEY = "der:auth-otp-sent-count";
const RESEND_AT_KEY = "der:auth-otp-resend-at";
const SIGNUP_NAME_KEY = "der:auth-signup-name";

const INITIAL_COOLDOWN_MS = 30_000;
const MAX_COOLDOWN_MS = 15 * 60_000;

function getSessionStorage() {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

function cooldownForSendCount(sentCount: number) {
  return Math.min(INITIAL_COOLDOWN_MS * 2 ** (sentCount - 1), MAX_COOLDOWN_MS);
}

export function rememberOtpRequest(email: string) {
  const storage = getSessionStorage();
  if (!storage) return 0;

  const resendAt = Date.now() + INITIAL_COOLDOWN_MS;
  storage.setItem(EMAIL_KEY, email.trim());
  storage.setItem(SENT_COUNT_KEY, "1");
  storage.setItem(RESEND_AT_KEY, String(resendAt));
  return resendAt;
}

export function readOtpSession() {
  const storage = getSessionStorage();
  const email = storage?.getItem(EMAIL_KEY)?.trim() ?? "";
  if (!storage || !email) return null;

  return {
    email,
    sentCount: Math.max(1, Number(storage.getItem(SENT_COUNT_KEY)) || 1),
    resendAt: Number(storage.getItem(RESEND_AT_KEY)) || 0,
  };
}

export function rememberOtpResend(email: string) {
  const storage = getSessionStorage();
  if (!storage) return 0;

  const current = readOtpSession();
  if (!current || current.email.toLowerCase() !== email.trim().toLowerCase()) {
    return rememberOtpRequest(email);
  }

  const sentCount = current.sentCount + 1;
  const resendAt = Date.now() + cooldownForSendCount(sentCount);
  storage.setItem(SENT_COUNT_KEY, String(sentCount));
  storage.setItem(RESEND_AT_KEY, String(resendAt));
  return resendAt;
}

export function rememberOtpRetry(errorMessage: string) {
  const retrySeconds = /retry in (\d+) seconds?/i.exec(errorMessage)?.[1];
  if (!retrySeconds) return 0;

  const resendAt = Date.now() + Number(retrySeconds) * 1000;
  getSessionStorage()?.setItem(RESEND_AT_KEY, String(resendAt));
  return resendAt;
}

export function clearOtpSession() {
  const storage = getSessionStorage();
  storage?.removeItem(EMAIL_KEY);
  storage?.removeItem(SENT_COUNT_KEY);
  storage?.removeItem(RESEND_AT_KEY);
  storage?.removeItem(SIGNUP_NAME_KEY);
}

export { SIGNUP_NAME_KEY };
