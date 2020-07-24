import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, {
  useReducer, useContext, useState, useEffect,
} from 'react'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { LoadingPayload } from 'store/App/appActions'
import {
  RnsListing, RnsOrder, RnsState, RnsStoreProps,
} from './interfaces'
import { rnsActions, RnsReducer } from './rnsReducer'
import outdateTokenId from './utils'
import { RefreshPayload } from 'store/Market/rns/rnsActions';

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
  const {
    state: {
      apis: {
        'rns/v0/sold': sold,
      },
    }, dispatch: appDispatch,
  }: AppStoreProps = useContext(AppStore)
  const api = sold as SoldDomainsService

  const {
    filters,
    needsRefresh,
  } = state as RnsState
  const { state: { account } } = useContext(Web3Store)

  const [isInitialised, setIsInitialised] = useState(false)

  if (!api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }

  // Initialise
  useEffect(() => {
    const initialise = async () => {
      const {
        attachEvent,
        authenticate
      } = api

      setIsInitialised(true)
      try {
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

    if (api.service && !isInitialised && account) {
      initialise()
    }
  }, [api, isInitialised, account])

  // fetch if needs refresh and is initialised
  useEffect(() => {
    const { fetch } = api

    if (isInitialised && needsRefresh) {
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
  return <RnsSoldStore.Provider value={value}>{children}</RnsSoldStore.Provider>
}

export default RnsSoldStore
