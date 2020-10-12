import { Actions, State } from './interfaces'

export const actions: Actions = {
  SET_CAN_WITHDRAW: (state: State, { canWithdraw }): State => ({
    ...state,
    canWithdraw,
  }),
  SET_TOTAL_STAKE: (state: State, { totalStaked }): State => ({
    ...state,
    totalStaked,
  }),
}

export default {}
