import { StoreDispatcher } from 'store/storeUtils/interfaces'

export type APP_ACTIONS = 'NOOP' | 'SET_IS_LOADING' | 'SET_MESSAGE'

export interface LoadingPayload {
  readonly isLoading?: boolean
  readonly message?: string
}

export interface MessagePayload {
  readonly isError?: boolean
  readonly message?: string
}

export type AppPayload = LoadingPayload & MessagePayload

export interface AppAction extends StoreDispatcher<AppPayload> {
  type: APP_ACTIONS
}
