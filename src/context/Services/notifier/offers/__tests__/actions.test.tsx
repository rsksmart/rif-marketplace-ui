import Big from 'big.js'
import { NotifierOfferItem } from 'models/marketItems/NotifierItem'
import { SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'
import { notifierOffersActions, notifierOffersInitialState, NotifierOffersState } from '..'
import { ListingPayload, OffersListing } from '../interfaces'

const testDefaults = {
  initialState: notifierOffersInitialState,
}

const MOCK_OFFER: NotifierOfferItem = {
  id: 'MOCK_ID',
  plans: [
    {
      id: 'MOCK_PLAN_ID',
      channels: ['sms'],
      expirationDate: new Date(),
      limit: 200,
      priceOptions: [
        {
          token: SYSTEM_SUPPORTED_SYMBOL.rif,
          value: Big(1),
        },
      ],
    },
  ],
}

const MOCK_STATE: NotifierOffersState = {
  contextID: testDefaults.initialState.contextID,
  listing: {
    items: [MOCK_OFFER],
  },
  needsRefresh: !testDefaults.initialState.needsRefresh,
  order: {
    isProcessing: true,
    item: MOCK_OFFER,
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
