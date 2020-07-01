import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { TxType } from './MarketStore'

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  TOGGLE_TX_TYPE = 'TOGGLE_TX_TYPE',
  SET_EXCHANGE_RATE = 'SET_EXCHANGE_RATE'
}

export interface ExchangeRatePayload {
  [symbol: string]: {
    displayName: string
    rate: number
  }
}

export interface TxTypeChangePayload {
  txType: TxType
}

export type MarketPayloadType = TxTypeChangePayload & ExchangeRatePayload

export interface MarketAction extends StoreDispatcher<MarketPayloadType> {
  type: MARKET_ACTIONS
}
