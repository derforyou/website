CREATE TABLE `authOtpThrottle` (
	`email` text PRIMARY KEY NOT NULL,
	`sentCount` integer NOT NULL,
	`lastSentAt` integer NOT NULL,
	`nextAllowedAt` integer NOT NULL
);
--> statement-breakpoint
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
ALTER TABLE `domain` ADD `registrationId` text REFERENCES domainRegistration(id);--> statement-breakpoint
ALTER TABLE `domain` ADD `dnsMode` text DEFAULT 'managed' NOT NULL;--> statement-breakpoint
ALTER TABLE `domain` ADD `customNameservers` text;--> statement-breakpoint
CREATE INDEX `domain_registration_id_idx` ON `domain` (`registrationId`);