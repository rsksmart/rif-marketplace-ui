import React, {
  useContext, useEffect, useReducer, useState,
} from 'react'
import { RnsFilter } from 'api/models/RnsFilter'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
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
}

const RnsOffersStore = React.createContext({} as RnsOffersStoreProps | any)
const offersReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsOffersStoreProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const [isOutdated, setIsOutdated] = useState(false)

  const { state: { apis: { offers } } }: AppStoreProps = useContext(AppStore)
  const api = offers as unknown as OffersController

  if (!api.service) {
    api.connect()
  }

  const [state, dispatch] = useReducer(offersReducer, initialState)
  const {
    filters,
    limits,
    listing: { outdatedTokens },
  } = state as RnsState

  useEffect(() => {
    const {
      service,
      attachEvent,
      fetchPriceLimits,
    } = api

    if (service && !isReady) {
      attachEvent('updated', outdateTokenId(dispatch))
      attachEvent('patched', outdateTokenId(dispatch))
      attachEvent('created', outdateTokenId(dispatch))
      attachEvent('removed', outdateTokenId(dispatch))

      const fetchLimits = async () => {
        const price = await fetchPriceLimits()
        dispatch({
          type: 'UPDATE_LIMITS',
          payload: { price },
        })
        dispatch({
          type: 'FILTER',
          payload: { price },
        })
        setIsReady(true)
      }
      fetchLimits()
    }
  }, [api, isReady])

  useEffect(() => {
    if (outdatedTokens.length) {
      setIsOutdated(true)
    }
  }, [outdatedTokens])

  useEffect(() => {
    const { fetchPriceLimits } = api

    if (isOutdated && !outdatedTokens.length) {
      const fetchLimits = async () => {
        const price = await fetchPriceLimits()
        dispatch({
          type: 'UPDATE_LIMITS',
          payload: { price },
        })
        setIsReady(true)
      }
      fetchLimits()
    }
  }, [api, isOutdated, outdatedTokens])

  useEffect(() => {
    const { fetch } = api

    if (isReady) {
      fetch(filters).then((items) => {
        dispatch({
          type: 'SET_LISTING',
          payload: {
            items,
          },
        })
        setIsOutdated(false)
      })
    }
  }, [isReady, filters, limits, api])

  const value = { state, dispatch }
  return <RnsOffersStore.Provider value={value}>{children}</RnsOffersStore.Provider>
}

export default RnsOffersStore
