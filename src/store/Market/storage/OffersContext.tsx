import React, { useState, useContext, useReducer, useEffect } from 'react'
import { ServiceStoreListing, ServiceStoreOrder } from '../interfaces'
import { StorageOffer } from 'models/marketItems/StorageItem'
import { Modify } from 'utils/typeUtils'
import { StorageState, StorageStoreProps } from './interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { StoreReducer, StoreActions } from 'store/storeUtils/interfaces'
import { StorageReducer, StoragePayload, storageActions } from './actions'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { LoadingPayload } from 'store/App/appActions'

export type StoreName = 'storage_offers'

export interface StorageOrder {

}

type OffersListing = ServiceStoreListing<StorageOffer>
type OffersOrder = ServiceStoreOrder<StorageOffer>

export type OffersState = Modify<StorageState, {
    listing: OffersListing,
    order?: OffersOrder
}>


export type Props = Modify<StorageStoreProps, {
  state: OffersState
}>

export const initialState: OffersState = {
  storeID: 'storage_offers',
  listing: {
    items: [],
    outdatedTokens: []
  }
}

const StorageOffersContext = React.createContext({} as Props | any)
const reducer: StorageReducer<StoragePayload> | StoreReducer = storeReducerFactory(initialState, storageActions as unknown as StoreActions)

export const StorageOffersContextProvider = ({ children }) => {
  const [isInitialised, setIsInitialised] = useState(false)

  const {
    state: appState, dispatch: appDispatch,
  }: AppStoreProps = useContext(AppStore)
  const api = appState?.apis?.['storage/v0/offers'] as StorageOffersService

  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    needsRefresh,
  } = state as OffersState

  if (api && !api.service) {
      api.connect(errorReporterFactory(appDispatch))
  }
    // Initialise
    useEffect(() => {
      if (api.service && !isInitialised && !needsRefresh) {
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
