import { AppError } from "@/lib/errors";

export const AUTH_PASSWORD_MIN_LENGTH = 12;
export const AUTH_PASSWORD_MAX_LENGTH = 128;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmailAddress(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError(400, "invalid_email", "A valid email address is required.");
  }

  const email = value.trim().toLowerCase();
  if (email.length > 254 || !emailPattern.test(email)) {
    throw new AppError(400, "invalid_email", "A valid email address is required.");
  }

  return email;
}

export function validateAuthPassword(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length < AUTH_PASSWORD_MIN_LENGTH ||
    value.length > AUTH_PASSWORD_MAX_LENGTH
  ) {
    throw new AppError(
      400,
      "invalid_password",
      `Password must be between ${AUTH_PASSWORD_MIN_LENGTH} and ${AUTH_PASSWORD_MAX_LENGTH} characters.`,
    );
  }

  return value;
}

export function normalizeAuthName(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError(400, "invalid_name", "A valid name is required.");
  }

  const name = value.trim();
  if (!name || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name)) {
    throw new AppError(400, "invalid_name", "Name must be between 1 and 80 characters.");
  }

  return name;
}