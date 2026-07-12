CREATE TABLE `affiliates` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`kind` text DEFAULT 'partner' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`commission_pct` real,
	`company` text,
	`website` text,
	`audience` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `affiliates_code_unique` ON `affiliates` (`code`);--> statement-breakpoint
CREATE INDEX `affiliates_status_idx` ON `affiliates` (`status`);--> statement-breakpoint
ALTER TABLE `leads` ADD `affiliate_id` text;--> statement-breakpoint
CREATE INDEX `leads_affiliate_idx` ON `leads` (`affiliate_id`);