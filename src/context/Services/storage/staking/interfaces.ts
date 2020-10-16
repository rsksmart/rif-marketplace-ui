import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import { Dispatch } from 'react'

export type AmountToken = {
  amount: string
  token: SupportedTokens
}

export type State = {
  isAwaiting: boolean
  needsRefresh: boolean
  totalStakedUSD: string
  stakes: Set<AmountToken>
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
  | {
      type: 'SET_STAKE'
      payload: AmountToken
    }
  | {
      type: 'SET_STAKES'
      payload: Set<AmountToken>
    }

export type Actions = {
  SET_IS_AWAITING: (state: State, { isAwaiting: boolean }) => State
  SET_NEEDS_REFRESH: (state: State, { needsRefresh: boolean }) => State
  SET_TOTAL_STAKED_USD: (state: State, { totalStakedUSD: string }) => State
  SET_STAKE: (state: State, amountToken: AmountToken) => State
  SET_STAKES: (state: State, stakes: Set<AmountToken>) => State
}

export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
