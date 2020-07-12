import { ServiceMap } from 'api/models/apiController'
import { ConfirmationsController } from 'api/rif-marketplace-cache/confirmationsController'
import { XEController } from 'api/rif-marketplace-cache/rates/exchangeRateController'
import { DomainsController } from 'api/rif-marketplace-cache/rns/domains'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsController } from 'api/rif-marketplace-cache/rns/sold'
import React, { Dispatch, useReducer } from 'react'
import { StoreActions, StoreReducer, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { AppAction } from './appActions'
import { appActions, AppReducer } from './appReducer'

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
    'rns/v0/offers': new OffersController(),
    'rns/v0/domains': new DomainsController(),
    'rns/v0/sold': new SoldDomainsController(),
    'rates/v0': new XEController(),
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
