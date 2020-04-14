import { AppAction, AppPayload, ILoadingPayload, IMessagePayload } from 'store/App/appActions'
import Logger from 'utils/Logger'
import { APP_ACTIONS } from './appActions'
import { IAppState, initialState } from './AppStore'

const logger = Logger.getInstance()

const appReducer = (state = initialState, action: AppAction) => {
  const { type, payload } = action
  const userAction = appActions[type]
  if (!!userAction) logger.debug('App action:', action)
  const newState = (!!userAction && userAction(state, payload)) || state;

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
  [key in APP_ACTIONS]: (state: IAppState, payload: AppPayload) => IAppState
}

const {
  SET_IS_LOADING,
  SET_MESSAGE,
  UNSET,
} = APP_ACTIONS

const appActions: IAppActions = {
  [SET_IS_LOADING]: (state, payload: ILoadingPayload) => {
    return {
      ...state,
      ...payload,
    }
  },
  [SET_MESSAGE]: (state, payload: IMessagePayload) => {
    return {
      ...state,
      ...payload,
    }
  },
  [UNSET]: (state, _payload) => state,
}
