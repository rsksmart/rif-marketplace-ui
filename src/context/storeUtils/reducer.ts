import Logger from 'utils/Logger'
import {
  ContextDispatch, ContextPayload, ContextState, ContextActions, ContextAction, ContextReducer, ContextActionType,
} from './interfaces'

const logger = Logger.getInstance()

const storeReducerFactory = (
  initialState: ContextState,
  actions: ContextActions,
  errorHandle?: Function,
): ContextReducer => (
  state = initialState,
  dispatcher: ContextDispatch<ContextActionType, ContextPayload>,
) => {
  const { type, payload } = dispatcher
  const action: ContextAction = actions[type]
  const { contextID } = initialState

  if (!action) {
    logger.error(`Action ${type} does not exist in ${contextID} actions.`)
    return state
  }

  logger.debug(`${contextID} action:`, type)
  logger.debug(`${contextID} payload:`, payload)
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

export const createReducer = <State extends ContextState>(
  initialState: State,
  actions,
  errorHandle?: Function,
) => (
    state = initialState,
    dispatcher,
  ): State => {
    const { type, payload } = dispatcher
    const action: ContextAction = actions[type]
    const { contextID } = initialState

    if (!action) {
      logger.error(`Action ${type} does not exist in ${contextID} actions.`)
      return state
    }

    logger.debug(`${contextID} action:`, type)
    logger.debug(`${contextID} payload:`, payload)
    try {
      const newState = (!!action && action(state, payload)) || state

      if (state !== newState) {
        logger.debug('Prev state:', state)
        logger.debug('Next state:', newState)
      } else {
        logger.debug('No change:', newState)
      }

      return newState as State
    } catch (e) {
      if (errorHandle) { errorHandle(e) }
      return state
    }
  }

export default storeReducerFactory
