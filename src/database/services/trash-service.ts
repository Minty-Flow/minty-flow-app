import { startOfDay, subDays } from "date-fns"
import { and, sql as drizzleSql, eq, lt, or } from "drizzle-orm"

import { getTrashRetentionDays } from "~/constants/trash-retention"
import {
  accounts,
  transactions,
  transactionTags,
  transfers,
} from "~/database/drizzle/schema"
import {
  type Db,
  getTransferLegs,
  requireTx,
  txSelection,
} from "~/database/services/ledger-rows"
import { type DbTransaction, runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import {
  attachmentFilesFromExtra,
  deleteAttachmentFiles,
} from "~/database/utils/attachment-files"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import type { TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"

function destroyTransferById(txId: string, db: Db, files?: Set<string>): void {
  const legs = getTransferLegs(txId, db)

  for (const leg of legs) {
    if (!leg.is_deleted && !leg.is_pending) {
      const delta = getBalanceDelta(
        leg.amount,
        leg.type as TransactionType,
        leg.subtype,
      )
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} - ${delta}`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(accounts.id, leg.account_id))
        .run()
    }
  }

  for (const leg of legs) {
    for (const f of attachmentFilesFromExtra(leg.extra)) files?.add(f)
    db.delete(transactionTags)
      .where(eq(transactionTags.transactionId, leg.id))
      .run()
    db.delete(transactions).where(eq(transactions.id, leg.id)).run()
  }
  db.delete(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, txId),
        eq(transfers.toTransactionId, txId),
      ),
    )
    .run()
}

/**
 * Run a permanent delete and, once it has committed, remove the attachment
 * files of every row it destroyed. Deleting before the commit would lose files
 * a rolled-back delete still references. The set de-duplicates a retried run.
 */
async function destroyingTransactions(
  name: string,
  fn: (db: DbTransaction, files: Set<string>) => void,
): Promise<void> {
  const files = new Set<string>()
  await runInTransaction(name, (db) => fn(db, files))
  await deleteAttachmentFiles(files)
}

export async function destroyTransaction(id: string): Promise<void> {
  await destroyingTransactions("transaction.destroy", (db, files) =>
    destroyTransactionInTx(db, id, files),
  )
}

function destroyTransactionInTx(
  db: DbTransaction,
  id: string,
  files: Set<string>,
): void {
  const now = new Date().toISOString()

  const tx = requireTx(db, id)

  const transferPartner = db
    .select({ id: transfers.id })
    .from(transfers)
    .where(
      or(
        eq(transfers.fromTransactionId, id),
        eq(transfers.toTransactionId, id),
      ),
    )
    .get()
  if (transferPartner) {
    destroyTransferById(tx.id, db, files)
    return
  }

  if (!tx.is_deleted) {
    if (!tx.is_pending) {
      const delta = getBalanceDelta(
        tx.amount,
        tx.type as TransactionType,
        tx.subtype,
      )
      db.update(accounts)
        .set({
          balance: drizzleSql`${accounts.balance} - ${delta}`,
          updatedAt: now,
        })
        .where(eq(accounts.id, tx.account_id))
        .run()
    }
  }

  db.delete(transactionTags).where(eq(transactionTags.transactionId, id)).run()

  if (tx.type === "transfer") {
    db.delete(transfers)
      .where(
        or(
          eq(transfers.fromTransactionId, id),
          eq(transfers.toTransactionId, id),
        ),
      )
      .run()
  }

  for (const f of attachmentFilesFromExtra(tx.extra)) files.add(f)
  db.delete(transactions).where(eq(transactions.id, id)).run()
}

/**
 * Destroying one leg of a transfer hard-deletes both, so in a batch the second
 * leg's id may already be gone. Skip it instead of failing the whole batch.
 */
function destroyTransactionIfPresent(
  db: DbTransaction,
  id: string,
  files: Set<string>,
): void {
  const exists = db
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.id, id))
    .get()
  if (exists) destroyTransactionInTx(db, id, files)
}

export async function destroyAllDeletedTransactions(): Promise<void> {
  // Select inside the write transaction: a restore queued after the read would
  // otherwise be hard-deleted.
  await destroyingTransactions("trash.destroyAll", (db, files) => {
    const deleted = db
      .select(txSelection)
      .from(transactions)
      .where(eq(transactions.isDeleted, 1))
      .all()
    for (const tx of deleted) destroyTransactionIfPresent(db, tx.id, files)
  })
}

export async function autoPurgeTrash(retentionValue: string): Promise<void> {
  const days = getTrashRetentionDays(retentionValue)
  if (days === null) return

  const cutoff = startOfDay(subDays(new Date(), days)).toISOString()

  let toPurge: RowTransaction[] = []

  try {
    await destroyingTransactions("trash.autoPurge", (db, files) => {
      // Read inside the transaction so a concurrent restore is not purged.
      toPurge = db
        .select(txSelection)
        .from(transactions)
        .where(
          and(
            eq(transactions.isDeleted, 1),
            lt(transactions.deletedAt, cutoff),
          ),
        )
        .all()
      for (const tx of toPurge) destroyTransactionIfPresent(db, tx.id, files)
    })
    return
  } catch (err) {
    logger.error("[autoPurgeTrash] batch failed, retrying row by row", {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  // One bad row rolled the batch back; isolate it so the rest still purge.
  for (const tx of toPurge) {
    try {
      await destroyingTransactions("trash.autoPurgeRow", (db, files) =>
        destroyTransactionIfPresent(db, tx.id, files),
      )
    } catch (err) {
      logger.error("[autoPurgeTrash] failed to destroy transaction", {
        id: tx.id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}
