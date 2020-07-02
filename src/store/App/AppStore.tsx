import { Application, Service } from '@feathersjs/feathers'
import { ConfirmationsController } from 'api/rif-marketplace-cache/confirmationsController'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import React, { Dispatch, useReducer } from 'react'
import { AppAction } from './appActions'
import appReducer from './appReducer'
import { ServiceMap, APIController } from 'api/models/apiController'
import { DomainsController } from 'api/rif-marketplace-cache/rns/domains'
import { SoldDomainsController } from 'api/rif-marketplace-cache/rns/sold'

export interface AppState {
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
  apis: {
    confirmations: new ConfirmationsController(),
    offers: new OffersController() as APIController,
    domains: new DomainsController() as APIController,
    sold: new SoldDomainsController() as APIController
  },
}

const AppStore = React.createContext({} as AppStoreProps | any)

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
