import {
  StorageOffer, BillingPlan, subscriptionPeriods, TimeInSeconds,
} from 'models/marketItems/StorageItem'
import { Big } from 'big.js'
import { storageActions, ListingPayload } from '../storageActions'
import { initialState, StorageOffersState } from '../OffersContext'
import { StorageState } from '../interfaces'

const FAKE_BILLING_PLAN: BillingPlan[] = [
  {
    currency: 'RBTC',
    period: subscriptionPeriods[TimeInSeconds.DAY],
    price: Big(10).pow(18),
  },
]
const FAKE_LISTING: StorageOffer[] = [
  {
    availableSize: Big(3000),
    id: 'fake_id',
    location: 'fake_location',
    pricePGBPDay: Big(10).pow(18),
    system: 'fake_system',
    subscriptionOptions: FAKE_BILLING_PLAN,
  },
]

describe('StorageActions', () => {
  describe('NOOP', () => {
    test('should return unchanged state', () => {
      const actualState = storageActions.NOOP(initialState as StorageState, {})

      expect(actualState).toEqual(initialState)
    })
  })

  describe('SET_LISTING', () => {
    test('should return state with new listing property containing FAKE_LISTING', () => {
      const payload: ListingPayload = {
        items: FAKE_LISTING,
      }
      const actualState = storageActions.SET_LISTING(initialState as StorageState, payload)
      const expectState: StorageOffersState = {
        ...initialState,
        listing: {
          ...initialState.listing,
          items: FAKE_LISTING,
        },
      }

      expect(actualState).toEqual(expectState)
    })
  })
})
