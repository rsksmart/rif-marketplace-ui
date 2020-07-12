import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, {
  useContext, useEffect, useReducer, useState,
} from 'react'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { DomainsController } from 'api/rif-marketplace-cache/rns/domains'
import {
  RnsListing, RnsOrder, RnsState, RnsStoreProps,
} from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import outdateTokenId from './utils'

export type StoreName = 'rns_domains'
export type Order = Modify<RnsOrder, {
  item: RnsDomain
}>

export type Listing = Modify<RnsListing, {
  items: RnsDomain[]
}>

export type DomainsState = Modify<RnsState, {
  listing: Listing
  filters: Pick<RnsFilter, 'name' | 'status'>
  order?: Order
}>

export type RnsDomainsStoreProps = Modify<RnsStoreProps, {
  state: DomainsState
}>

export const initialState: DomainsState = {
  storeID: 'rns_domains',
  listing: {
    items: [],
    outdatedTokens: [],
  },
  filters: {
    status: 'owned',
  },
  needsRefresh: false,
}

const RnsDomainsStore = React.createContext({} as RnsDomainsStoreProps | any)
const domainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsDomainsStoreProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false) // FIXME: change in all stores

  const { state: { apis: { 'rns/v0/domains': domains } } }: AppStoreProps = useContext(AppStore)
  const api = domains as DomainsController

  if (!api.service) {
    api.connect()
  }

  const [state, dispatch] = useReducer(domainsReducer, initialState)
  const { filters, needsRefresh } = state as DomainsState
  const { state: { account } } = useContext(Web3Store)

  // Initialise
  useEffect(() => {
    const {
      service,
      attachEvent,
    } = api

    if (service && !isInitialised && account) {
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
  }, [api, isInitialised, account])

  useEffect(() => {
    dispatch({
      type: 'REFRESH',
      payload: { refresh: true },
    } as any)
  }, [filters])

  // fetch if needs refresh and is initialised
  useEffect(() => {
    const { fetch } = api

    if (isInitialised && needsRefresh) {
      fetch({
        ...filters,
        ownerAddress: account,
      }).then((items) => {
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
    }
  }, [isInitialised, needsRefresh, filters, api, account])

  const value = { state, dispatch }
  return <RnsDomainsStore.Provider value={value}>{children}</RnsDomainsStore.Provider>
}

export default RnsDomainsStore
