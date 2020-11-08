import { Actions } from './interfaces'

const actions: Actions = {
  SET_STATUS: (state, status) => ({
    ...state,
    status,
  }),
}

export default actions
