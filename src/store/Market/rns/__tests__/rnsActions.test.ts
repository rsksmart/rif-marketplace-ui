import Big from 'big.js'
import { RnsDomain } from 'models/marketItems/DomainItem'
import {
  rnsActions, FilterPayload, LimitsPayload, OutdatePayload, RefreshPayload, OrderPayload, ProgressPayload,
} from '../rnsActions'
import { initialState } from '../DomainsStore'
import { RnsState, RnsOrder } from '../interfaces'

const fakeDomain: RnsDomain = {
  expirationDate: new Date(),
  id: 'fake_id_0',
  name: 'fake_name',
  ownerAddress: 'fake_owner',
  tokenId: 'fake_token_id',
  offer: {
    paymentToken: 'fake_payment_token',
    price: Big(9999),
  },
}

describe('RnsActions', () => {
  describe('FILTER', () => {
    test('should return previous state when payload is empty', () => {
      const actualState = rnsActions.FILTER(initialState as RnsState, {})

      expect(actualState).toEqual(initialState)
    })

    test('should return state with modified filters when filters defined', () => {
      const payload: FilterPayload = { name: 'fake_name' }
      const { filters } = rnsActions.FILTER(initialState as RnsState, payload)
      const expectedFilters = { ...initialState.filters, ...payload }

      expect(filters).toEqual(expectedFilters)
    })
  })

  describe('UPDATE_LIMITS', () => {
    test('should return state with empty filters property when payload is empty', () => {
      const { limits } = rnsActions.UPDATE_LIMITS(initialState as RnsState, {})

      expect(limits).toEqual({})
    })

    test('should return state with modified filers when filters defined', () => {
      const payload: LimitsPayload = { price: { max: 1000, min: 99 } }
      const { limits } = rnsActions.UPDATE_LIMITS(initialState as RnsState, payload)
      const expectedLimits = { ...initialState.limits, ...payload }

      expect(limits).toEqual(expectedLimits)
    })
  })

  describe('OUTDATE', () => {
    test('should return state containig listing property with outdated tokens array containing given tokenId', () => {
      const expectedTokenId = 'fake_token_id'
      const payload: OutdatePayload = { tokenId: expectedTokenId }
      expect(initialState.listing.outdatedTokens).not.toContain(expectedTokenId)
      const { listing: { outdatedTokens } } = rnsActions.OUTDATE(initialState as RnsState, payload)

      expect(outdatedTokens).toContain(expectedTokenId)
    })
  })

  describe('REFRESH', () => {
    test('should return state with needsRefresh property set to given value', () => {
      const expectedValue = !initialState.needsRefresh
      const payload: RefreshPayload = { refresh: true }
      const { needsRefresh } = rnsActions.REFRESH(initialState as RnsState, payload)

      expect(needsRefresh).toBe(expectedValue)
    })
  })
  describe('SET_ORDER', () => {
    test('should return state with order property set to given value', () => {
      const expectedValue: RnsOrder<RnsDomain> = {
        isOutdated: false,
        isProcessing: false,
        item: fakeDomain,
      }
      const payload: OrderPayload = expectedValue as any
      expect(initialState.order).toBeUndefined()
      const { order } = rnsActions.SET_ORDER(initialState as RnsState, payload)

      expect(order).toEqual(expectedValue)
    })
  })

  describe('SET_PROGRESS', () => {
    test('should return previous state if state has no order property', () => {
      const payload: ProgressPayload = { isProcessing: true }
      expect(initialState.order).toBeUndefined()
      const { order } = rnsActions.SET_PROGRESS(initialState as RnsState, payload)

      expect(order).toBeUndefined()
    })

    test('should return state with order.isProcessing set to value of payload.isProcessing', () => {
      initialState.order = {
        isOutdated: true,
        isProcessing: true,
        item: fakeDomain,
      }
      const expectedValue = !initialState.order.isProcessing
      const payload: ProgressPayload = { isProcessing: expectedValue }
      const { order } = rnsActions.SET_PROGRESS(initialState as RnsState, payload)

      expect(order?.isProcessing).toEqual(expectedValue)
    })
  })

  describe('CLEAR_ORDER', () => {
    test('should return state with order property undefined', () => {
      initialState.order = {
        isOutdated: true,
        isProcessing: true,
        item: fakeDomain,
      }
      const { order } = rnsActions.CLEAR_ORDER(initialState as RnsState, {})

      expect(order).toBeUndefined()
    })
  })
})
