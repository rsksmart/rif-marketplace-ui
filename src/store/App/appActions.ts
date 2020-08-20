import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { Modify } from 'utils/typeUtils'
import { Message, MessageId, ErrorMessage } from 'models/UIMessage'
import { LoaderId } from '../../models/UIMessage'

export type APP_ACTION = 'NOOP' | 'SET_IS_LOADING' | 'SET_MESSAGE' | 'REMOVE_MESSAGE'

export interface LoadingPayload {
  readonly id: LoaderId
  readonly isLoading: boolean
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

export type AppAction = StoreDispatcher<APP_ACTION, AppPayload>
