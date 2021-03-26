import { NotifierOffersService } from 'api/rif-marketplace-cache/notifier'
import { notifierOffersAddress } from 'api/rif-marketplace-cache/notifier/offers'
import AppContext, { AppContextProps } from 'context/App'
import MarketContext, { MarketContextProps } from 'context/Market'
import createWithContext from 'context/storeUtils/createWithContext'
import createReducer from 'context/storeUtils/reducer'
import useErrorReporter from 'hooks/useErrorReporter'
import { SUPPORTED_FIAT } from 'models/Fiat'
import { UIError } from 'models/UIMessage'
import React, {
  createContext, FC, useContext, useEffect, useReducer, useState,
} from 'react'
import actions from './actions'
import { Props, State } from './interfaces'

export const contextName = 'notifier_offers' as const

export const initialState: State = {
  contextID: contextName,
  listing: {
    items: [],
  },
  filters: {
    size: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0,
      fiatSymbol: SUPPORTED_FIAT.usd.symbol,
    },
    currency: new Set(),
    channels: new Set(),
  },
  limits: {
    size: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0,
      fiatSymbol: SUPPORTED_FIAT.usd.symbol,
    },
  },
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)
  const [isLimitsSet, setIsLimitsSet] = useState(false)

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)

  const {
    state: {
      exchangeRates: {
        currentFiat: {
          symbol: fiatSymbol,
        },
      },
    },
  }: MarketContextProps = useContext(MarketContext)

  const api: NotifierOffersService = appState.apis[
    notifierOffersAddress] as NotifierOffersService

  const reportError = useErrorReporter()

  // Initialise
  if (!api.service) {
    api.connect(reportError)
  }

  useEffect(() => {
    if (api?.service && !isInitialised) {
      try {
        setIsInitialised(true)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised])

  // (re)fetch limits upon refresh if initialised
  useEffect(() => {
    if (isInitialised && !isLimitsSet) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'filters',
        },
      })
      try {
        Promise.all([
          api.findLimits({ fiatSymbol })
            .then((limits) => {
              dispatch({
                type: 'UPDATE_LIMITS',
                payload: limits,
              })
              dispatch({
                type: 'FILTER',
                payload: limits,
              })
            })
            .catch((error) => {
              throw new UIError({
                error,
                id: 'service-fetch',
                text: 'Error while fetching filters. ',
              })
            }),
        ]).then(() => {
          setIsLimitsSet(true)
        })
      } catch (error) {
        reportError(new UIError({
          error,
          id: 'service-fetch',
          text: 'Error while fetching filters.',
        }))
      } finally {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'filters',
          },
        })
      }
    }
  }, [
    api,
    fiatSymbol,
    isInitialised,
    reportError,
    isLimitsSet,
    appDispatch,
  ])

  // // Pre-fetch limits
  // useEffect(() => {
  //   if (needsRefresh) {
  //     setIsLimitsSet(false)
  //   }
  // }, [needsRefresh])

  const { filters } = state

  // Fetch data
  useEffect(() => {
    if (isInitialised) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        },
      })
      api.fetch(filters)
        .then((items) => {
          dispatch({
            type: 'SET_LISTING',
            payload: { items },
          })
        })
        .catch((error) => {
          reportError(new UIError({
            error,
            id: 'service-fetch',
            text: 'Notifier API Error while fetching data.',
          }))
        })
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'data',
            },
          })
        })
    }
  }, [
    appDispatch,
    filters,
    isInitialised,
    api,
    reportError,
  ])

  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default createWithContext(Provider)
