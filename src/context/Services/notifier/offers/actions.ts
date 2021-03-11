import { Actions } from './interfaces'

const actions: Actions = {
  SET_LISTING: (state, { items }) => ({
    ...state,
    listing: {
      items: items ?? [],
    },
  }),
}

export default actions
