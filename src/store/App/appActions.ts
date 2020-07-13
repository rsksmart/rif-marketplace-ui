import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { Modify } from 'utils/typeUtils'
import { ErrorMessage, Message, MessageId } from './AppStore'

export type APP_ACTIONS = 'NOOP' | 'SET_IS_LOADING' | 'SET_MESSAGE' | 'REMOVE_MESSAGE'

export interface LoadingPayload {
  readonly isLoading?: boolean
  readonly message?: string
}

export type MessagePayload = Modify<Message, {
  id: MessageId
}>

export type ErrorMessagePayload = Modify<MessagePayload, ErrorMessage>

export type RemoveMessagePayload = {
  id: MessageId
}

export type AppPayload = LoadingPayload & (MessagePayload | ErrorMessagePayload) & RemoveMessagePayload

export interface AppAction extends StoreDispatcher<AppPayload> {
  type: APP_ACTIONS
}
