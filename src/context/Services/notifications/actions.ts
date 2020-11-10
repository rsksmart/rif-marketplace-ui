import { ActionFunctions } from './interfaces'

const actions: ActionFunctions = {
  SET_NOTIFICATIONS: (state, notifications) => ({
    ...state,
    notifications: [
      ...notifications,
      ...state.notifications,
    ],
  }),
}

export default actions
