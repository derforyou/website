import type { TransactionalEmail } from "@/lib/validation/email";

export type { TransactionalEmail };

export const TRANSACTIONAL_EMAIL_FROM_NAME = "der.my.id";
export const TRANSACTIONAL_EMAIL_FROM_ADDRESS = "no-reply@notify.der.my.id";
export const TRANSACTIONAL_EMAIL_FROM = `${TRANSACTIONAL_EMAIL_FROM_NAME} <${TRANSACTIONAL_EMAIL_FROM_ADDRESS}>`;
export const TRANSACTIONAL_EMAIL_SENDER = {
	name: TRANSACTIONAL_EMAIL_FROM_NAME,
	email: TRANSACTIONAL_EMAIL_FROM_ADDRESS,
} as const;