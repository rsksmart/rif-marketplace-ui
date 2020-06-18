import { Application, Service } from '@feathersjs/feathers'
import { ConfirmationsController } from 'api/rif-marketplace-cache/confirmationsController'
import React, { Dispatch, useReducer } from 'react'
import { AppAction } from './appActions'
import appReducer from './appReducer'

export interface ServiceEventListener {
  (...args: any[]): void
}

export interface APIController {
  path: string
  service: Service<any>
  connect: (client: Application<any>) => string | void
  fetch: (filters?) => Promise<any>
  attachEvent: (name: string, callback: ServiceEventListener) => void
  detachEvent: (name: string) => void
  // events: Set<string>
}

export type ServiceMap = Map<string, APIController>

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
  apis: new Map([['confirmations', new ConfirmationsController()]]),
}

const AppStore = React.createContext({} as AppStoreProps | any)

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
