import { APIController, ServiceMap } from 'api/models/apiController'
import { ConfirmationsController } from 'api/rif-marketplace-cache/confirmationsController'
import { DomainsController } from 'api/rif-marketplace-cache/rns/domains'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsController } from 'api/rif-marketplace-cache/rns/sold'
import React, { Dispatch, useReducer } from 'react'
import { StoreState, StoreReducer, StoreActions } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { XEController } from 'api/rif-marketplace-cache/rates/exchangeRateController'
import { AppAction } from './appActions'
import { AppReducer, appActions } from './appReducer'

export type StoreName = 'app'

export interface AppState extends StoreState {
  isError?: boolean
  isLoading?: boolean
  message?: string
  formError?: any
  apis: ServiceMap
}

export interface AppStoreProps {
  state: AppState
  dispatch: Dispatch<AppAction>
}

export const initialState: AppState = {
  storeID: 'app',
  apis: {
    confirmations: new ConfirmationsController(),
    'rns/v0/offers': new OffersController() as APIController,
    'rns/v0/domains': new DomainsController() as APIController,
    'rns/v0/sold': new SoldDomainsController() as APIController,
    'rates/v0': new XEController() as APIController,
    // "storage/v0/offers": new StorageOffersController()
  },
}

const AppStore = React.createContext({} as AppStoreProps | any)
const appReducer: AppReducer | StoreReducer = storeReducerFactory(initialState, appActions as unknown as StoreActions)

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
