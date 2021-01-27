import { Actions } from './interfaces'

const actions: Actions = {
  SET_EXCHANGE_RATE: (state, payload) => ({
    ...state,
    exchangeRates: {
      ...state.exchangeRates,
      crypto: {
        ...state.exchangeRates.crypto,
        ...payload,
      },
    },
  }),
}

export default actions
