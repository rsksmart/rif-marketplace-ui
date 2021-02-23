import React, {
  createContext, FC, useContext, useEffect, useMemo, useReducer,
} from 'react'
import createReducer from 'context/storeUtils/reducer'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App'
import { XRItem, XRService } from 'api/rif-marketplace-cache/rates/xr'
import { MarketCryptoRecord, TokenXR } from 'models/Market'
import { getSysTokenByName } from 'utils/tokenUtils'
import { SUPPORTED_FIAT } from 'models/Fiat'
import actions from './actions'
import { Props, State } from './interfaces'

export const initialState: State = {
  contextID: 'market',
  exchangeRates: {
    currentFiat: SUPPORTED_FIAT.usd,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    crypto: {} as MarketCryptoRecord,
  },
}

const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const {
    state: {
      apis: {
        'rates/v0': ratesApi,
      },
    },
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const {
    connect, service, fetch,
  } = ratesApi as XRService

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const reportError = useMemo(
    () => errorReporterFactory(
      appDispatch,
    ), [appDispatch],
  )

  const {
    exchangeRates: {
      currentFiat: {
        symbol: fiatSymbol,
      },
    },
  } = state

  // Initialise
  if (!service) {
    connect(reportError)
  }

  // fetch if is initialised
  useEffect(() => {
    if (service) {
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
            }, {}) as MarketCryptoRecord

          dispatch({
            type: 'SET_EXCHANGE_RATE',
            payload,
          })
        })
        .catch((error) => reportError({
          error,
          id: 'market-init',
          text: 'Failed to initialise currency',
        }))
    }
  }, [service, fetch, fiatSymbol, reportError])

  // Finalise
  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default Context
