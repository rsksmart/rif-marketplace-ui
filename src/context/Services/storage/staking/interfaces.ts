import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import { Dispatch } from 'react'

export type AmountPerToken = Record<SupportedTokens, string>

export type State = {
  isAwaiting: boolean
  needsRefresh: boolean
  totalStakedUSD: string
  stakes: AmountPerToken
}

export type Action =
  | {
      type: 'SET_IS_AWAITING'
      payload: { isAwaiting: boolean }
    }
  | {
      type: 'SET_NEEDS_REFRESH'
      payload: { needsRefresh: boolean }
    }
  | {
      type: 'SET_TOTAL_STAKED_USD'
      payload: { totalStakedUSD: string }
    }

export type Actions = {
  SET_IS_AWAITING: (state: State, { isAwaiting: boolean }) => State
  SET_NEEDS_REFRESH: (state: State, { needsRefresh: boolean }) => State
  SET_TOTAL_STAKED_USD: (state: State, { totalStakedUSD: string }) => State
}

export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
