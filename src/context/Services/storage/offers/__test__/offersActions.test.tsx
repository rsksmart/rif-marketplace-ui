import Big from 'big.js'
import { StorageOffer, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { storageOffersActions, storageOffersInitialState, StorageOffersState } from '..'
import {
  ListingPayload, RefreshPayload,
  LimitsPayload,
  OffersListing, ContextFilters,
  FiltersLimits, ContextLimits,
} from '../interfaces'

const testDefaults = {
  initialState: storageOffersInitialState,
}

const MOCK_OFFER: StorageOffer = {
  id: 'MOCK',
  location: 'MOCK',
  system: 'MOCK',
  availableSizeGB: new Big(0),
  utilizedCapacityGB: new Big(0),
  subscriptionOptions: [
    {
      period: 'Daily',
      price: new Big(0),
      currency: SUPPORTED_TOKEN_RECORDS.rbtc,
    },
  ],
  averagePrice: 0,
  acceptedCurrencies: ['rbtc'],
  peerId: '0',
  totalCapacityGB: new Big(0),
  isActive: true,
}

const MOCK_STATE: StorageOffersState = {
  contextID: testDefaults.initialState.contextID,
  order: {
    isProcessing: true,
    item: MOCK_OFFER,
  },
  needsRefresh: !testDefaults.initialState.needsRefresh,
  filters: {
    periods: new Set(['Daily' as SubscriptionPeriod]),
    price: {
      max: 1,
      min: 0,
    },
    provider: 'MOCK',
    size: {
      max: 1,
      min: 0,
    },
  },
  limits: {
    price: {
      max: 1,
      min: 0,
    },
    size: {
      max: 1,
      min: 0,
    },
  },
  listing: {
    items: [MOCK_OFFER],
  },
}

describe('Storage Agreements Context actions', () => {
  const {
    SET_LISTING,
    REFRESH,
    FILTER,
    UPDATE_LIMITS,
    CLEAN_UP,
    SET_ORDER,
  } = storageOffersActions

  beforeEach(() => {
    testDefaults.initialState = storageOffersInitialState
  })

  describe('SET_LISTING', () => {
    test('should return state with correct listing property', () => {
      const expectedListing: OffersListing = MOCK_STATE.listing
      const payload: ListingPayload = expectedListing
      const {
        listing,
      }: Partial<StorageOffersState> = SET_LISTING(
        testDefaults.initialState, payload,
      )

      expect(listing).toEqual(expectedListing)
    })
  })
  describe('REFRESH', () => {
    test('should return state with correct needsRefresh property', () => {
      const payload: RefreshPayload = { refresh: !!MOCK_STATE.needsRefresh }
      const expectedState: StorageOffersState = {
        ...testDefaults.initialState,
        needsRefresh: payload.refresh,
      }
      const returnedState: Partial<StorageOffersState> = REFRESH(
        testDefaults.initialState, payload,
      )

      expect(returnedState).toEqual(expectedState)
    })
  })
  describe('FILTER', () => {
    test('should return state with correct filters property', () => {
      const expectedFilters: ContextFilters = MOCK_STATE.filters
      const payload: LimitsPayload = {
        ...expectedFilters,
      }
      const expectedState: StorageOffersState = {
        ...testDefaults.initialState,
        filters: payload,
      }
      const state: Partial<StorageOffersState> = FILTER(
        testDefaults.initialState, payload,
      )

      expect(state).toEqual(expectedState)
    })
    test('should not overwrite undefined property of filters', () => {
      const expectedFilters: ContextFilters = MOCK_STATE.filters

      testDefaults.initialState.filters = expectedFilters
      const payload: FiltersLimits = {}
      const expectedState: StorageOffersState = {
        ...testDefaults.initialState,
        filters: expectedFilters,
      }
      const state: Partial<StorageOffersState> = FILTER(
        testDefaults.initialState, payload,
      )

      expect(state).toEqual(expectedState)
    })
  })

  describe('UPDATE_LIMITS', () => {
    test('should return state with correct limits property', () => {
      const expectedLimits: ContextLimits = MOCK_STATE.limits
      const payload: LimitsPayload = {
        ...expectedLimits,
      }
      const expectedState: StorageOffersState = {
        ...testDefaults.initialState,
        limits: payload,
      }
      const state: Partial<StorageOffersState> = UPDATE_LIMITS(
        testDefaults.initialState, payload,
      )

      expect(state).toEqual(expectedState)
    })
  })
  describe('CLEAN_UP', () => {
    test('should return initial state', () => {
      const expectedState: StorageOffersState = testDefaults.initialState
      const returnedState: Partial<StorageOffersState> = CLEAN_UP()

      expect(returnedState).toEqual(expectedState)
    })
  })
  describe('SET_ORDER', () => {
    test('should return state with correct order property', () => {
      const expectedState: StorageOffersState = {
        ...testDefaults.initialState,
        order: {
          isProcessing: false,
          item: MOCK_OFFER,
        },
      }

      const payload: StorageOffer = MOCK_OFFER
      const returnedState: Partial<StorageOffersState> = SET_ORDER(
        testDefaults.initialState, payload,
      )

      expect(returnedState).toEqual(expectedState)
    })
  })
})
