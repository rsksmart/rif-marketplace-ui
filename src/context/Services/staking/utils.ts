import {
  mapFromTransport, StakeTransport,
} from 'api/rif-marketplace-cache/common/stakes'
import { Dispatch } from 'react'
import { Action } from './interfaces'

export const setStakeNeedsRefresh = (
  dispatch: Dispatch<Action>,
) => (): void => {
  dispatch({
    type: 'SET_NEEDS_REFRESH',
    payload: { needsRefresh: true },
  })
}

export const onStakeUpdated = (
  dispatch: Dispatch<Action>,
  updatedVal: StakeTransport,
): void => {
  const { stakedBalances, totalStakedUSD } = mapFromTransport(updatedVal)
  dispatch({
    type: 'SET_TOTAL_STAKED_USD',
    payload: { totalStakedUSD },
  })
  dispatch({
    type: 'SET_STAKES',
    payload: stakedBalances,
  })
  dispatch({
    type: 'SET_NEEDS_REFRESH',
    payload: { needsRefresh: false },
  })
}
