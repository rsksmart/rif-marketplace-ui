import {
  SupportedFiat, tokenDisplayNames, XRService, XRItem,
} from 'api/rif-marketplace-cache/rates/xr'
import React, {
  Dispatch, useContext, useEffect, useReducer, useState,
} from 'react'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { StoreActions, StoreReducer, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import {
  MarketAction, MarketPayload, marketActions, MarketReducer,
} from './marketActions'

export type StoreName = 'market'

export enum TxType {
  BUY = 0,
  SELL = 1
}

export type MarketFiat = {
  displayName: string
  symbol: SupportedFiat
}

export type MarketCrypto = {
  displayName: string
  rate: number
}

export type MarketCryptoRecord = Record<string, MarketCrypto>

export interface MarketState extends StoreState {
  txType: TxType
  exchangeRates: {
    currentFiat: MarketFiat
    crypto: MarketCryptoRecord
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
        rate: -1,
      },
      rbtc: {
        displayName: 'RBTC',
        rate: -1
      },
    },
  },
}

const MarketStore = React.createContext({} as MarketStoreProps | any)
const marketReducer: MarketReducer<MarketPayload> | StoreReducer = storeReducerFactory(initialState, marketActions as unknown as StoreActions)

export const MarketStoreProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const [state, dispatch] = useReducer<MarketReducer<MarketPayload>>(marketReducer as any, initialState)
  const {
    exchangeRates: {
      currentFiat: {
        symbol: fiatSymbol,
      },
      crypto,
    },
  } = state as MarketState
  const [supportedCrypto] = useState(Object.keys(crypto).filter((token) => tokenDisplayNames[token])) // prevents update to this list

  const { state: appState, dispatch: appDispatch }: AppStoreProps = useContext(AppStore)
  const api = appState?.apis?.['rates/v0'] as XRService

  // Initialise
  useEffect(() => {
    if (api && !isInitialised) {
      api.connect(errorReporterFactory(appDispatch))

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
  }, [api, isInitialised, appDispatch])

  // fetch if is initialised
  useEffect(() => {
    if (isInitialised) {
      const { fetch } = api

      fetch({ fiatSymbol }).then((newRates: XRItem[]) => {
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
        } as any)
      })
    }
  }, [isInitialised, api, fiatSymbol, supportedCrypto])

  const value = { state, dispatch }
  return <MarketStore.Provider value={value}>{children}</MarketStore.Provider>
}

export default MarketStore
