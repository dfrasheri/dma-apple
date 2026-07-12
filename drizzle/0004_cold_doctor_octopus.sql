CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`role` text DEFAULT 'coordinator' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`last_assigned_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `team_members_role_active_idx` ON `team_members` (`role`,`active`);