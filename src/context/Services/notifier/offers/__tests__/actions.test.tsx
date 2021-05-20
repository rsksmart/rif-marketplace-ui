import Big from 'big.js'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { SUPPORTED_FIAT } from 'models/Fiat'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { notifierOffersActions, notifierOffersInitialState, NotifierOffersState } from '..'
import { ListingPayload, OffersListing } from '../interfaces'

const testDefaults = {
  initialState: notifierOffersInitialState,
}

const MOCK_OFFER: NotifierOfferItem = {
  provider: 'MOCK_PROVIDER_ID',
  name: 'MOCK_PLAN_NAME',
  id: 'MOCK_PLAN_ID',
  channels: ['sms'],
  daysLeft: 2,
  limit: 200,
  priceOptions: [
    {
      token: SUPPORTED_TOKEN_RECORDS.rbtc,
      value: Big(1),
    },
  ],
}

const MOCK_STATE: NotifierOffersState = {
  contextID: testDefaults.initialState.contextID,
  listing: {
    items: [MOCK_OFFER],
  },
  order: {
    isProcessing: true,
    item: MOCK_OFFER,
  },
  filters: {
    size: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0,
      fiatSymbol: SUPPORTED_FIAT.usd.symbol,
    },
    currency: new Set(),
    channels: new Set(),
  },
  limits: {
    size: {
      min: 0,
      max: 0,
    },
    price: {
      min: 0,
      max: 0,
      fiatSymbol: SUPPORTED_FIAT.usd.symbol,
    },
  },
}

describe('Notifier Offers Context actions', () => {
  const {
    SET_LISTING,
  } = notifierOffersActions

  beforeEach(() => {
    testDefaults.initialState = notifierOffersInitialState
  })

  describe('SET_LISTING', () => {
    test('should return state with correct listing property', () => {
      const expectedListing: OffersListing = MOCK_STATE.listing
      const payload: ListingPayload = expectedListing
      const {
        listing,
      }: Partial<NotifierOffersState> = SET_LISTING(
        testDefaults.initialState, payload,
      )

      expect(listing).toEqual(expectedListing)
    })
  })
})
