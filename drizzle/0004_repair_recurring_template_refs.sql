-- Repair recurring rules whose JSON template points at a deleted category or
-- account. Such a rule inserted a transaction with a dead foreign key on every
-- sync, failed, and stopped generating for good.
--
-- A template that is not valid JSON is left alone; the sync already tolerates it.

-- A deleted category: clear it from the template.
UPDATE `recurring_transactions`
SET `json_transaction_template` = json_set(`json_transaction_template`, '$.categoryId', NULL)
WHERE json_valid(`json_transaction_template`)
  AND json_extract(`json_transaction_template`, '$.categoryId') IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM `categories`
    WHERE `categories`.`id` = json_extract(`recurring_transactions`.`json_transaction_template`, '$.categoryId')
  );--> statement-breakpoint

-- A destroyed account: the rule can no longer generate, so disable it.
UPDATE `recurring_transactions`
SET `disabled` = 1
WHERE `disabled` = 0
  AND json_valid(`json_transaction_template`)
  AND NOT EXISTS (
    SELECT 1 FROM `accounts`
    WHERE `accounts`.`id` = json_extract(`recurring_transactions`.`json_transaction_template`, '$.accountId')
  );--> statement-breakpoint

-- A transfer rule whose destination account was destroyed: the foreign key set
-- it to NULL, and the rule would now generate plain expenses.
UPDATE `recurring_transactions`
SET `disabled` = 1
WHERE `disabled` = 0
  AND `transfer_to_account_id` IS NULL
  AND json_valid(`json_transaction_template`)
  AND json_extract(`json_transaction_template`, '$.type') = 'transfer';
