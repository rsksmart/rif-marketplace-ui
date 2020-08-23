import { render, cleanup } from '@testing-library/react'

import React, { FC, useContext } from 'react'
import MarketContext, { MarketContextProvider, TxType } from '../MarketContext'

const expectedInitialCrypto = {
  rif: {
    displayName: 'RIF',
    rate: -1,
  },
  rbtc: {
    displayName: 'RBTC',
    rate: -1,
  },
}

describe('MarketContextProvider', () => {
  afterEach(cleanup)

  describe('initial state', () => {
    test('should contain contextID with value "market"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { contextID } } = useContext(MarketContext)

        expect(contextID).toEqual('market')
        return null
      }

      render(
        <MarketContextProvider>
          <TestComponent />
        </MarketContextProvider>,
      )
    })

    test(`should initialise with txType property set to ${TxType.BUY}`, () => {
      const expectedValue = TxType.BUY
      const TestComponent = () => {
        const { state: { txType } } = useContext(MarketContext)

        expect(txType).toEqual(expectedValue)
        return null
      }
      render(
        <MarketContextProvider>
          <TestComponent />
        </MarketContextProvider>,
      )
    })

    test('should initialise with exchangeRates property', () => {
      const TestComponent = () => {
        const { state: { exchangeRates } } = useContext(MarketContext)

        expect(exchangeRates).not.toBeUndefined()
        return null
      }
      render(
        <MarketContextProvider>
          <TestComponent />
        </MarketContextProvider>,
      )
    })

    describe('exchangeRates', () => {
      test('should initialise with currentFiat property containing { symbol: \'usd\', displayName: \'USD\' }', () => {
        const TestComponent = () => {
          const { state: { exchangeRates: { currentFiat } } } = useContext(MarketContext)
          const expectedCurrentFiat = {
            symbol: 'usd',
            displayName: 'USD',
          }

          expect(currentFiat).not.toBeUndefined()
          expect(currentFiat).toEqual(expectedCurrentFiat)
          return null
        }
        render(
          <MarketContextProvider>
            <TestComponent />
          </MarketContextProvider>,
        )
      })

      test(`should initialise with crypto property set to ${JSON.stringify(expectedInitialCrypto)}`, () => {
        const TestComponent = () => {
          const { state: { exchangeRates: { crypto } } } = useContext(MarketContext)

          expect(crypto).not.toBeUndefined()
          expect(crypto).toEqual(expectedInitialCrypto)
          return null
        }
        render(
          <MarketContextProvider>
            <TestComponent />
          </MarketContextProvider>,
        )
      })
    })
  })
})
