CREATE TABLE `transaction_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`match_field` text NOT NULL,
	`match_type` text NOT NULL,
	`match_value` text NOT NULL,
	`set_category_id` text,
	`set_subtype` text,
	`set_tag_ids` text,
	`priority` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`set_category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "transaction_rules_match_field_check" CHECK("transaction_rules"."match_field" IN ('title', 'description')),
	CONSTRAINT "transaction_rules_match_type_check" CHECK("transaction_rules"."match_type" IN ('contains', 'equals', 'starts_with')),
	CONSTRAINT "transaction_rules_is_active_check" CHECK("transaction_rules"."is_active" IN (0, 1))
);
--> statement-breakpoint
CREATE INDEX `idx_txrule_priority` ON `transaction_rules` (`priority`);--> statement-breakpoint
CREATE INDEX `idx_txrule_active` ON `transaction_rules` (`is_active`);--> statement-breakpoint
ALTER TABLE `transactions` ADD `category_source` text;