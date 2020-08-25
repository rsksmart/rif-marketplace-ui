import { ExchangeRatePayload, marketActions } from '../marketActions'
import { initialState, MarketState } from '../MarketContext'

describe('MarketActions', () => {

  describe('SET_EXCHANGE_RATE', () => {
    test('should return state with property exchangeRates.crypto containing given property', () => {
      const expectedKey = 'fakeToken'
      const expectedProperty = {
        displayName: 'FAKE_TOKEN',
        rate: 9.999,
      }
      const payload: ExchangeRatePayload = {
        [expectedKey]: expectedProperty,
      }
      const { exchangeRates: { crypto } }: MarketState = marketActions.SET_EXCHANGE_RATE(initialState, payload)

      expect(crypto).toHaveProperty(expectedKey)
      expect(crypto[expectedKey]).toEqual(expectedProperty)
    })
  })
})
