import { Actions } from './interfaces'
import { initialState } from './OffersContext'

const actions: Actions = {
  SET_LISTING: (state, payload) => ({
    ...state,
    listing: {
      items: payload.items,
    },
  }),
  REFRESH: (state, { refresh }) => ({
    ...state,
    needsRefresh: refresh,
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
  CLEAN_UP: () => initialState,
  SET_ORDER: (state, payload) => ({
    ...state, order: { ...payload, isProcessing: false },
  }),
}

export default actions
