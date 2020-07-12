import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { Modify } from 'utils/typeUtils'
import { Message, MessageId } from './AppStore'

export type APP_ACTIONS = 'NOOP' | 'SET_IS_LOADING' | 'SET_MESSAGE' | 'REMOVE_MESSAGE'

export interface LoadingPayload {
  readonly isLoading?: boolean
  readonly message?: string
}

export type MessagePayload = Modify<Message, {
  id: MessageId
}>

export type RemoveMessagePayload = {
  id: MessageId
}

export type AppPayload = LoadingPayload & MessagePayload & RemoveMessagePayload

export interface AppAction extends StoreDispatcher<AppPayload> {
  type: APP_ACTIONS
}
