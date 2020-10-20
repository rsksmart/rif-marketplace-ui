import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import Logger from 'utils/Logger'
import {
  Action,
  Actions,
  State,
} from './interfaces'

export const actions: Actions = {
  SET_NEEDS_REFRESH: (state: State, { needsRefresh }): State => ({
    ...state,
    needsRefresh,
  }),
  SET_TOTAL_STAKED_USD: (state: State, { totalStakedUSD }): State => ({
    ...state,
    totalStakedUSD,
  }),
  SET_STAKES: (state: State, stakes: StakedBalances): State => ({
    ...state,
    stakes,
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
