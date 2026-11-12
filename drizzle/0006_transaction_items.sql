CREATE TABLE `transaction_items` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`name` text NOT NULL,
	`unit_price` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "transaction_items_unit_price_check" CHECK(typeof(unit_price) = 'integer' AND unit_price BETWEEN -9007199254740991 AND 9007199254740991),
	CONSTRAINT "transaction_items_quantity_check" CHECK("transaction_items"."quantity" >= 1)
);
--> statement-breakpoint
CREATE INDEX `idx_titem_tx` ON `transaction_items` (`transaction_id`);