-- #161: PEPE and SHIB move from 8 to 2 minor-unit digits. Every stored amount
-- in those currencies is divided by 10^6 and rounded half away from zero to
-- the nearest 0.01 unit. One-way. Keep the code list in sync with
-- LOW_PRICE_CRYPTO_CODES (currency-registry.ts) and the v8 backup rescale.
UPDATE accounts
SET balance = CAST(ROUND(balance / 1000000.0) AS INTEGER)
WHERE currency_code IN ('PEPE', 'SHIB');
--> statement-breakpoint
UPDATE transactions
SET amount = CAST(ROUND(amount / 1000000.0) AS INTEGER),
  account_balance_before = CAST(ROUND(account_balance_before / 1000000.0) AS INTEGER)
WHERE account_id IN (SELECT id FROM accounts WHERE currency_code IN ('PEPE', 'SHIB'));
--> statement-breakpoint
UPDATE transaction_items
SET unit_price = CAST(ROUND(unit_price / 1000000.0) AS INTEGER)
WHERE transaction_id IN (
  SELECT t.id FROM transactions t
  JOIN accounts a ON a.id = t.account_id
  WHERE a.currency_code IN ('PEPE', 'SHIB')
);
--> statement-breakpoint
UPDATE budgets
SET amount = CAST(ROUND(amount / 1000000.0) AS INTEGER)
WHERE currency_code IN ('PEPE', 'SHIB');
--> statement-breakpoint
UPDATE goals
SET target_amount = CAST(ROUND(target_amount / 1000000.0) AS INTEGER)
WHERE currency_code IN ('PEPE', 'SHIB');
--> statement-breakpoint
UPDATE loans
SET principal_amount = CAST(ROUND(principal_amount / 1000000.0) AS INTEGER)
WHERE account_id IN (SELECT id FROM accounts WHERE currency_code IN ('PEPE', 'SHIB'));
--> statement-breakpoint
UPDATE recurring_transactions
SET json_transaction_template = json_set(
  json_transaction_template,
  '$.amount',
  CAST(ROUND(json_extract(json_transaction_template, '$.amount') / 1000000.0) AS INTEGER)
)
WHERE json_valid(json_transaction_template)
  AND json_extract(json_transaction_template, '$.amount') IS NOT NULL
  AND json_extract(json_transaction_template, '$.accountId') IN (
    SELECT id FROM accounts WHERE currency_code IN ('PEPE', 'SHIB')
  );
