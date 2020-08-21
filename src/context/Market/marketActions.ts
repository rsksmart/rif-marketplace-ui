import { ContextDispatcher } from 'context/storeUtils/interfaces'
import { MarketCryptoRecord, MarketState, TxType } from './MarketContext'

export type MARKET_ACTION = 'TOGGLE_TX_TYPE' | 'SET_EXCHANGE_RATE'

export type ExchangeRatePayload = MarketCryptoRecord

export interface TxTypeChangePayload {
  txType: TxType
}

export type MarketPayload = TxTypeChangePayload | ExchangeRatePayload

export type MarketAction = ContextDispatcher<MARKET_ACTION, MarketPayload>

export interface MarketReducer<P extends MarketPayload> {
  (state: MarketState, payload: P): MarketState
}

export type MarketActions = {
  TOGGLE_TX_TYPE: MarketReducer<TxTypeChangePayload>
  SET_EXCHANGE_RATE: MarketReducer<ExchangeRatePayload>
}

export const marketActions: MarketActions = {
  TOGGLE_TX_TYPE: (state, payload) => ({
    ...state,
    ...payload,
  }),
  SET_EXCHANGE_RATE: (state, payload) => ({
    ...state,
    exchangeRates: {
      ...state.exchangeRates,
      crypto: {
        ...state.exchangeRates.crypto,
        ...payload,
      },
    },
  }),
}
