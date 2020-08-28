import { Web3Store, Web3ProviderProps } from '@rsksmart/rif-ui'
import { RnsFilter } from 'api/models/RnsFilter'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, {
  useReducer, useContext, useState, useEffect,
} from 'react'
import { ContextActions, ContextReducer } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { LoadingPayload } from 'context/App/appActions'
import { RefreshPayload, RnsPayload } from 'context/Services/rns/rnsActions'
import {
  RnsListing, RnsOrder, RnsState, RnsContextProps,
} from './interfaces'
import { rnsActions, RnsReducer } from './rnsActions'
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
}

const RnsSoldContext = React.createContext({} as RnsSoldContextProps | any)
const soldDomainsReducer: RnsReducer<RnsPayload> | ContextReducer = storeReducerFactory(initialState, rnsActions as unknown as ContextActions)

export const RnsSoldContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(soldDomainsReducer, initialState)
  const {
    state: appState, dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api = appState?.apis?.['rns/v0/sold'] as SoldDomainsService

  const {
    filters,
    needsRefresh,
  } = state as RnsState
  const { web3State }: Web3ProviderProps = useContext(Web3Store)
  const account = web3State?.account

  const [isInitialised, setIsInitialised] = useState(false)

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
  return <RnsSoldContext.Provider value={value}>{children}</RnsSoldContext.Provider>
}

export default RnsSoldContext
