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
}

const RnsSoldStore = React.createContext({} as RnsSoldStoreProps | any)
const soldDomainsReducer: RnsReducer | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsSoldStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(soldDomainsReducer, initialState)
  const { state: { apis: { sold: service } } }: AppStoreProps = useContext(AppStore)
  const { filters, listing: { outdatedTokens } } = state as RnsState
  const { state: { account } } = useContext(Web3Store)

  const [isConnected, setIsConnected] = useState(false)
  const [isOutdated, setIsOutdated] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      setIsConnected(!!service.connect())
    }
  }, [isConnected, service])

  useEffect(() => {
    if (isConnected) {
      service.attachEvent('updated', outdateTokenId(dispatch))
      service.attachEvent('patched', outdateTokenId(dispatch))
      service.attachEvent('created', outdateTokenId(dispatch))
      service.attachEvent('removed', outdateTokenId(dispatch))
    }
  }, [isConnected, service])

  useEffect(() => {
    if (outdatedTokens.length) {
      setIsOutdated(true)
    }
  }, [outdatedTokens])

  useEffect(() => {
    if (account && isConnected && isOutdated && !outdatedTokens.length) {
      service.fetch({
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
  }, [isConnected, filters, service, account, isOutdated, outdatedTokens])

  const value = { state, dispatch }
  return <RnsSoldStore.Provider value={value}>{children}</RnsSoldStore.Provider>
}

export default RnsSoldStore
