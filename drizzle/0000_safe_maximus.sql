CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`currency_code` text NOT NULL,
	`icon` text,
	`color_scheme_name` text,
	`is_primary` integer DEFAULT 0 NOT NULL,
	`exclude_from_balance` integer DEFAULT 0 NOT NULL,
	`is_archived` integer DEFAULT 0 NOT NULL,
	`sort_order` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "accounts_type_check" CHECK("accounts"."type" IN ('checking', 'savings', 'credit', 'investment', 'other')),
	CONSTRAINT "accounts_balance_check" CHECK(typeof(balance) = 'integer' AND balance BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "accounts_is_primary_check" CHECK("accounts"."is_primary" IN (0, 1)),
	CONSTRAINT "accounts_exclude_from_balance_check" CHECK("accounts"."exclude_from_balance" IN (0, 1)),
	CONSTRAINT "accounts_is_archived_check" CHECK("accounts"."is_archived" IN (0, 1))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_accounts_only_one_primary` ON `accounts` (`is_primary`) WHERE "accounts"."is_primary" = 1;--> statement-breakpoint
CREATE TABLE `budget_accounts` (
	`budget_id` text NOT NULL,
	`account_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`budget_id`, `account_id`),
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_ba_budget` ON `budget_accounts` (`budget_id`);--> statement-breakpoint
CREATE INDEX `idx_ba_account` ON `budget_accounts` (`account_id`);--> statement-breakpoint
CREATE TABLE `budget_categories` (
	`budget_id` text NOT NULL,
	`category_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`budget_id`, `category_id`),
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_bc_budget` ON `budget_categories` (`budget_id`);--> statement-breakpoint
CREATE INDEX `idx_bc_category` ON `budget_categories` (`category_id`);--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`amount` integer NOT NULL,
	`currency_code` text NOT NULL,
	`period` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`alert_threshold` real,
	`is_active` integer DEFAULT 1 NOT NULL,
	`icon` text,
	`color_scheme_name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "budgets_amount_check" CHECK(typeof(amount) = 'integer' AND amount BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "budgets_period_check" CHECK("budgets"."period" IN ('daily', 'weekly', 'monthly', 'yearly', 'custom')),
	CONSTRAINT "budgets_alert_threshold_check" CHECK("budgets"."alert_threshold" IS NULL OR ("budgets"."alert_threshold" >= 0 AND "budgets"."alert_threshold" <= 100)),
	CONSTRAINT "budgets_is_active_check" CHECK("budgets"."is_active" IN (0, 1))
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`icon` text,
	`color_scheme_name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "categories_type_check" CHECK("categories"."type" IN ('expense', 'income'))
);
--> statement-breakpoint
CREATE TABLE `goal_accounts` (
	`goal_id` text NOT NULL,
	`account_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`goal_id`, `account_id`),
	FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_ga_goal` ON `goal_accounts` (`goal_id`);--> statement-breakpoint
CREATE INDEX `idx_ga_account` ON `goal_accounts` (`account_id`);--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`target_amount` integer NOT NULL,
	`currency_code` text NOT NULL,
	`target_date` text,
	`icon` text,
	`color_scheme_name` text,
	`goal_type` text NOT NULL,
	`is_archived` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "goals_target_amount_check" CHECK(typeof(target_amount) = 'integer' AND target_amount BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "goals_goal_type_check" CHECK("goals"."goal_type" IN ('savings', 'expense')),
	CONSTRAINT "goals_is_archived_check" CHECK("goals"."is_archived" IN (0, 1))
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`principal_amount` integer NOT NULL,
	`loan_type` text NOT NULL,
	`due_date` text,
	`account_id` text NOT NULL,
	`category_id` text NOT NULL,
	`icon` text,
	`color_scheme_name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "loans_principal_amount_check" CHECK(typeof(principal_amount) = 'integer' AND principal_amount BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "loans_loan_type_check" CHECK("loans"."loan_type" IN ('lent', 'borrowed'))
);
--> statement-breakpoint
CREATE INDEX `idx_loan_account` ON `loans` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_loan_category` ON `loans` (`category_id`);--> statement-breakpoint
CREATE TABLE `recurring_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`json_transaction_template` text NOT NULL,
	`transfer_to_account_id` text,
	`range` text NOT NULL,
	`rules` text NOT NULL,
	`last_generated_transaction_date` text,
	`disabled` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`transfer_to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "recurring_disabled_check" CHECK("recurring_transactions"."disabled" IN (0, 1))
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color_scheme_name` text,
	`icon` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "tags_type_check" CHECK("tags"."type" IN ('generic', 'location', 'contact'))
);
--> statement-breakpoint
CREATE TABLE `transaction_tags` (
	`transaction_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`transaction_id`, `tag_id`),
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_ttag_tx` ON `transaction_tags` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_ttag_tag` ON `transaction_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`category_id` text,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`transaction_date` text NOT NULL,
	`title` text,
	`description` text,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`deleted_at` text,
	`is_pending` integer DEFAULT 0 NOT NULL,
	`requires_manual_confirmation` integer DEFAULT 0 NOT NULL,
	`account_balance_before` integer DEFAULT 0 NOT NULL,
	`subtype` text,
	`extra` text,
	`has_attachments` integer DEFAULT 0 NOT NULL,
	`recurring_id` text,
	`location` text,
	`goal_id` text,
	`budget_id` text,
	`loan_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`recurring_id`) REFERENCES `recurring_transactions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "transactions_type_check" CHECK("transactions"."type" IN ('expense', 'income', 'transfer')),
	CONSTRAINT "transactions_amount_check" CHECK(typeof(amount) = 'integer' AND amount BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "transactions_is_deleted_check" CHECK("transactions"."is_deleted" IN (0, 1)),
	CONSTRAINT "transactions_is_pending_check" CHECK("transactions"."is_pending" IN (0, 1)),
	CONSTRAINT "transactions_requires_manual_confirmation_check" CHECK("transactions"."requires_manual_confirmation" IN (0, 1)),
	CONSTRAINT "transactions_account_balance_before_check" CHECK(typeof(account_balance_before) = 'integer' AND account_balance_before BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "transactions_subtype_check" CHECK("transactions"."subtype" IS NULL OR "transactions"."subtype" IN ('recurring', 'one-time', 'refund', 'loan_borrowed', 'loan_repayment', 'loan_lent', 'loan_received')),
	CONSTRAINT "transactions_has_attachments_check" CHECK("transactions"."has_attachments" IN (0, 1))
);
--> statement-breakpoint
CREATE INDEX `idx_tx_date` ON `transactions` (`transaction_date`);--> statement-breakpoint
CREATE INDEX `idx_tx_account` ON `transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_tx_category` ON `transactions` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_tx_is_deleted` ON `transactions` (`is_deleted`);--> statement-breakpoint
CREATE INDEX `idx_tx_is_pending` ON `transactions` (`is_pending`);--> statement-breakpoint
CREATE INDEX `idx_tx_type` ON `transactions` (`type`);--> statement-breakpoint
CREATE INDEX `idx_tx_goal` ON `transactions` (`goal_id`);--> statement-breakpoint
CREATE INDEX `idx_tx_budget` ON `transactions` (`budget_id`);--> statement-breakpoint
CREATE INDEX `idx_tx_loan` ON `transactions` (`loan_id`);--> statement-breakpoint
CREATE INDEX `idx_tx_loan_deleted` ON `transactions` (`loan_id`,`is_deleted`);--> statement-breakpoint
CREATE INDEX `idx_tx_recurring` ON `transactions` (`recurring_id`);--> statement-breakpoint
CREATE INDEX `idx_tx_date_created` ON `transactions` (`transaction_date`,`created_at`);--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`from_transaction_id` text NOT NULL,
	`to_transaction_id` text NOT NULL,
	`from_account_id` text NOT NULL,
	`to_account_id` text NOT NULL,
	`conversion_rate` real DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`from_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_transfer_from_tx` ON `transfers` (`from_transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_transfer_to_tx` ON `transfers` (`to_transaction_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `transfers_from_transaction_id_unique` ON `transfers` (`from_transaction_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `transfers_to_transaction_id_unique` ON `transfers` (`to_transaction_id`);
