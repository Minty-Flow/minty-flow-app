export interface Participant {
  id: string
  name: string
}

export interface ItemSplit {
  participantId: string
  selected: boolean
  percentage: number
}

export interface BillItem {
  id: string
  name: string
  price: number
  quantity: number
  splitEvenly: boolean
  splits: ItemSplit[]
}

export interface BillSummaryEntry {
  participantId: string
  name: string
  owedAmount: number
}
