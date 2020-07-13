import { SupportedFiat, tokenDisplayNames, XRService } from 'api/rif-marketplace-cache/rates/xr'
import React, {
  Dispatch, useContext, useEffect, useReducer, useState,
} from 'react'
import AppStore, { AppStoreProps, errorReporter } from 'store/App/AppStore'
import { StoreActions, StoreReducer, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { MarketAction } from './marketActions'
import { marketActions, MarketReducer } from './marketReducer'

export type StoreName = 'market'

export enum TxType {
  BUY = 0,
  SELL = 1
}

export interface MarketState extends StoreState {
  txType: TxType
  exchangeRates: {
    currentFiat: {
      symbol: SupportedFiat
      displayName: string
    }
    crypto: {
      rif: {
        displayName: string
        rate?: number
      }
    }
  }
}

interface MarketStoreProps {
  state: MarketState
  dispatch: Dispatch<MarketAction>
}

export const initialState: MarketState = {
  storeID: 'market',
  txType: TxType.BUY,
  exchangeRates: {
    currentFiat: {
      symbol: 'usd',
      displayName: 'USD',
    },
    crypto: {
      rif: {
        displayName: 'RIF',
      },
    },
  },
}

const MarketStore = React.createContext({} as MarketStoreProps | any)
const marketReducer: MarketReducer | StoreReducer = storeReducerFactory(initialState, marketActions as unknown as StoreActions)

export const MarketStoreProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const [state, dispatch] = useReducer(marketReducer, initialState)
  const {
    exchangeRates: {
      currentFiat: {
        symbol: fiatSymbol,
      },
      crypto,
    },
  } = state as MarketState
  const [supportedCrypto] = useState(Object.keys(crypto).filter((token) => tokenDisplayNames[token])) // prevents update to this list

  const {
    state: {
      apis: {
        'rates/v0': rates,
      },
    }, dispatch: appDispatch,
  }: AppStoreProps = useContext(AppStore)
  const api = rates as XRService

  if (!api.service) {
    api.connect(errorReporter(appDispatch))
  }

  // Initialise
  useEffect(() => {
    const {
      service,
    } = api

    if (service && !isInitialised) {
      setIsInitialised(true)
      try {
        dispatch({
          type: 'REFRESH',
          payload: { refresh: true },
        } as any)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised])

  // fetch if is initialised
  useEffect(() => {
    const { fetch } = api

    if (isInitialised) {
      fetch({ fiatSymbol }).then((newRates: { [fiatSymbol: string]: number }[]) => {
        const payload = Object.keys(newRates).reduce((acc, i) => {
          const symbol = newRates[i].token

          if (supportedCrypto.includes(symbol)) {
            acc[symbol] = {
              rate: newRates[i][fiatSymbol],
              displayName: tokenDisplayNames[symbol],
            }
          }
          return acc
        }, {})
        dispatch({
          type: 'SET_EXCHANGE_RATE',
          payload,
        })
      })
    }
  }, [isInitialised, api, fiatSymbol, supportedCrypto])

  const value = { state, dispatch }
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>
}

export default MarketStore
