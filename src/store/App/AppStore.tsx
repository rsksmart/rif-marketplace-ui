import { APIController, ServiceMap } from 'api/models/apiController'
import { ConfirmationsController } from 'api/rif-marketplace-cache/confirmationsController'
import { DomainsController } from 'api/rif-marketplace-cache/rns/domains'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsController } from 'api/rif-marketplace-cache/rns/sold'
import React, { Dispatch, useReducer } from 'react'
import { StoreState, StoreReducer, StoreActions } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
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
    offers: new OffersController() as APIController,
    domains: new DomainsController() as APIController,
    sold: new SoldDomainsController() as APIController,
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
