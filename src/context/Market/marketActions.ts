import { ContextDispatch } from 'context/storeUtils/interfaces'
import { MarketCryptoRecord } from 'models/Market'
import { MarketState } from './MarketContext'

export type MARKET_ACTION = 'TOGGLE_TX_TYPE' | 'SET_EXCHANGE_RATE'

export type ExchangeRatePayload = MarketCryptoRecord

export type MarketPayload = ExchangeRatePayload

export type MarketAction = ContextDispatch<MARKET_ACTION, MarketPayload>

export interface MarketReducer<P extends MarketPayload> {
  (state: MarketState, payload: P): MarketState
}

export type MarketActions = {
  SET_EXCHANGE_RATE: MarketReducer<ExchangeRatePayload>
}

export const marketActions: MarketActions = {
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
