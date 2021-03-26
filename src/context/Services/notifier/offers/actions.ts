import { Actions } from './interfaces'

const actions: Actions = {
  SET_LISTING: (state, { items }) => ({
    ...state,
    listing: {
      items: items ?? [],
    },
  }),
  FILTER: (state, payload) => ({
    ...state,
    filters: {
      ...state.filters,
      ...payload,
    },
  }),
  UPDATE_LIMITS: (state, payload) => ({
    ...state,
    limits: {
      ...state.limits,
      ...payload,
    },
  }),
}

export default actions
