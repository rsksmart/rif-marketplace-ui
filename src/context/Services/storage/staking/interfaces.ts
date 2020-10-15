import { Dispatch } from 'react'

export type State = {
  totalStaked: number
  isAwaiting: boolean
  needsRefresh: boolean
}

export type Action =
  | {
      type: 'SET_TOTAL_STAKE'
      payload: { totalStaked: number }
    }
  | {
      type: 'SET_IS_AWAITING'
      payload: { isAwaiting: boolean }
    }
  | {
      type: 'SET_NEEDS_REFRESH'
      payload: { needsRefresh: boolean }
    }

export type Actions = {
  SET_TOTAL_STAKE: (state: State, { totalStaked: number }) => State
  SET_IS_AWAITING: (state: State, { isAwaiting: boolean }) => State
  SET_NEEDS_REFRESH: (state: State, { needsRefresh }) => State
}

export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
