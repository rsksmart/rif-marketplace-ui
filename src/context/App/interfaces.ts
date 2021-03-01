import { ServiceMap } from 'api/models/apiService'
import { ContextState } from 'context/storeUtils/interfaces'
import {
  ErrorMessage, LoaderId, Message, MessageId,
} from 'models/UIMessage'
import { Dispatch } from 'react'
import { Modify } from 'utils/typeUtils'

// STATE
export const contextID = 'app' as const
export type ContextName = typeof contextID

export type MessageMap = Record<MessageId, Message | ErrorMessage>
export type LoaderMap = Record<LoaderId, boolean>

export type State = ContextState & {
  loaders: LoaderMap
  messages: Partial<MessageMap>
  apis: ServiceMap
  alertPanel: {
    display: boolean
    message: string
  }
}

// PAYLOAD
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

export type SetAlertPayload = {
  message: string
}

// ACTIONS
export type Action = (
  | {
    type: 'SET_IS_LOADING'
    payload: LoadingPayload
  }
  | {
    type: 'SET_MESSAGE'
    payload: MessagePayload | ErrorMessagePayload
  }
  | {
    type: 'REMOVE_MESSAGE'
    payload: RemoveMessagePayload
  }
  | {
    type: 'SET_ALERT'
    payload: SetAlertPayload
  }
  | {
    type: 'HIDE_ALERT'
  }
)

export type Actions = {
  SET_IS_LOADING: (state: State, payload: LoadingPayload) => State
  SET_MESSAGE: (state: State, payload: MessagePayload
  | ErrorMessagePayload) => State
  REMOVE_MESSAGE: (state: State, payload: RemoveMessagePayload) => State
  SET_ALERT: (state: State, payload: SetAlertPayload) => State
  HIDE_ALERT: (state: State) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
