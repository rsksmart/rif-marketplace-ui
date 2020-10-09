import { Dispatch } from 'react'

export type State = {
  totalStaked: number
  isFetching: boolean
  canWithdraw: boolean
  // TODO: ...
}

export type Action =
  | {
      type: 'SET_STAKE'
      payload: { totalStaked: number }
    }
  | {
      type: 'SET_CAN_WITHDRAW'
      payload: { canWithdraw: boolean }
    }

export type Actions = {
  SET_TOTAL_STAKE: (state: State, { totalStaked: number }) => State
  SET_CAN_WITHDRAW: (state: State, { canWithdraw: boolean }) => State
}

export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
