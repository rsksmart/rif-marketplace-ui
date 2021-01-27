import { ServiceMetadata } from 'api/models/apiService'
import { RnsFilter, RnsSort, SORT_DIRECTION } from 'api/models/RnsFilter'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import React, {
  createContext,
  FC,
  useContext, useEffect, useReducer, useState,
} from 'react'
import { ErrorMessagePayload, LoadingPayload } from 'context/App/appActions'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App/AppContext'
import { createReducer } from 'context/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import {
  RnsListing, RnsOrder, RnsState, RnsContextProps,
} from './interfaces'
import rnsActions from './rnsActions'
import outdateTokenId from './utils'

export type ContextName = 'rns_offers'

export type Order = RnsOrder<RnsDomainOffer>

export type Listing = RnsListing<RnsDomainOffer>

export type OffersState = Modify<RnsState, {
  listing: Listing
  filters: Pick<RnsFilter, 'name' | 'price'>
  limits: Pick<RnsFilter, 'price'>
  order?: Order
  sort: RnsSort
}>

export type RnsOffersContextProps = Modify<RnsContextProps, {
  state: OffersState
}>

export const initialState: OffersState = {
  contextID: 'rns_offers',
  listing: {
    items: [],
    outdatedTokens: [],
  },
  filters: {
    price: {
      min: 0,
      max: 0,
    },
  },
  limits: {
    price: {
      min: 0,
      max: 0,
    },
  },
  needsRefresh: false,
  pagination: {},
  sort: {
    name: SORT_DIRECTION.asc,
  },
}

const RnsOffersContext = createContext<RnsOffersContextProps>({
  state: initialState,
  dispatch: () => undefined,
})

const offersReducer = createReducer(initialState, rnsActions)

export const RnsOffersContextProvider: FC = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)
  const [isLimitsSet, setIsLimitsSet] = useState(false)

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api = appState?.apis?.['rns/v0/offers'] as OffersService

  const [state, dispatch] = useReducer(offersReducer, initialState)
  const {
    filters,
    sort,
    needsRefresh,
    pagination: {
      page,
    },
  } = state as OffersState

  // Initialise
  useEffect(() => {
    if (api && !isInitialised && !needsRefresh) {
      const {
        connect,
        attachEvent,
      } = api

      setIsInitialised(true)
      try {
        connect(errorReporterFactory(appDispatch))

        attachEvent('updated', outdateTokenId(dispatch))
        attachEvent('patched', outdateTokenId(dispatch))
        attachEvent('created', outdateTokenId(dispatch))
        attachEvent('removed', outdateTokenId(dispatch))

        dispatch({
          type: 'REFRESH',
          payload: { refresh: true },
        })
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, needsRefresh, appDispatch])

  // (re)fetch limits upon refresh if initialised
  useEffect(() => {
    if (isInitialised && needsRefresh && !isLimitsSet) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'filters',
        } as LoadingPayload,
      } as any)
      api.fetchPriceLimits()
        .then((price) => {
          dispatch({
            type: 'UPDATE_LIMITS',
            payload: { price },
          })
          dispatch({
            type: 'FILTER',
            payload: { price },
          })
          setIsLimitsSet(true)
        })
        .catch((error) => {
          appDispatch({
            type: 'SET_MESSAGE',
            payload: {
              id: 'service-fetch',
              text: 'Error while fetching filters.',
              type: 'error',
              error,
            } as ErrorMessagePayload,
          } as any)
        })
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'filters',
            } as LoadingPayload,
          } as any)
        })
    }
  }, [api, isInitialised, needsRefresh, isLimitsSet, appDispatch])

  // Fetch data
  useEffect(() => {
    if (needsRefresh) {
      setIsLimitsSet(false)
    }
  }, [needsRefresh])

  useEffect(() => {
    if (isInitialised && isLimitsSet) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        } as LoadingPayload,
      } as any)
      api.fetch({ ...filters, skip: page, sort })
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
  }, [isInitialised, isLimitsSet, filters, sort, page, api, appDispatch])

  const meta = api?.meta

  useEffect(() => {
    if (meta) {
      dispatch({
        type: 'UPDATE_PAGE',
        payload: meta as ServiceMetadata,
      })
    }
  }, [meta])

  const value = { state, dispatch }
  return (
    <RnsOffersContext.Provider value={value}>
      {children}
    </RnsOffersContext.Provider>
  )
}

export default RnsOffersContext
