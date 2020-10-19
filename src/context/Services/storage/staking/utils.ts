import { StakeTransport } from 'api/models/storage/transports'
import { mapFromTransport } from 'api/rif-marketplace-cache/storage/stakes'
import { Dispatch } from 'react'
import { Action } from './interfaces'

export const setStakeNeedsRefresh = (dispatch: Dispatch<Action>) => () => {
  dispatch({
    type: 'SET_NEEDS_REFRESH',
    payload: { needsRefresh: true },
  })
}

export const onStakeUpdated = (
  dispatch: Dispatch<Action>,
  updatedVal: StakeTransport,
) => {
  const { stakedBalances, totalStakedUSD } = mapFromTransport(updatedVal)
  dispatch({
    type: 'SET_TOTAL_STAKED_USD',
    payload: { totalStakedUSD },
  })
  dispatch({
    type: 'SET_STAKES',
    payload: stakedBalances,
  })
  // TODO: move to appContext
  dispatch({
    type: 'SET_IS_AWAITING',
    payload: { isAwaiting: false },
  })
  dispatch({
    type: 'SET_NEEDS_REFRESH',
    payload: { needsRefresh: false },
  })
}
