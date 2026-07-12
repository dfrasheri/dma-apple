CREATE TABLE `content_calendars` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`month` integer NOT NULL,
	`locales` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`seed` integer DEFAULT 0 NOT NULL,
	`generated_at` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_calendars_year_month_unique` ON `content_calendars` (`year`,`month`);--> statement-breakpoint
CREATE TABLE `content_topic_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`meta_description` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `content_topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_variants_topic_locale_unique` ON `content_topic_variants` (`topic_id`,`locale`);--> statement-breakpoint
CREATE TABLE `content_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`calendar_id` text NOT NULL,
	`slot_date` integer NOT NULL,
	`format` text NOT NULL,
	`channel` text NOT NULL,
	`market` text NOT NULL,
	`subject` text NOT NULL,
	`keyword` text NOT NULL,
	`schema_type` text NOT NULL,
	`brief` text NOT NULL,
	`status` text DEFAULT 'suggested' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`calendar_id`) REFERENCES `content_calendars`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `content_topics_calendar_idx` ON `content_topics` (`calendar_id`);--> statement-breakpoint
CREATE INDEX `content_topics_status_idx` ON `content_topics` (`status`);--> statement-breakpoint
CREATE INDEX `content_topics_slot_idx` ON `content_topics` (`slot_date`);