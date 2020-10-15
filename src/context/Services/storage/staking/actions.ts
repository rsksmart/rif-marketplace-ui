import Logger from 'utils/Logger'
import { Action, Actions, State } from './interfaces'

export const actions: Actions = {
  SET_IS_AWAITING: (state: State, { isAwaiting }): State => ({
    ...state,
    isAwaiting,
  }),
  SET_TOTAL_STAKE: (state: State, { totalStaked }): State => ({
    ...state,
    totalStaked,
  }),
  SET_NEEDS_REFRESH: (state: State, { needsRefresh }): State => ({
    ...state,
    needsRefresh,
  }),
}

const logger = Logger.getInstance()

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action
  const actionFunction = actions[type]

  if (actionFunction) {
    const newState: State = actionFunction(state, payload as never)

    if (state === newState) {
      logger.debug(
        'Checkout Context Action',
        type,
        'no change in state:',
        state,
      )
    } else {
      logger.debug('Checkout Context Action', type, 'old state:', state)
      logger.debug('Checkout Context Action', type, 'new state:', newState)
    }
    return newState
  }

  logger.warn('Storage Checkout Context:', type, 'action is not defined!')
  return state
}
