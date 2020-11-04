import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import { actions } from '../actions'
import { initialState } from '../Context'
import { State } from '../interfaces'

const FAKE_STAKED_BALANCES: StakedBalances = {
  rbtc: '100000000000000000',
  rif: '100000000000000000',
}

const FAKE_TOTAL_STAKED_USD = '12000'

const FAKE_NEEDS_REFRESH = true

describe('StakingActions', () => {
  describe('SET_STAKES', () => {
    test('should return state with staked balances equal to FAKE_STAKED_BALANCES', () => {
      const actualState = actions.SET_STAKES(
        initialState, FAKE_STAKED_BALANCES,
      )
      const expectedState: State = {
        ...initialState,
        stakes: FAKE_STAKED_BALANCES,
      }
      expect(actualState).toEqual(expectedState)
    })
  })
  describe('SET_TOTAL_STAKED_USD', () => {
    it('should return state with totalStakedUSD equal to FAKE_TOTAL_STAKED_USD', () => {
      const actualState = actions.SET_TOTAL_STAKED_USD(
        initialState, { totalStakedUSD: FAKE_TOTAL_STAKED_USD },
      )
      const expectedState: State = {
        ...initialState,
        totalStakedUSD: FAKE_TOTAL_STAKED_USD,
      }
      expect(actualState).toEqual(expectedState)
    })
  })
  describe('SET_NEEDS_REFRESH', () => {
    test('should return state with needsRefresh equal to FAKE_NEEDS_REFRESH', () => {
      const actualState = actions.SET_NEEDS_REFRESH(
        initialState, { needsRefresh: FAKE_NEEDS_REFRESH },
      )
      const expectedState: State = {
        ...initialState,
        needsRefresh: FAKE_NEEDS_REFRESH,
      }
      expect(actualState).toEqual(expectedState)
    })
  })
})
