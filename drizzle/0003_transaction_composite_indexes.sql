DROP INDEX `idx_tx_is_deleted`;--> statement-breakpoint
DROP INDEX `idx_tx_is_pending`;--> statement-breakpoint
DROP INDEX `idx_tx_type`;--> statement-breakpoint
CREATE INDEX `idx_tx_deleted_date` ON `transactions` (`is_deleted`,`transaction_date`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_tx_account_state_date` ON `transactions` (`account_id`,`is_pending`,`is_deleted`,`transaction_date`);--> statement-breakpoint
CREATE INDEX `idx_tx_deleted_at` ON `transactions` (`is_deleted`,`deleted_at`);--> statement-breakpoint
CREATE INDEX `idx_tx_category_deleted` ON `transactions` (`category_id`,`is_deleted`);