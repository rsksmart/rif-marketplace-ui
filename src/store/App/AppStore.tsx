import { ServiceMap, APIError } from 'api/models/apiService'
import { ConfirmationsService } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { XRService } from 'api/rif-marketplace-cache/rates/xr'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { Severity } from 'components/molecules/InfoBar'
import React, { Dispatch, useReducer } from 'react'
import { StoreActions, StoreReducer, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { AppAction, MessagePayload } from './appActions'
import { appActions, AppReducer } from './appReducer'

export type StoreName = 'app'

export interface CustomAction {
  name: string
  action: Function
}

export type MessageId = string

export type ErrorId = APIError
export interface Message {
  text: string
  type: Severity
  customAction?: CustomAction
}

export interface AppState extends StoreState {
  isLoading?: boolean
  messages: Record<MessageId, Message>
  apis: ServiceMap
}

export interface AppStoreProps {
  state: AppState
  dispatch: Dispatch<AppAction>
}

export const initialState: AppState = {
  storeID: 'app',
  apis: {
    confirmations: new ConfirmationsService(),
    'rns/v0/offers': new OffersService(),
    'rns/v0/domains': new DomainsService(),
    'rns/v0/sold': new SoldDomainsService(),
    'rates/v0': new XRService(),
    // "storage/v0/offers": new StorageOffersService()
  },
  messages: {},
}

const AppStore = React.createContext({} as AppStoreProps | any)
const appReducer: AppReducer | StoreReducer = storeReducerFactory(initialState, appActions as unknown as StoreActions)

export type ErrorReporterError = Modify<Pick<MessagePayload, 'text' | 'id' | 'customAction'>, {
  id: ErrorId
}>
export const errorReporter = (dispatch: Dispatch<AppAction>) => (error: ErrorReporterError) => {
  dispatch({
    type: 'SET_MESSAGE',
    payload: {
      ...error,
      type: 'error',
    } as MessagePayload,
  } as any)
}
export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
