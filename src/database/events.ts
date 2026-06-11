/**
 * Typed contract for every in-process database event.
 *
 * Events with `{ ids?: string[] }` carry optional IDs so stores can
 * perform targeted refreshes instead of full reloads.
 * Events with `undefined` always trigger a full refresh on the subscriber.
 *
 * | Event | Fired when |
 * |---|---|
 * | `accounts:dirty` | An account is created, updated, reordered, archived, or deleted |
 * | `transactions:dirty` | A transaction is created, updated, or soft-deleted |
 * | `categories:dirty` | A category is mutated or its transaction count may have changed |
 * | `tags:dirty` | A tag is mutated or its transaction count may have changed |
 * | `budgets:dirty` | A budget or its join rows change |
 * | `goals:dirty` | A goal or its join rows change |
 * | `loans:dirty` | A loan is mutated |
 * | `transfers:dirty` | A transfer row is written or deleted |
 * | `recurring_transactions:dirty` | A recurring template is mutated |
 * | `db:reset` | The database was wiped and re-populated (import / recovery) |
 */
type EventMap = {
  "accounts:dirty": { ids?: string[] }
  "transactions:dirty": { ids?: string[] }
  "categories:dirty": undefined
  "tags:dirty": undefined
  "budgets:dirty": undefined
  "goals:dirty": undefined
  "loans:dirty": undefined
  "transfers:dirty": undefined
  "recurring_transactions:dirty": undefined
  "db:reset": undefined
}

/** @internal */
type Listener<K extends keyof EventMap> = (payload: EventMap[K]) => void

/** @internal */
const listeners = {} as {
  [K in keyof EventMap]?: Set<Listener<K>>
}

/**
 * Subscribe to a database event.
 *
 * Listeners are called **synchronously** inside the microtask that flushes the
 * batch, so they must not perform async work or throw (unhandled rejections
 * from async listeners will not surface predictably). Trigger async work by
 * scheduling a `Promise` inside the listener instead.
 *
 * @param event - The event key from {@link EventMap}.
 * @param fn - Callback invoked with the merged payload for that batch.
 * @returns An unsubscribe function — call it to remove the listener.
 *
 * @example
 * ```ts
 * const off = on("accounts:dirty", ({ ids }) => {
 *   accountStore.getState().refreshAll()
 * })
 * // later:
 * off()
 * ```
 */
export function on<K extends keyof EventMap>(
  event: K,
  fn: Listener<K>,
): () => void {
  let set = listeners[event] as Set<Listener<K>> | undefined
  if (!set) {
    set = new Set<Listener<K>>()
    ;(listeners as Record<string, Set<Listener<K>>>)[event] = set
  }
  set.add(fn)
  return () => set?.delete(fn)
}

// --- batching layer ---

/** @internal Pending payloads not yet flushed to listeners. */
const pending = {} as Partial<{ [K in keyof EventMap]: EventMap[K] }>
/** @internal True while a `queueMicrotask(flush)` is already scheduled. */
let scheduled = false

/**
 * Emit a database-change event.
 *
 * **Batching:** Multiple `emit` calls within the same synchronous turn are
 * collapsed into one microtask flush. For events whose payload carries `ids`,
 * successive calls within a single turn union the ID sets — no listener sees
 * duplicate or partial data. Events with `undefined` payload are de-duped by
 * presence.
 *
 * **Ordering:** Listeners always run after the current call-stack unwinds
 * (microtask boundary), so the DB write that triggered the emit is guaranteed
 * to be committed before any store re-hydrates.
 *
 * @param event - The event key from {@link EventMap}.
 * @param payload - The event payload as defined by {@link EventMap}.
 *
 * @example
 * ```ts
 * // Targeted refresh: only the affected account re-renders.
 * emit("accounts:dirty", { ids: [id] })
 *
 * // Broadcast: all account subscribers refresh.
 * emit("accounts:dirty", {})
 * ```
 */
export function emit<K extends keyof EventMap>(
  event: K,
  payload: EventMap[K],
): void {
  const prev = pending[event]

  if (
    payload !== null &&
    payload !== undefined &&
    typeof payload === "object" &&
    "ids" in payload
  ) {
    const prevIds = (prev as { ids?: string[] } | undefined)?.ids ?? []
    const nextIds = (payload as { ids?: string[] }).ids ?? []
    pending[event] = {
      ids: Array.from(new Set([...prevIds, ...nextIds])),
    } as EventMap[K]
  } else {
    pending[event] = payload
  }

  if (!scheduled) {
    scheduled = true
    queueMicrotask(flush)
  }
}

/**
 * Flush all pending events to their listeners.
 *
 * Snapshots and clears the pending map first so that any `emit` calls made
 * *inside* a listener schedule a new microtask rather than being processed in
 * the current flush.
 *
 * @internal
 */
function flush() {
  scheduled = false

  const keys = Object.keys(pending) as (keyof EventMap)[]
  const snapshot = { ...pending }

  for (const key of keys) {
    delete pending[key]
  }

  for (const event of keys) {
    const set = listeners[event]
    if (!set) continue
    const payload = snapshot[event]
    set.forEach((fn) => {
      ;(fn as Listener<typeof event>)(payload as EventMap[typeof event])
    })
  }
}
