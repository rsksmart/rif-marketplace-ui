import { recursiveDiff } from 'context/storeUtils/recursiveDiff'
import Logger from 'utils/Logger'
import { initialState } from './Context'
import {
  Actions, AuxiliaryState, InitialisePayload, Order,
  PinnedContent, Action, State, StatusPayload,
} from './interfaces'

export const actions: Actions = {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      selectedCurrency,
      selectedPlan: initialState.auxiliary.selectedPlan,
      periodsCount: initialState.auxiliary.periodsCount,
    },
  }),
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      ...payload,
    },
  }),
  SET_ORDER: (state: State, payload: Partial<Order>): State => ({
    ...state,
    order: {
      ...state.order,
      ...payload,
    },
  }),
  SET_PINNED: (state: State, payload: PinnedContent): State => ({
    ...state,
    pinned: {
      ...state.pinned,
      ...payload,
    },
  }),
  INITIALISE: (state: State, {
    currencyOptions, id, location, system,
  }: InitialisePayload): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      currencyOptions,
    },
    order: {
      ...state.order,
      ...{ id, location, system },
    },
  }),
  SET_STATUS: (
    state: State,
    payload: StatusPayload,
  ): State => ({
    ...state,
    status: payload,
  }),
}

const logger = Logger.getInstance()

export const reducer = (state: State, action: Action): State => {
  const { type, payload } = action
  const actionFunction = actions[type]

  if (actionFunction) {
    const newState: State = actionFunction(state, payload as never)

    if (state === newState) {
      logger.debug('Checkout Context Action', type, 'no change in state:', state)
    } else {
      logger.debug('Checkout Context Action', type, 'old state:', state)
      logger.debug('Checkout Context Action', type, 'new state:', newState)
      const diff = recursiveDiff(newState, state)
      logger.debug('Checkout Context Action', type, 'state diff:', diff)
    }
    return newState
  }

  logger.warn('Storage Checkout Context:', type, 'action is not defined!')
  return state
}
