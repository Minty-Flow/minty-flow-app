ALTER TABLE `transactions` ADD `kind` text DEFAULT 'default' NOT NULL CHECK (`kind` IN ('default','upcoming','subscription','repetitive','lent','borrowed'));
--> statement-breakpoint
UPDATE `transactions` SET `kind` = 'repetitive' WHERE `subtype` = 'recurring' AND `kind` = 'default';
--> statement-breakpoint
UPDATE `transactions` SET `kind` = CASE (SELECT `loan_type` FROM `loans` WHERE `loans`.`id` = `transactions`.`loan_id`) WHEN 'lent' THEN 'lent' WHEN 'borrowed' THEN 'borrowed' ELSE `kind` END WHERE `loan_id` IS NOT NULL AND `kind` IN ('default','repetitive');
--> statement-breakpoint
UPDATE `transactions` SET `kind` = 'upcoming' WHERE `is_pending` = 1 AND `kind` = 'default' AND `type` <> 'transfer';
--> statement-breakpoint
UPDATE `transactions` SET `subtype` = NULL WHERE `subtype` IN ('recurring','one-time','loan_borrowed','loan_repayment','loan_lent','loan_received');
