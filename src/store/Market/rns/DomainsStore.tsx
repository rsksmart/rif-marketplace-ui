import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, {
  useContext, useEffect, useReducer, useState,
} from 'react'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { ErrorMessagePayload, LoadingPayload } from 'store/App/appActions'
import {
  RnsListing, RnsOrder, RnsState, RnsStoreProps,
} from './interfaces'
import { rnsActions, RnsReducer, RnsPayload } from './rnsActions'
import outdateTokenId from './utils'
import { RefreshPayload } from './rnsActions'

export type StoreName = 'rns_domains'
export type Order = RnsOrder<RnsDomain>

export type Listing = RnsListing<RnsDomain>

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
const domainsReducer: RnsReducer<RnsPayload> | StoreReducer = storeReducerFactory(initialState, rnsActions as unknown as StoreActions)

export const RnsDomainsStoreProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const {
    state: { apis: { 'rns/v0/domains': domains } },
    dispatch: appDispatch,
  } = useContext<AppStoreProps>(AppStore)
  const api = domains as DomainsService


  const [state, dispatch] = useReducer(domainsReducer, initialState)
  const { filters, needsRefresh } = state as DomainsState
  const { state: { account } } = useContext(Web3Store)

  // Initialise
  useEffect(() => {
    if (api && !isInitialised && account) {
      const initialise = async () => {
        const {
          attachEvent,
          authenticate,
        } = api

        setIsInitialised(true)
        try {
          api.connect(errorReporterFactory(appDispatch))
          await authenticate(account)

          attachEvent('updated', outdateTokenId(dispatch))
          attachEvent('patched', outdateTokenId(dispatch))
          attachEvent('created', outdateTokenId(dispatch))
          attachEvent('removed', outdateTokenId(dispatch))

          dispatch({
            type: 'REFRESH',
            payload: { refresh: true } as RefreshPayload,
          })
        } catch (e) {
          setIsInitialised(false)
        }
      }
      initialise()
    }
  }, [api, isInitialised, account, appDispatch])

  useEffect(() => {
    dispatch({
      type: 'REFRESH',
      payload: { refresh: true },
    } as any)
  }, [filters])

  // fetch if needs refresh and is initialised
  useEffect(() => {
    if (isInitialised && needsRefresh) {
      const { fetch } = api

      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        } as LoadingPayload,
      } as any)
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
        })
      }).catch((e: Error) => {
        appDispatch({
          type: 'SET_MESSAGE',
          payload: {
            id: 'service-fetch',
            text: `Couldn't fetch RNS domains. Error: ${e.message}`,
            type: 'error',
          } as ErrorMessagePayload,
        } as any)
      }).finally(() => {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'data',
          } as LoadingPayload,
        } as any)
      })
    }
  }, [isInitialised, needsRefresh, filters, api, account, appDispatch])

  const value = { state, dispatch }
  return <RnsDomainsStore.Provider value={value}>{children}</RnsDomainsStore.Provider>
}

export default RnsDomainsStore
