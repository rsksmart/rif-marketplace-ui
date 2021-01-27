import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, {
  useContext, useEffect, useReducer, useState, FC, createContext,
} from 'react'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { createReducer } from 'context/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { ErrorMessagePayload, LoadingPayload } from 'context/App/appActions'
import { ServiceMetadata } from 'api/models/apiService'
import {
  RnsListing, RnsOrder, RnsState, RnsContextProps,
} from './interfaces'
import rnsActions from './rnsActions'
import outdateTokenId from './utils'

export type ContextName = 'rns_domains'
export type Order = RnsOrder<RnsDomain>

export type Listing = RnsListing<RnsDomain>

export type DomainsState = Modify<RnsState, {
  listing: Listing
  filters: Pick<RnsFilter, 'name' | 'status'>
  order?: Order
}>

export type RnsDomainsContextProps = Modify<RnsContextProps, {
  state: DomainsState
}>

export const initialState: DomainsState = {
  contextID: 'rns_domains',
  listing: {
    items: [],
    outdatedTokens: [],
  },
  filters: {
    status: 'owned',
  },
  needsRefresh: false,
  pagination: {},
}

const RnsDomainsContext = createContext<RnsDomainsContextProps>({
  state: initialState,
  dispatch: () => undefined,
})

const rnsReducer = createReducer(initialState, rnsActions)

export const RnsDomainsContextProvider: FC = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const {
    state: appState,
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const api = appState?.apis?.['rns/v0/domains'] as DomainsService

  const [state, dispatch] = useReducer(rnsReducer, initialState)
  const { filters, needsRefresh } = state as DomainsState
  const { state: { account } } = useContext(Web3Store)

  // Initialise
  useEffect(() => {
    if (api && !isInitialised && account) {
      const initialise = async (): Promise<void> => {
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
            payload: { refresh: true },
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
    })
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
    <RnsDomainsContext.Provider value={value}>
      {children}
    </RnsDomainsContext.Provider>
  )
}

export default RnsDomainsContext
