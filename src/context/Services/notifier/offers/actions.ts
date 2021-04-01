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
  SET_ORDER: (state, { plan, priceOption }) => ({
    ...state,
    order: {
      item: {
        ...plan,
        ...priceOption,
      },
      isProcessing: false,
    },
  }),
}

export default actions
