CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE TABLE `apiKey` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`prefix` text NOT NULL,
	`keyHash` text NOT NULL,
	`createdAt` integer NOT NULL,
	`lastUsedAt` integer,
	`expiresAt` integer,
	`revokedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apiKey_keyHash_unique` ON `apiKey` (`keyHash`);--> statement-breakpoint
CREATE INDEX `api_key_user_id_idx` ON `apiKey` (`userId`);--> statement-breakpoint
CREATE TABLE `auditLog` (
	`id` text PRIMARY KEY NOT NULL,
	`actorId` text,
	`action` text NOT NULL,
	`resourceType` text NOT NULL,
	`resourceId` text,
	`metadata` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`actorId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_log_actor_id_idx` ON `auditLog` (`actorId`);--> statement-breakpoint
CREATE INDEX `audit_log_resource_idx` ON `auditLog` (`resourceType`,`resourceId`);--> statement-breakpoint
CREATE INDEX `audit_log_created_at_idx` ON `auditLog` (`createdAt`);--> statement-breakpoint
CREATE TABLE `authOtpThrottle` (
	`email` text PRIMARY KEY NOT NULL,
	`sentCount` integer NOT NULL,
	`lastSentAt` integer NOT NULL,
	`nextAllowedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`fullName` text NOT NULL,
	`organization` text,
	`email` text NOT NULL,
	`phone` text,
	`addressLine1` text,
	`addressLine2` text,
	`city` text,
	`stateProvince` text,
	`postalCode` text,
	`countryCode` text(2),
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_userId_unique` ON `contact` (`userId`);--> statement-breakpoint
CREATE INDEX `contact_email_idx` ON `contact` (`email`);--> statement-breakpoint
CREATE TABLE `dnsRecord` (
	`id` text PRIMARY KEY NOT NULL,
	`domainId` text NOT NULL,
	`cloudflareRecordId` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`ttl` integer DEFAULT 1 NOT NULL,
	`proxied` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`domainId`) REFERENCES `domain`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dnsRecord_cloudflareRecordId_unique` ON `dnsRecord` (`cloudflareRecordId`);--> statement-breakpoint
CREATE INDEX `dns_record_domain_id_idx` ON `dnsRecord` (`domainId`);--> statement-breakpoint
CREATE TABLE `domain` (
	`id` text PRIMARY KEY NOT NULL,
	`subdomain` text NOT NULL,
	`hostname` text NOT NULL,
	`ownerId` text NOT NULL,
	`contactId` text NOT NULL,
	`registrationId` text,
	`status` text DEFAULT 'active' NOT NULL,
	`dnsMode` text DEFAULT 'managed' NOT NULL,
	`customNameservers` text,
	`dnsSyncStatus` text DEFAULT 'not-configured' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`contactId`) REFERENCES `contact`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`registrationId`) REFERENCES `domainRegistration`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "domain_subdomain_lowercase" CHECK("domain"."subdomain" = lower("domain"."subdomain"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `domain_subdomain_unique` ON `domain` (`subdomain`);--> statement-breakpoint
CREATE UNIQUE INDEX `domain_hostname_unique` ON `domain` (`hostname`);--> statement-breakpoint
CREATE INDEX `domain_owner_id_idx` ON `domain` (`ownerId`);--> statement-breakpoint
CREATE INDEX `domain_registration_id_idx` ON `domain` (`registrationId`);--> statement-breakpoint
CREATE TABLE `domainRegistration` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`subdomain` text NOT NULL,
	`hostname` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`dnsMode` text DEFAULT 'managed' NOT NULL,
	`customNameservers` text,
	`notes` text,
	`rejectedReason` text,
	`decidedByUserId` text,
	`decisionAt` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`decidedByUserId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "domain_registration_subdomain_lowercase" CHECK("domainRegistration"."subdomain" = lower("domainRegistration"."subdomain"))
);
--> statement-breakpoint
CREATE INDEX `domain_registration_user_id_idx` ON `domainRegistration` (`userId`);--> statement-breakpoint
CREATE INDEX `domain_registration_status_idx` ON `domainRegistration` (`status`);--> statement-breakpoint
CREATE INDEX `domain_registration_hostname_idx` ON `domainRegistration` (`hostname`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE TABLE `twoFactor` (
	`id` text PRIMARY KEY NOT NULL,
	`secret` text NOT NULL,
	`backupCodes` text NOT NULL,
	`userId` text NOT NULL,
	`verified` integer DEFAULT true NOT NULL,
	`failedVerificationCount` integer DEFAULT 0 NOT NULL,
	`lockedUntil` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `twoFactor_userId_unique` ON `twoFactor` (`userId`);--> statement-breakpoint
CREATE INDEX `two_factor_secret_idx` ON `twoFactor` (`secret`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`twoFactorEnabled` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT "user_role_check" CHECK("user"."role" in ('user', 'moderator', 'admin', 'owner'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);