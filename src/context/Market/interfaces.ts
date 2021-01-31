import { ContextProps, ContextState } from 'context/storeUtils/interfaces'
import { BaseFiat } from 'models/Fiat'
import { MarketCryptoRecord } from 'models/Market'

export type MarketErrorId = 'market-init'

// STATE
export type ContextName = 'market'
export type State = ContextState & {
  exchangeRates: {
    currentFiat: BaseFiat
    crypto: MarketCryptoRecord
  }
}

// ACTIONS
export type Action = (
  | {
    type: 'SET_EXCHANGE_RATE'
    payload: MarketCryptoRecord
  }
)

export type Actions = {
  SET_EXCHANGE_RATE: (state: State, payload: MarketCryptoRecord) => State
}

// PROPS
export type Props = ContextProps<State, Action>
