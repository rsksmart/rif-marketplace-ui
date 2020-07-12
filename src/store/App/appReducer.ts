import {
  AppPayload, LoadingPayload, MessagePayload, RemoveMessagePayload,
} from 'store/App/appActions'
import { APP_ACTIONS } from './appActions'
import { AppState } from './AppStore'

export interface AppReducer {
  (state: AppState, payload: AppPayload): AppState
}

export type AppActions = {
  [key in APP_ACTIONS]: AppReducer
}

export const appActions: AppActions = {
  NOOP: (state, _payload) => state,
  SET_IS_LOADING: (state, payload: LoadingPayload) => ({
    ...state,
    ...payload,
  }),
  SET_MESSAGE: (state, payload: MessagePayload) => {
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
