DROP INDEX `idx_ba_budget`;--> statement-breakpoint
DROP INDEX `idx_bc_budget`;--> statement-breakpoint
DROP INDEX `idx_ga_goal`;--> statement-breakpoint
DROP INDEX `idx_ttag_tx`;--> statement-breakpoint
DROP INDEX `idx_tx_date`;--> statement-breakpoint
DROP INDEX `idx_tx_account`;--> statement-breakpoint
DROP INDEX `idx_tx_category`;--> statement-breakpoint
DROP INDEX `idx_tx_goal`;--> statement-breakpoint
DROP INDEX `idx_tx_loan`;--> statement-breakpoint
DROP INDEX `idx_tx_loan_deleted`;--> statement-breakpoint
CREATE INDEX `idx_tx_pending_date` ON `transactions` (`is_pending`,`is_deleted`,`transaction_date`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_tx_goal_deleted_date` ON `transactions` (`goal_id`,`is_deleted`,`transaction_date`,`created_at`) WHERE "transactions"."goal_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_tx_loan_deleted_date` ON `transactions` (`loan_id`,`is_deleted`,`transaction_date`,`created_at`) WHERE "transactions"."loan_id" IS NOT NULL;--> statement-breakpoint
DROP INDEX `idx_transfer_from_tx`;--> statement-breakpoint
DROP INDEX `idx_transfer_to_tx`;