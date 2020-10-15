import { ActionFunctions } from './interfaces'

const actions: ActionFunctions = {
  SET_LISTING: (state, agreements) => ({
    ...state,
    agreements,
  }),
}

export default actions
