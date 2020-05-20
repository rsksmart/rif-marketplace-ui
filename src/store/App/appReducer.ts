import {
  AppAction, AppPayload, LoadingPayloadType, MessagePayloadType,
} from 'store/App/appActions'
import Logger from 'utils/Logger'
import { APP_ACTIONS } from './appActions'
import { AppStateType, initialState } from './AppStore'

const logger = Logger.getInstance()

const {
  SET_IS_LOADING,
  SET_MESSAGE,
  UNSET,
} = APP_ACTIONS

const appActions: IAppActions = {
  [SET_IS_LOADING]: (state, payload: LoadingPayloadType) => ({
    ...state,
    ...payload,
  }),
  [SET_MESSAGE]: (state, payload: MessagePayloadType) => ({
    ...state,
    ...payload,
  }),
  [UNSET]: (state, _payload) => state,
}

// TODO: Extract reusable
const appReducer = (state = initialState, action: AppAction) => {
  const { type, payload } = action
  const userAction = appActions[type]

  // if (userAction)
  logger.debug('App action:', action)
  const newState = (!!userAction && userAction(state, payload)) || state

  if (state !== newState) {
    logger.debug('Prev state:', state)
    logger.debug('Next state:', newState)
  } else {
    logger.debug('No change:', newState)
  }

  return newState
}
export default appReducer

type IAppActions = {
  [key in APP_ACTIONS]: (state: AppStateType, payload: AppPayload) => AppStateType
}
