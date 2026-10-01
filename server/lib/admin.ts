export function normalizeAdminEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function parseAdminEmails(rawValue?: string | null) {
  if (!rawValue) return [];

  return rawValue
    .split(",")
    .map((value) => normalizeAdminEmail(value))
    .filter(Boolean)
    .filter((value, index, entries) => entries.indexOf(value) === index);
}

export function isAdminEmail(email: string | null | undefined, configuredEmails?: string | null) {
  const normalized = normalizeAdminEmail(email);
  if (!normalized) return false;

  const allowed = parseAdminEmails(configuredEmails ?? process.env.ADMIN_EMAIL ?? "");
  return allowed.includes(normalized);
}
