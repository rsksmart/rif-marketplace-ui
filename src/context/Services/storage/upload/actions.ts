import { Actions } from './interfaces'

const actions: Actions = {
  SET_STATUS: (state, payload) => ({
    ...state,
    status: {
      ...state.status,
      ...payload,
    },
  }),
}

export default actions
