import { ServiceMetadata } from 'api/models/apiService'
import { RnsFilter } from 'api/models/RnsFilter'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import React, {
  useContext, useEffect, useReducer, useState,
} from 'react'
import { ErrorMessagePayload, LoadingPayload } from 'store/App/appActions'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import {
  RnsListing, RnsOrder, RnsState, RnsStoreProps,
} from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import outdateTokenId from './utils'

export type StoreName = 'rns_offers'

export type Order = Modify<RnsOrder, {
  item: RnsDomainOffer
}>

export type Listing = Modify<RnsListing, {
  items: RnsDomainOffer[]
}>

export type OffersState = Modify<RnsState, {
  listing: Listing
  filters: Pick<RnsFilter, 'name' | 'price'>
  limits: Pick<RnsFilter, 'price'>
  order?: Order
}>

export type RnsOffersStoreProps = Modify<RnsStoreProps, {
  state: OffersState
}>

export const initialState: OffersState = {
  storeID: 'rns_offers',
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
}

const RnsOffersStore = React.createContext({} as RnsOffersStoreProps | any)
const offersReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsOffersStoreProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)
  const [isLimitsSet, setIsLimitsSet] = useState(false)

  const {
    state: {
      apis: {
        'rns/v0/offers': offers,
      },
    }, dispatch: appDispatch,
  }: AppStoreProps = useContext(AppStore)
  const api = offers as OffersService

  if (!api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }

  const [state, dispatch] = useReducer(offersReducer, initialState)
  const {
    filters,
    limits,
    needsRefresh,
  } = state as RnsState

  // Initialise
  useEffect(() => {
    const {
      service,
      attachEvent,
    } = api

    if (service && !isInitialised && !needsRefresh) {
      setIsInitialised(true)
      try {
        attachEvent('updated', outdateTokenId(dispatch))
        attachEvent('patched', outdateTokenId(dispatch))
        attachEvent('created', outdateTokenId(dispatch))
        attachEvent('removed', outdateTokenId(dispatch))

        dispatch({
          type: 'REFRESH',
          payload: { refresh: true },
        } as any)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, needsRefresh])

  // (re)fetch limits upon refresh if initialised
  useEffect(() => {
    const { fetchPriceLimits } = api

    if (isInitialised && needsRefresh && !isLimitsSet) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'filters',
        } as LoadingPayload,
      } as any)
      fetchPriceLimits()
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

  // Pre-fetch limits
  useEffect(() => {
    if (needsRefresh) {
      setIsLimitsSet(false)
    }
  }, [needsRefresh])

  useEffect(() => {
    const { fetch } = api

    if (isInitialised && isLimitsSet) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        } as LoadingPayload,
      } as any)
      fetch(filters)
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
  }, [isInitialised, isLimitsSet, filters, limits, api, appDispatch])

  const { meta } = api
  useEffect(() => {
    if (meta) {
      dispatch({
        type: 'UPDATE_PAGE',
        payload: meta as ServiceMetadata,
      })
    }
  }, [meta])

  const value = { state, dispatch }
  return <RnsOffersStore.Provider value={value}>{children}</RnsOffersStore.Provider>
}

export default RnsOffersStore
