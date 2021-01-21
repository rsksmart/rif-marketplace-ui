import {
  SupportedFiat, XRItem, XRService,
} from 'api/rif-marketplace-cache/rates/xr'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { ContextActions, ContextReducer, ContextState } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { MarketCryptoRecord, TokenXR } from 'models/Market'
import { UIError } from 'models/UIMessage'
import React, {
  Dispatch, useCallback, useContext, useEffect, useReducer, useState,
} from 'react'
import { getSysTokenByName } from 'utils/tokenUtils'
import {
  MarketAction, marketActions, MarketPayload, MarketReducer,
} from './marketActions'

export type ContextName = 'market'

export type MarketErrorId = 'market-init'

export type MarketFiat = {
  displayName: string
  symbol: SupportedFiat
}

export interface MarketState extends ContextState {
  exchangeRates: {
    currentFiat: MarketFiat
    crypto: MarketCryptoRecord
  }
}

export interface MarketContextProps {
  state: MarketState
  dispatch: Dispatch<MarketAction>
}

export const initialState: MarketState = {
  contextID: 'market',
  exchangeRates: {
    currentFiat: {
      symbol: 'usd',
      displayName: 'USD',
    },
    crypto: {},
  },
}

const MarketContext = React.createContext({} as MarketContextProps | any)
const marketReducer: MarketReducer<MarketPayload> | ContextReducer = storeReducerFactory(initialState, marketActions as unknown as ContextActions)

export const MarketContextProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const [state, dispatch] = useReducer<MarketReducer<MarketPayload>>(marketReducer as any, initialState)
  const {
    exchangeRates: {
      currentFiat: {
        symbol: fiatSymbol,
      },
    },
  } = state as MarketState

  const { state: appState, dispatch: appDispatch }: AppContextProps = useContext(AppContext)
  const api = appState?.apis?.['rates/v0'] as XRService

  const errorReporter = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  // Initialise
  useEffect(() => {
    if (api && !isInitialised) {
      api.connect(errorReporter)

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
  }, [api, isInitialised, errorReporter])

  // fetch if is initialised
  useEffect(() => {
    if (isInitialised) {
      const { fetch } = api

      fetch({ fiatSymbol })
        .then((newRates: XRItem[]) => {
          const payload = Object.keys(newRates)
            .reduce((acc, i) => {
              const symbol = newRates[i].token
              const token: TokenXR = {
                ...getSysTokenByName(symbol),
                rate: newRates[i][fiatSymbol],
              }
              acc[symbol] = token
              return acc
            }, {})
          dispatch({
            type: 'SET_EXCHANGE_RATE',
            payload,
          } as any)
        })
        .catch((error) => errorReporter({
          error,
          id: 'market-init',
          text: 'Failed to initialise currency',
        }))
    }
  }, [isInitialised, api, fiatSymbol, errorReporter])

  const value = { state, dispatch }
  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}

export default MarketContext
