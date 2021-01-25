import { ContextDispatch } from 'context/storeUtils/interfaces'
import { Modify } from 'utils/typeUtils'
import {
  Message, MessageId, ErrorMessage, LoaderId,
} from 'models/UIMessage'

import { AppState } from './AppContext'

export type APP_ACTION =
  | 'SET_IS_LOADING'
  | 'SET_MESSAGE'
  | 'REMOVE_MESSAGE'
  | 'SET_ALERT'
  | 'HIDE_ALERT'

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

export type AppPayload = LoadingPayload |
  MessagePayload |
  ErrorMessagePayload |
  RemoveMessagePayload |
  SetAlertPayload | {}

export type AppAction = ContextDispatch<APP_ACTION, AppPayload>

export interface AppReducer<P extends AppPayload> {
  (state: AppState, payload: P): AppState
}

type AppActions = {
  SET_IS_LOADING: AppReducer<LoadingPayload>
  SET_MESSAGE: AppReducer<MessagePayload | ErrorMessagePayload>
  REMOVE_MESSAGE: AppReducer<RemoveMessagePayload>
  SET_ALERT: AppReducer<SetAlertPayload>
  HIDE_ALERT: AppReducer<{}>
}

const LOADING_MSG_ID = 'loading'

export const appActions: AppActions = {
  SET_IS_LOADING: (state, payload: LoadingPayload) => {
    const { isLoading, message, id } = payload
    const { messages, loaders } = state
    const messagesCopy = { ...messages }

    if (!isLoading) {
      delete messagesCopy[LOADING_MSG_ID]
    }
    return {
      ...state,
      messages: message ? {
        ...messagesCopy,
        [LOADING_MSG_ID]: {
          text: message,
          type: 'info',
        },
      } : messagesCopy,
      loaders: {
        ...loaders,
        [id]: isLoading,
      },
    }
  },
  SET_MESSAGE: (state, payload: MessagePayload | ErrorMessagePayload) => {
    const { messages } = state
    const { id, ...message } = payload

    return {
      ...state,
      messages: {
        ...messages,
        [id]: message,
      },
    }
  },
  REMOVE_MESSAGE: (state, payload: RemoveMessagePayload) => {
    const { id } = payload
    const { messages } = state

    const messagesCopy = { ...messages }
    delete messagesCopy[id]

    return {
      ...state,
      messages: messagesCopy,
    }
  },
  SET_ALERT: (state, { message }: SetAlertPayload) => ({
    ...state,
    alertPanel: {
      display: true,
      message,
    },
  }),
  HIDE_ALERT: (state, _) => ({
    ...state,
    alertPanel: {
      display: false,
      message: '',
    },
  }),
}
