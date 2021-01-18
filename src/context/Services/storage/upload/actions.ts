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
  SET_IS_LOADING: (state, { sizeLimit }) => ({
    ...state,
    isLoading: { sizeLimit },
  }),
}

export default actions
