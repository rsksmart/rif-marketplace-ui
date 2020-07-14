import {
  ExchangeRatePayload, MarketPayload,
  MARKET_ACTIONS,
  TxTypeChangePayload,
} from './marketActions'
import { MarketState } from './MarketStore'

export interface MarketReducer {
  (state: MarketState, payload: MarketPayload): MarketState
}

export type MarketActions = {
  [key in MARKET_ACTIONS]: MarketReducer
}

export const marketActions: MarketActions = {
  NOOP: (state: MarketState, _: MarketPayload) => state,
  TOGGLE_TX_TYPE: (state: MarketState, payload: TxTypeChangePayload) => ({
    ...state,
    ...payload,
  }),
  SET_EXCHANGE_RATE: (state: MarketState, payload: ExchangeRatePayload) => ({
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
