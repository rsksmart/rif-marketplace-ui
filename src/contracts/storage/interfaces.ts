import { Token } from 'models/Token'

export interface OfferContractData {
  totalCapacityMB: string
  periods: number[][]
  prices: string[][]
  tokens: Token[]
}
