import { SupportedFiat } from 'api/rif-marketplace-cache/rates/xr'
import { ContextProps, ContextState } from 'context/storeUtils/interfaces'
import { MarketCryptoRecord } from 'models/Market'

export type MarketErrorId = 'market-init'

export type MarketFiat = {
  displayName: string
  symbol: SupportedFiat
}

// STATE
export type ContextName = 'market'
export type State = ContextState & {
  exchangeRates: {
    currentFiat: MarketFiat
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
