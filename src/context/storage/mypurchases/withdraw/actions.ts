import { recursiveDiff } from 'context/storeUtils/recursiveDiff'
import { Agreement } from 'models/marketItems/StorageItem'
import Logger from 'utils/Logger'
import {
  Actions, Action, State, StatusPayload,
} from './interfaces'

export const actions: Actions = {
  SET_STATUS: (
    state: State,
    payload: StatusPayload,
  ): State => ({
    ...state,
    status: payload,
  }),
  SET_AGREEMENT: (
    state: State,
    payload: Agreement,
  ): State => ({
    ...state,
    agreement: payload,
  }),
}

const logger = Logger.getInstance()

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action
  const actionFunction = actions[type]

  if (actionFunction) {
    const newState: State = actionFunction(state, payload as never)

    if (state === newState) {
      logger.debug('Renew Context Action', type, 'no change in state:', state)
    } else {
      logger.debug('Renew Context Action', type, 'old state:', state)
      logger.debug('Renew Context Action', type, 'new state:', newState)
      const diff = recursiveDiff(newState, state)
      logger.debug('Renew Context Action', type, 'state diff:', diff)
    }
    return newState
  }

  logger.warn('Storage Agreement Renew Context:', type, 'action is not defined!')
  return state
}
