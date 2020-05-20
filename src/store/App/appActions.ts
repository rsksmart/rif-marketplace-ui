import { ActionType } from 'store/storeUtils/interfaces'

export enum APP_ACTIONS {
  SET_IS_LOADING = 'SET_IS_LOADING',
  SET_MESSAGE = 'SET_MESSAGE',
  UNSET = 'UNSET',
}

export interface LoadingPayloadType {
  readonly isLoading?: boolean
  readonly message?: string
}

export interface MessagePayloadType {
  readonly isError?: boolean
  readonly message?: string
}

export type AppPayload = LoadingPayloadType & MessagePayloadType

export interface AppAction extends ActionType<AppPayload> {
  type: APP_ACTIONS
}
