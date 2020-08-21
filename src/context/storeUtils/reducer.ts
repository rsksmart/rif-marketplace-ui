import Logger from 'utils/Logger'
import {
  ContextDispatcher, ContextPayload, ContextState, ContextActions, ContextAction, ContextReducer, ContextActionType,
} from './interfaces'

const logger = Logger.getInstance()

const storeReducerFactory = (
  initialState: ContextState,
  actions: ContextActions,
  errorHandle?: Function,
): ContextReducer => (
  state = initialState,
  dispatcher: ContextDispatcher<ContextActionType, ContextPayload>,
) => {
  const { type, payload } = dispatcher
  const action: ContextAction = actions[type]

  logger.debug(`${initialState.storeID} action:`, type)
  logger.debug(`${initialState.storeID} payload:`, payload)
  try {
    const newState = (!!action && action(state, payload)) || state

    if (state !== newState) {
      logger.debug('Prev state:', state)
      logger.debug('Next state:', newState)
    } else {
      logger.debug('No change:', newState)
    }

    return newState
  } catch (e) {
    if (errorHandle) { errorHandle(e) }
    return state
  }
}

export default storeReducerFactory
