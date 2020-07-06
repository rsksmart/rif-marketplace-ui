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
}

const RnsDomainsStore = React.createContext({} as RnsDomainsStoreProps | any)
const domainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsDomainsStoreProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const [isOutdated, setIsOutdated] = useState(true)

  const { state: { apis: { domains } } }: AppStoreProps = useContext(AppStore)
  const api = domains as DomainsController

  if (!api.service) {
    api.connect()
  }

  const [state, dispatch] = useReducer(domainsReducer, initialState)
  const { filters, listing: { outdatedTokens } } = state as DomainsState
  const { state: { account } } = useContext(Web3Store)

  useEffect(() => {
    const {
      service,
      attachEvent,
    } = api

    if (service && !isReady && account) {
      attachEvent('updated', outdateTokenId(dispatch))
      attachEvent('patched', outdateTokenId(dispatch))
      attachEvent('created', outdateTokenId(dispatch))
      attachEvent('removed', outdateTokenId(dispatch))

      setIsReady(true)
    }
  }, [api, isReady, account])

  useEffect(() => {
    if (outdatedTokens.length) {
      setIsOutdated(true)
    }
  }, [outdatedTokens])

  useEffect(() => {
    const { fetch } = api

    if (account && isReady && isOutdated && !outdatedTokens.length) {
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
        setIsOutdated(false)
      })
    }
  }, [isReady, filters, api, account, isOutdated, outdatedTokens])

  useEffect(() => {
    const { fetch } = api

    if (account && isReady) {
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
        setIsOutdated(false)
      })
    }
  }, [isReady, filters, api, account])

  const value = { state, dispatch }
  return <RnsDomainsStore.Provider value={value}>{children}</RnsDomainsStore.Provider>
}

export default RnsDomainsStore
