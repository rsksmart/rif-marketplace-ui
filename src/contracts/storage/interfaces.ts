import { BaseToken } from 'models/Token'

export interface OfferContractData {
  totalCapacityMB: string
  periods: number[][]
  prices: string[][]
  tokens: BaseToken[]
}
