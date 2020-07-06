import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { TxType } from './MarketStore'

export type MARKET_ACTIONS = 'NOOP' | 'TOGGLE_TX_TYPE' | 'SET_EXCHANGE_RATE'

export interface ExchangeRatePayload {
  [symbol: string]: {
    displayName: string
    rate: number
  }
}

export interface TxTypeChangePayload {
  txType: TxType
}

export type MarketPayload = TxTypeChangePayload & ExchangeRatePayload

export interface MarketAction extends StoreDispatcher<MarketPayload> {
  type: MARKET_ACTIONS
}
