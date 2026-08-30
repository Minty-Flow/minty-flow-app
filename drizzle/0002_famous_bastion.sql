ALTER TABLE `loans` ADD `term` text DEFAULT 'one_time' NOT NULL CHECK (`term` IN ('one_time','long_term'));
--> statement-breakpoint
UPDATE `loans` SET `term` = 'long_term' WHERE `term` = 'one_time';
