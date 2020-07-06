import { AppPayload, LoadingPayloadType, MessagePayloadType } from 'store/App/appActions'
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
  SET_IS_LOADING: (state, payload: LoadingPayloadType) => ({
    ...state,
    ...payload,
  }),
  SET_MESSAGE: (state, payload: MessagePayloadType) => ({
    ...state,
    ...payload,
  }),
}
