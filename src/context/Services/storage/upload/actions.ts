import { Actions } from './interfaces'

const actions: Actions = {
  SET_STATUS: (state, payload) => ({
    ...state,
    status: {
      ...state.status,
      ...payload,
    },
  }),
  SET_SIZE_LIMIT: (state, { fileSizeLimit }) => ({
    ...state,
    fileSizeLimit,
  }),
}

export default actions
