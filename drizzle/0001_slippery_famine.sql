CREATE TABLE `setup_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`data` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `setup_drafts_user` ON `setup_drafts` (`user_id`);
--> statement-breakpoint
INSERT OR IGNORE INTO setup_drafts(id,user_id,data,updated_at) SELECT json_extract(data,'$.id'),user_id,data,updated_at FROM drafts WHERE json_extract(data,'$.id') IS NOT NULL;
