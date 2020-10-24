import { ActionFunctions } from './interfaces'

const actions: ActionFunctions = {
  SET_LISTING: (state, agreements) => ({
    ...state,
    agreements,
  }),
  SET_ORDER: (state, order) => ({
    ...state,
    order,
  }),
}

export default actions
