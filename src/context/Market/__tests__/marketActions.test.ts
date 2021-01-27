import { MarketCryptoRecord } from 'models/Market'
import actions from 'context/Market/actions'
import { marketInitialState } from 'context/Market'
import { State as MarketState } from 'context/Market/interfaces'

describe('MarketActions', () => {
  describe('SET_EXCHANGE_RATE', () => {
    test('should return state with property exchangeRates.crypto containing given property', () => {
      const expectedKey = 'fakeToken'
      const expectedProperty = {
        displayName: 'FAKE_TOKEN',
        rate: 9.999,
      }
      const payload: MarketCryptoRecord = {
        [expectedKey]: expectedProperty,
      }
      const {
        exchangeRates: { crypto },
      }: MarketState = actions.SET_EXCHANGE_RATE(marketInitialState, payload)

      expect(crypto).toHaveProperty(expectedKey)
      expect(crypto[expectedKey]).toStrictEqual(expectedProperty)
    })
  })
})
