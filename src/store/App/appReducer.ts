import {
  AppPayload, ErrorMessagePayload, LoadingPayload, MessagePayload, RemoveMessagePayload,
} from 'store/App/appActions'

import { APP_ACTIONS } from './appActions'
import { AppState } from './AppStore'

export interface AppReducer {
  (state: AppState, payload: AppPayload): AppState
}

export type AppActions = {
  [key in APP_ACTIONS]: AppReducer
}

const LOADING_MSG_ID = 'loading'

export const appActions: AppActions = {
  NOOP: (state, _payload) => state,
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
}
