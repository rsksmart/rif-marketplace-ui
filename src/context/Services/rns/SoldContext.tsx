import { Web3Store } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, {
  useReducer, useContext, useState, useEffect, createContext, FC,
} from 'react'
import { createReducer } from 'context/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { LoadingPayload } from 'context/App/appActions'
import { ServiceMetadata } from 'api/models/apiService'
import {
  RnsListing, RnsOrder, RnsState, RnsContextProps,
} from './interfaces'
import rnsActions from './rnsActions'
import outdateTokenId from './utils'

export type ContextName = 'rns_sold'

export type RnsSoldOrder = RnsOrder<RnsSoldDomain>

export type RnsSoldListing = RnsListing<RnsSoldDomain>

export type RnsSoldState = Modify<RnsState, {
  listing: RnsSoldListing
  filters: Pick<RnsFilter, 'name'>
  order?: RnsSoldOrder
}>

export type RnsSoldContextProps = Modify<RnsContextProps, {
  state: RnsSoldState
}>

export const initialState: RnsSoldState = {
  contextID: 'rns_sold',
  listing: {
    items: [],
    outdatedTokens: [],
  },
  filters: {
  },
  needsRefresh: false,
  pagination: {},
}

const RnsSoldContext = createContext<RnsSoldContextProps>({
  state: initialState,
  dispatch: () => undefined,
})

const rnsSoldReducer = createReducer(initialState, rnsActions)

export const RnsSoldContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(rnsSoldReducer, initialState)

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api = appState?.apis?.['rns/v0/sold'] as SoldDomainsService

  const {
    filters,
    needsRefresh,
  } = state as RnsState
  const { state: { account } } = useContext(Web3Store)

  const [isInitialised, setIsInitialised] = useState(false)

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
    <RnsSoldContext.Provider value={value}>
      {children}
    </RnsSoldContext.Provider>
  )
}

export default RnsSoldContext
