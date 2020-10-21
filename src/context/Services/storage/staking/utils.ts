import { StakeTransport } from 'api/models/storage/transports'
import { mapFromTransport } from 'api/rif-marketplace-cache/storage/stakes'
import { BlockchainAction } from 'context/Blockchain/blockchainActions'
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
  bcDispatch: Dispatch<BlockchainAction>,
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
  bcDispatch({
    type: 'SET_AWAITING_CONFIRMATIONS',
    payload: { service: 'staking', isAwaiting: false } as never,
  })
  dispatch({
    type: 'SET_NEEDS_REFRESH',
    payload: { needsRefresh: false },
  })
}
