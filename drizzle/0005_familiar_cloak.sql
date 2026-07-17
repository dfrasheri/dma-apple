CREATE TABLE `published_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text,
	`grp` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`meta_description` text NOT NULL,
	`keywords` text NOT NULL,
	`image` text,
	`faq` text,
	`target_keyword` text,
	`date` text NOT NULL,
	`published_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `content_topics`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `published_posts_slug_locale_unique` ON `published_posts` (`slug`,`locale`);--> statement-breakpoint
CREATE INDEX `published_posts_grp_idx` ON `published_posts` (`grp`);--> statement-breakpoint
CREATE INDEX `published_posts_topic_idx` ON `published_posts` (`topic_id`);--> statement-breakpoint
CREATE INDEX `published_posts_locale_idx` ON `published_posts` (`locale`);--> statement-breakpoint
ALTER TABLE `content_topic_variants` ADD `body` text;