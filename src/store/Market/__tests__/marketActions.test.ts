import { marketActions, TxTypeChangePayload, ExchangeRatePayload } from '../marketActions'
import { initialState, TxType, MarketState } from '../MarketStore'

describe('MarketActions', () => {
  describe('TOGGLE_TX_TYPE', () => {
    test('should return state with txType property set to given value', () => {
      const expectedValue = TxType.SELL
      const payload: TxTypeChangePayload = {
        txType: expectedValue,
      }
      initialState.txType = TxType.BUY
      const { txType } = marketActions.TOGGLE_TX_TYPE(initialState, payload)

      expect(txType).toEqual(expectedValue)
    })
  })

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
