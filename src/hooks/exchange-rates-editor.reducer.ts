// ─── Reducer ─────────────────────────────────────────────────────────────────

export type EditorState = {
  searchQuery: string
  editingCurrencyCode: string | null
  draftRates: Record<string, number>
}

export type EditorAction =
  | { type: "SELECT_ENTRY"; code: string; rate: number }
  | { type: "DESELECT" }
  | { type: "DRAFT_CHANGE"; code: string; value: number }
  | { type: "CLEAR_DRAFT"; code: string }
  | { type: "SET_SEARCH"; query: string }

export const INITIAL_EDITOR_STATE: EditorState = {
  searchQuery: "",
  editingCurrencyCode: null,
  draftRates: {},
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "SELECT_ENTRY":
      return {
        ...state,
        editingCurrencyCode:
          state.editingCurrencyCode === action.code ? null : action.code,
        draftRates: { ...state.draftRates, [action.code]: action.rate },
      }
    case "DESELECT":
      return { ...state, editingCurrencyCode: null }
    case "DRAFT_CHANGE":
      return {
        ...state,
        draftRates: { ...state.draftRates, [action.code]: action.value },
      }
    case "CLEAR_DRAFT": {
      const next = { ...state.draftRates }
      delete next[action.code]
      return { ...state, editingCurrencyCode: null, draftRates: next }
    }
    case "SET_SEARCH":
      return { ...state, searchQuery: action.query }
    default:
      return state
  }
}
