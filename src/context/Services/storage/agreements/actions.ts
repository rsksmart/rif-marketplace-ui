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
  SET_FILTERS: (state, filters) => ({
    ...state,
    filters,
  }),
}

export default actions
