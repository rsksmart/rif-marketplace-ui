import { APIErrorId, ServiceMap } from 'api/models/apiService'
import { ConfirmationsService } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { XRService } from 'api/rif-marketplace-cache/rates/xr'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { Severity } from 'models/misc'
import React, { Dispatch, useReducer } from 'react'
import { StoreActions, StoreReducer, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { ContractErrorId } from 'contracts/interfaces'
import { AppAction, ErrorMessagePayload } from './appActions'
import { appActions, AppReducer } from './appReducer'

export type StoreName = 'app'

export interface CustomAction {
  name: string
  action: Function
}

export type ErrorId = APIErrorId | ContractErrorId
export type MessageId = ErrorId | 'wallet'
export interface Message {
  text: string
  type: Severity
  customAction?: CustomAction
}

export type ErrorMessage = Modify<Message, {
  error: Error
}>

export type MessageMap = Record<MessageId, Message | ErrorMessage>

export interface AppState extends StoreState {
  isLoading?: boolean
  messages: Partial<MessageMap>
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

export type ErrorReporterError = Modify<Omit<ErrorMessagePayload, 'type'>, {
  id: ErrorId
}>
export interface ErrorReporter {
  (error: ErrorReporterError): void
}
export interface ErrorReporterFactory {
  (dispatch: Dispatch<AppAction>): ErrorReporter
}

export const errorReporterFactory: ErrorReporterFactory = (dispatch: Dispatch<AppAction>) => (error: ErrorReporterError) => {
  dispatch({
    type: 'SET_MESSAGE',
    payload: {
      ...error,
      type: 'error',
    } as ErrorMessagePayload,
  } as any)
}
export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export default AppStore
