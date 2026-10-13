-- A loan-linked transaction carries the kind of its loan: `lent` for a lent
-- loan, `borrowed` for a borrowed one. Switching a loan's type on the edit
-- screen flipped the opening entry's type but not its kind, leaving rows such
-- as kind = 'lent', type = 'income' on a borrowed loan. Align every
-- loan-linked row with its loan.
UPDATE `transactions`
SET `kind` = CASE (SELECT `loan_type` FROM `loans` WHERE `loans`.`id` = `transactions`.`loan_id`)
  WHEN 'lent' THEN 'lent'
  ELSE 'borrowed'
END
WHERE `loan_id` IS NOT NULL
  AND EXISTS (SELECT 1 FROM `loans` WHERE `loans`.`id` = `transactions`.`loan_id`)
  AND `kind` != CASE (SELECT `loan_type` FROM `loans` WHERE `loans`.`id` = `transactions`.`loan_id`)
    WHEN 'lent' THEN 'lent'
    ELSE 'borrowed'
  END;
