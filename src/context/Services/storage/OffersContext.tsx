import React, {
  Dispatch, useContext, useEffect, useReducer, useState,
} from 'react'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import { LoadingPayload, ErrorMessagePayload } from 'context/App/appActions'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { ContextReducer, ContextActions } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { StorageItem } from 'models/marketItems/StorageItem'
import { Modify } from 'utils/typeUtils'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { MinMaxFilter } from 'models/Filters'
import { UIError } from 'models/UIMessage'
import {
  storageOffersActions, StorageOffersPayload, StorageOffersReducer, StorageOffersAction,
} from './offersActions'
import { ServiceState, ServiceOrder } from '../interfaces'

export type ContextName = 'storage_offers'

export type OffersListing = {
  items: StorageItem[]
}

export type ContextFilters = Pick<StorageOffersFilters, 'price' | 'size' | 'periods' | 'provider'>
export type ContextLimits = Pick<StorageOffersFilters, 'price' | 'size'>

export type StorageOffersState = Modify<ServiceState<StorageItem>, {
  listing: OffersListing
  order?: ServiceOrder<StorageItem>
  filters: ContextFilters
  limits: ContextLimits
}>

export type StorageOffersContextProps = {
  state: StorageOffersState
  dispatch: Dispatch<StorageOffersAction>
}

export const initialState: StorageOffersState = {
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

const StorageOffersContext = React.createContext({} as StorageOffersState as any)
const reducer: StorageOffersReducer<StorageOffersPayload> | ContextReducer = storeReducerFactory(initialState, storageOffersActions as unknown as ContextActions)

export const StorageOffersContextProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)
  const [isLimitsSet, setIsLimitsSet] = useState(false)

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api = appState?.apis?.['storage/v0/offers'] as StorageOffersService

  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    needsRefresh,
    filters,
    limits,
  } = state as StorageOffersState

  if (api && !api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }
  // Initialise
  useEffect(() => {
    if (api?.service && !isInitialised) {
      try {
        // attachEvent('updated', outdateTokenId(dispatch))
        // attachEvent('patched', outdateTokenId(dispatch))
        // attachEvent('created', outdateTokenId(dispatch))
        // attachEvent('removed', outdateTokenId(dispatch))

        // dispatch({
        //   type: 'REFRESH',
        //   payload: { refresh: true },
        // } as any)
        // setTimeout(() =>
        setIsInitialised(true)
        // , 0)
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
        } as LoadingPayload,
      } as any)
      try {
        Promise.all([
          api.fetchSizeLimits()
            .then((size: MinMaxFilter) => {
              dispatch({
                type: 'UPDATE_LIMITS',
                payload: { size },
              })
              dispatch({
                type: 'FILTER',
                payload: { size },
              })
            })
            .catch((error) => {
              throw new UIError({
                error,
                id: 'service-fetch',
                text: 'Error while fetching filters. ',
              })
            }),
          api.fetchPriceLimits()
            .then((price: MinMaxFilter) => {
              dispatch({
                type: 'UPDATE_LIMITS',
                payload: { price },
              })
              dispatch({
                type: 'FILTER',
                payload: { price },
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
        appDispatch({
          type: 'SET_MESSAGE',
          payload: {
            id: 'service-fetch',
            text: 'Error while fetching filters.',
            type: 'error',
            error,
          } as ErrorMessagePayload,
        } as any)
      } finally {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'filters',
          } as LoadingPayload,
        } as any)
      }
    }
  }, [api, isInitialised, needsRefresh, isLimitsSet, appDispatch])

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
        } as LoadingPayload,
      } as any)
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
          } as any)
        })
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'data',
            } as LoadingPayload,
          } as any)
        })
    }
  }, [isLimitsSet, isInitialised, filters, limits, api, appDispatch])

  const value = { state, dispatch }
  return <StorageOffersContext.Provider value={value}>{children}</StorageOffersContext.Provider>
}

export default StorageOffersContext
