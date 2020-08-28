import React, {
  Dispatch, useContext, useEffect, useReducer, useState,
} from 'react'

import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import { LoadingPayload } from 'context/App/appActions'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { ContextReducer, ContextActions } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { StorageItem } from 'models/marketItems/StorageItem'
import { Modify } from 'utils/typeUtils'
import { ServiceState, ServiceOrder } from '../interfaces'
import { StorageAction } from './listingActions'
import { storageOffersActions, StorageOffersPayload, StorageOffersReducer } from './offersActions'

export type ContextName = 'storage_offers'

export type OffersListing = {
  items: StorageItem[]
}

export type StorageOffersState = Modify<ServiceState<StorageItem>, {
  listing: OffersListing
  order?: ServiceOrder<StorageItem>
}>

export type StorageOffersCtxProps = {
  state: StorageOffersState
  dispatch: Dispatch<StorageAction>
}

export const initialState: StorageOffersState = {
  contextID: 'storage_offers',
  listing: {
    items: [],
  },
}

const StorageOffersContext = React.createContext({} as StorageOffersState as any)
const reducer: StorageOffersReducer<StorageOffersPayload> | ContextReducer = storeReducerFactory(initialState, storageOffersActions as unknown as ContextActions)

export const StorageOffersContextProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const {
    state: appState,
    dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const api = appState?.apis?.['storage/v0/offers'] as StorageOffersService

  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    needsRefresh,
  } = state as StorageOffersState

  if (api && !api.service) {
    api.connect(errorReporterFactory(appDispatch))
  }
  // Initialise
  useEffect(() => {
    if (api?.service && !isInitialised && !needsRefresh) {
      // const {
      //   attachEvent,
      // } = api

      setIsInitialised(true)
      try {
        // attachEvent('updated', outdateTokenId(dispatch))
        // attachEvent('patched', outdateTokenId(dispatch))
        // attachEvent('created', outdateTokenId(dispatch))
        // attachEvent('removed', outdateTokenId(dispatch))

        dispatch({
          type: 'REFRESH',
          payload: { refresh: true },
        } as any)
      } catch (e) {
        setIsInitialised(false)
      }
    }
  }, [api, isInitialised, needsRefresh, appDispatch])

  useEffect(() => {
    if (isInitialised) {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'data',
        } as LoadingPayload,
      } as any)
      api.fetch()
        .then((items) => {
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
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'data',
            } as LoadingPayload,
          } as any)
        })
    }
  }, [isInitialised, api, appDispatch])

  const value = { state, dispatch }
  return <StorageOffersContext.Provider value={value}>{children}</StorageOffersContext.Provider>
}

export default StorageOffersContext
