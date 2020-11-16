import { recursiveDiff } from 'context/storeUtils/recursiveDiff'
import Logger from 'utils/Logger'
import {
  Actions, Action, State, IsWhitelistedProviderPayload,
} from './interfaces'

export const actions: Actions = {
  SET_IS_WHITELISTED_PROVIDER: (
    state: State,
    { isWhitelistedProvider }: IsWhitelistedProviderPayload,
  ): State => ({
    ...state,
    isWhitelistedProvider,
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
