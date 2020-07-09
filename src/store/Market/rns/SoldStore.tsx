import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, {
  useReducer, useContext, useState, useEffect,
} from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { SoldDomainsController } from 'api/rif-marketplace-cache/rns/sold'
import {
  RnsListing, RnsOrder, RnsState, RnsStoreProps,
} from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import outdateTokenId from './utils'

export type StoreName = 'rns_sold'

export type RnsSoldOrder = Modify<RnsOrder, {
  item: RnsSoldDomain
}>

export type RnsSoldListing = Modify<RnsListing, {
  items: RnsSoldDomain[]
}>

export type RnsSoldState = Modify<RnsState, {
  listing: RnsSoldListing
  filters: Pick<RnsFilter, 'name'>
  order?: RnsSoldOrder
}>

export type RnsSoldStoreProps = Modify<RnsStoreProps, {
  state: RnsSoldState
}>

export const initialState: RnsSoldState = {
  storeID: 'rns_sold',
  listing: {
    items: [],
    outdatedTokens: [],
  },
  filters: {
  },
  needsRefresh: false,
}

const RnsSoldStore = React.createContext({} as RnsSoldStoreProps | any)
const soldDomainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsSoldStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(soldDomainsReducer, initialState)
  const { state: { apis: { sold } } }: AppStoreProps = useContext(AppStore)
  const api = sold as SoldDomainsController

  const {
    filters,
    needsRefresh,
  } = state as RnsState
  const { state: { account } } = useContext(Web3Store)

  const [isInitialised, setIsInitialised] = useState(false)

  if (!api.service) {
    api.connect()
  }

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
  return <RnsSoldStore.Provider value={value}>{children}</RnsSoldStore.Provider>
}

export default RnsSoldStore
