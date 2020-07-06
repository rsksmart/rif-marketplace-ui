import { StoreDispatcher } from 'store/storeUtils/interfaces'

export type APP_ACTIONS = 'SET_IS_LOADING' | 'SET_MESSAGE' | 'NOOP'

export interface LoadingPayloadType {
  readonly isLoading?: boolean
  readonly message?: string
}

export interface MessagePayloadType {
  readonly isError?: boolean
  readonly message?: string
}

export type AppPayload = LoadingPayloadType & MessagePayloadType

export interface AppAction extends StoreDispatcher<AppPayload> {
  type: APP_ACTIONS
}
