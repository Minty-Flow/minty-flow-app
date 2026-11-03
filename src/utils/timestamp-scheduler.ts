export class TimestampScheduler {
  private listeners = new Map<number, Set<() => void>>()
  private timeouts = new Map<number, ReturnType<typeof setTimeout>>()
  subscribe(timestamp: number, callback: () => void): () => void {
    const existed = this.listeners.has(timestamp)
    if (!existed) this.listeners.set(timestamp, new Set())
    this.listeners.get(timestamp)?.add(callback)
    // The callback must be registered before an already-due timestamp fires.
    if (!existed) this.scheduleTimestamp(timestamp)
    return () => {
      const set = this.listeners.get(timestamp)
      if (!set) return
      set.delete(callback)
      if (set.size === 0) {
        this.listeners.delete(timestamp)
        const timeout = this.timeouts.get(timestamp)
        if (timeout) {
          clearTimeout(timeout)
          this.timeouts.delete(timestamp)
        }
      }
    }
  }
  private scheduleTimestamp(timestamp: number) {
    const check = () => {
      const remaining = timestamp - Date.now()
      // Timers can fire a tick early; keep checking until the exact time.
      if (remaining > 0) {
        this.timeouts.set(timestamp, setTimeout(check, remaining))
        return
      }
      this.timeouts.delete(timestamp)
      this.notifyListeners(timestamp)
    }
    this.timeouts.set(timestamp, setTimeout(check, timestamp - Date.now()))
  }
  private notifyListeners(timestamp: number) {
    const set = this.listeners.get(timestamp)
    if (set) {
      for (const cb of set) cb()
    }
  }
}
export const timestampScheduler = new TimestampScheduler()
