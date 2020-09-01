import {
  StorageOffer, BillingPlan, PeriodInSeconds,
} from 'models/marketItems/StorageItem'
import { Big } from 'big.js'
import { storageOffersActions, ListingPayload } from '../offersActions'
import { initialState, StorageOffersState } from '../OffersContext'

const FAKE_BILLING_PLAN: BillingPlan[] = [
  {
    currency: 'RBTC',
    period: PeriodInSeconds[PeriodInSeconds.Daily],
    price: Big(10).pow(18),
  },
]
const FAKE_LISTING: StorageOffer[] = [
  {
    availableSize: Big(3000),
    id: 'fake_id',
    location: 'fake_location',
    averagePrice: 5,
    system: 'fake_system',
    subscriptionOptions: FAKE_BILLING_PLAN,
  },
]

describe('OffersActions', () => {
  describe('SET_LISTING', () => {
    test('should return state with new listing property containing FAKE_LISTING', () => {
      const payload: ListingPayload = {
        items: FAKE_LISTING,
      }
      const actualState = storageOffersActions.SET_LISTING(initialState as StorageOffersState, payload)
      const expectState: StorageOffersState = {
        ...initialState,
        listing: {
          items: FAKE_LISTING,
        },
      }

      expect(actualState).toEqual(expectState)
    })
  })
})
