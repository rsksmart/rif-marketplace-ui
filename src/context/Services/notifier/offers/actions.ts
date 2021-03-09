import { Actions } from './interfaces'

const actions: Actions = {
  SET_LISTING: (state, payload) => ({
    ...state,
    listing: {
      items: payload.items,
    },
  }),
}

export default actions
