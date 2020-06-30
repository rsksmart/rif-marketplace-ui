import { Application, Service } from '@feathersjs/feathers'
import { ConfirmationsController } from 'api/rif-marketplace-cache/confirmationsController'
import { OffersController } from 'api/rif-marketplace-cache/rns/offers'
import React, { Dispatch, useReducer } from 'react'
import { AppAction } from './appActions'
import appReducer from './appReducer'
import { ServiceMap } from 'api/models/apiController'
import { DomainsController } from 'api/rif-marketplace-cache/rns/domains'

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
    offers: new OffersController() as any, // TODO: remove as any
    domains: new DomainsController() as any // TODO: remove as any
  },
}

const AppStore = React.createContext({} as AppStoreProps | any)

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
