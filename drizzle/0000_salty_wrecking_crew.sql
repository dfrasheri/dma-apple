CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text,
	`lead_id` text,
	`service` text,
	`scheduled_for` integer NOT NULL,
	`duration_min` integer DEFAULT 60 NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`channel` text,
	`location` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `appointments_scheduled_idx` ON `appointments` (`scheduled_for`);--> statement-breakpoint
CREATE INDEX `appointments_status_idx` ON `appointments` (`status`);--> statement-breakpoint
CREATE TABLE `competitors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text,
	`country` text,
	`lat` real,
	`lng` real,
	`website` text,
	`osm_id` text,
	`instagram_url` text,
	`ig_checked_at` integer,
	`price_band` text,
	`price_source` text,
	`price_updated_at` integer,
	`services` text,
	`rating` real,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `competitors_city_idx` ON `competitors` (`city`);--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`city` text,
	`country` text,
	`locale` text,
	`ig_handle` text,
	`avatar_url` text,
	`tags` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contacts_email_idx` ON `contacts` (`email`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text,
	`channel` text NOT NULL,
	`external_id` text,
	`subject` text,
	`status` text DEFAULT 'open' NOT NULL,
	`assignee` text,
	`bot_enabled` integer DEFAULT true NOT NULL,
	`last_inbound_at` integer,
	`last_message_at` integer,
	`unread` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `conversations_status_idx` ON `conversations` (`status`);--> statement-breakpoint
CREATE INDEX `conversations_channel_idx` ON `conversations` (`channel`);--> statement-breakpoint
CREATE TABLE `lead_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`type` text NOT NULL,
	`body` text,
	`meta` text,
	`author` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lead_activities_lead_idx` ON `lead_activities` (`lead_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`service` text,
	`stage` text DEFAULT 'new' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`source` text DEFAULT 'other' NOT NULL,
	`value_estimate` real,
	`owner` text,
	`notes` text,
	`source_detail` text,
	`lost_reason` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `leads_stage_idx` ON `leads` (`stage`);--> statement-breakpoint
CREATE INDEX `leads_contact_idx` ON `leads` (`contact_id`);--> statement-breakpoint
CREATE TABLE `market_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`city` text NOT NULL,
	`country` text,
	`affluence_index` real,
	`median_income` integer,
	`population` integer,
	`medical_tourism_demand` text,
	`top_procedures` text,
	`source` text,
	`year` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `market_stats_city_year_idx` ON `market_stats` (`city`,`year`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`direction` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`channel` text NOT NULL,
	`meta` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `messages_conversation_idx` ON `messages` (`conversation_id`);--> statement-breakpoint
CREATE TABLE `social_facts` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`city` text,
	`venue` text,
	`date` text,
	`procedure` text,
	`doctor` text,
	`payload` text,
	`source_post_id` text NOT NULL,
	`confidence` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`superseded_by` text,
	`conflict_flag` integer DEFAULT false NOT NULL,
	`conflict_reason` text,
	`extracted_at` integer NOT NULL,
	`reviewed_by` text,
	`reviewed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`source_post_id`) REFERENCES `social_posts`(`post_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `social_facts_type_idx` ON `social_facts` (`type`);--> statement-breakpoint
CREATE INDEX `social_facts_city_idx` ON `social_facts` (`city`);--> statement-breakpoint
CREATE INDEX `social_facts_status_idx` ON `social_facts` (`status`);--> statement-breakpoint
CREATE INDEX `social_facts_post_idx` ON `social_facts` (`source_post_id`);--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`account` text NOT NULL,
	`channel` text DEFAULT 'instagram' NOT NULL,
	`caption` text,
	`media_url` text,
	`permalink` text,
	`post_timestamp` integer,
	`content_hash` text,
	`status` text DEFAULT 'live' NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_posts_post_id_unique` ON `social_posts` (`post_id`);