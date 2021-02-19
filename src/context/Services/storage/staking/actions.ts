import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import {
  Actions,
  State,
} from './interfaces'

const actions: Actions = {
  SET_NEEDS_REFRESH: (state: State, { needsRefresh }): State => ({
    ...state,
    needsRefresh,
  }),
  SET_TOTAL_STAKED_USD: (state: State, { totalStakedUSD }): State => ({
    ...state,
    totalStakedUSD,
  }),
  SET_STAKES: (state: State, stakes: StakedBalances): State => ({
    ...state,
    stakes,
  }),
}

export default actions
