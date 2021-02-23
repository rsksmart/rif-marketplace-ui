import { AvailableCapacityService } from 'api/rif-marketplace-cache/storage/available-size'
import { AvgBillingPriceService } from 'api/rif-marketplace-cache/storage/avg-billing-plan-price'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App'
import createWithContext from 'context/storeUtils/createWithContext'
import createReducer from 'context/storeUtils/reducer'
import { MinMaxFilter } from 'models/Filters'
import { UIError } from 'models/UIMessage'
import React, {
  createContext,
  FC,
  useCallback,
  useContext, useEffect, useReducer, useState,
} from 'react'
import actions from './offersActions'
import { Props, State } from './interfaces'

export const initialState: State = {
  contextID: 'storage_offers',
  filters: {
    size: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0,
    },
    periods: new Set(),
    provider: undefined,
  },
  limits: {
    size: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0,
    },
  },
  listing: {
    items: [],
  },
  needsRefresh: true,
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
})

export const Provider: FC = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)
  const [isLimitsSet, setIsLimitsSet] = useState(false)

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api = appState.apis['storage/v0/offers'] as StorageOffersService
  const apiAvgBillingPrice = appState.apis['storage/v0/avgBillingPrice'] as AvgBillingPriceService
  const apiAvailableCapacity = appState.apis['storage/v0/availableCapacity'] as AvailableCapacityService

  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )
  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )
  const {
    needsRefresh,
    filters,
    limits,
  } = state

  const errorReporterInstance = errorReporterFactory(appDispatch)

  if (!api.service) {
    api.connect(errorReporterInstance)
  }

  if (!apiAvgBillingPrice.service) {
    apiAvgBillingPrice.connect(errorReporterInstance)
  }

  if (!apiAvailableCapacity.service) {
    apiAvailableCapacity.connect(errorReporterInstance)
  }

  // Initialise
  useEffect(() => {
    if (api?.service && !isInitialised) {
      try {
        setIsInitialised(true)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, appDispatch])

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
      Promise.all([
        apiAvailableCapacity.fetchSizeLimits()
          .then((size: MinMaxFilter) => {
            dispatch({
              type: 'UPDATE_LIMITS',
              payload: { size },
            })
            dispatch({
              type: 'FILTER',
              payload: { size },
            })
          }),
        apiAvgBillingPrice.fetchPriceLimits()
          .then((price: MinMaxFilter) => {
            dispatch({
              type: 'UPDATE_LIMITS',
              payload: { price },
            })
            dispatch({
              type: 'FILTER',
              payload: { price },
            })
          }),
      ]).then(() => {
        setIsLimitsSet(true)
      }).catch((error) => {
        reportError(new UIError({
          error,
          id: 'service-fetch',
          text: 'Error while fetching filters.',
        }))
      }).finally(() => {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'filters',
          },
        })
      })
    }
  }, [
    apiAvailableCapacity,
    apiAvgBillingPrice,
    isInitialised,
    needsRefresh,
    reportError,
    isLimitsSet,
    appDispatch,
  ])

  // Pre-fetch limits
  useEffect(() => {
    if (needsRefresh) {
      setIsLimitsSet(false)
    }
  }, [needsRefresh])

  // Fetch data
  useEffect(() => {
    if (isInitialised && isLimitsSet) {
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
            payload: {
              items,
            },
          })
          dispatch({
            type: 'REFRESH',
            payload: { refresh: false },
          })
        })
        .catch((error) => {
          reportError(new UIError({
            error,
            id: 'service-fetch',
            text: 'Error while fetching filters.',
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
    isLimitsSet,
    isInitialised,
    filters,
    limits,
    api,
    reportError,
    appDispatch,
  ])

  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default createWithContext(Provider)
