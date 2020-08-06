import { render, cleanup } from '@testing-library/react'

import React, { FC, useContext } from 'react'
import MarketStore, { MarketStoreProvider, TxType } from '../MarketStore'

describe('MarketStoreProvider', () => {
  afterEach(cleanup)

  describe('initial state', () => {
    test('should contain storeID with value "market"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { storeID } } = useContext(MarketStore)

        expect(storeID).toEqual('market')
        return null
      }

      render(
        <MarketStoreProvider>
          <TestComponent />
        </MarketStoreProvider>,
      )
    })

    test(`should initialise with txType property set to ${TxType.BUY}`, () => {
      const expectedValue = TxType.BUY
      const TestComponent = () => {
        const { state: { txType } } = useContext(MarketStore)

        expect(txType).toEqual(expectedValue)
        return null
      }
      render(
        <MarketStoreProvider>
          <TestComponent />
        </MarketStoreProvider>,
      )
    })

    test('should initialise with exchangeRates property', () => {
      const TestComponent = () => {
        const { state: { exchangeRates } } = useContext(MarketStore)

        expect(exchangeRates).not.toBeUndefined()
        return null
      }
      render(
        <MarketStoreProvider>
          <TestComponent />
        </MarketStoreProvider>,
      )
    })

    describe('exchangeRates', () => {
      test('should initialise with currentFiat property containing { symbol: \'usd\', displayName: \'USD\' }', () => {
        const TestComponent = () => {
          const { state: { exchangeRates: { currentFiat } } } = useContext(MarketStore)
          const expectedCurrentFiat = {
            symbol: 'usd',
            displayName: 'USD',
          }

          expect(currentFiat).not.toBeUndefined()
          expect(currentFiat).toEqual(expectedCurrentFiat)
          return null
        }
        render(
          <MarketStoreProvider>
            <TestComponent />
          </MarketStoreProvider>,
        )
      })

      test('should initialise with crypto property set to { rif: { displayName: "RIF", rate: -1 } }', () => {
        const TestComponent = () => {
          const { state: { exchangeRates: { crypto } } } = useContext(MarketStore)
          const expectedCrypto = {
            rif: {
              displayName: 'RIF',
              rate: -1,
            },
          }

          expect(crypto).not.toBeUndefined()
          expect(crypto).toEqual(expectedCrypto)
          return null
        }
        render(
          <MarketStoreProvider>
            <TestComponent />
          </MarketStoreProvider>,
        )
      })
    })
  })
})
