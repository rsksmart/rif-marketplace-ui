import { render, cleanup } from '@testing-library/react'

import React, { FC, useContext } from 'react'
import MarketContext, {
  MarketContextProps, MarketContextProvider,
} from 'context/Market'
import { AppContextProvider } from 'context/App'

const expectedInitialCrypto = {}

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
        <AppContextProvider>
          <MarketContextProvider>
            <TestComponent />
          </MarketContextProvider>
        </AppContextProvider>,
      )
    })

    test('should initialise with exchangeRates property', () => {
      const TestComponent = (): null => {
        const { state: { exchangeRates } } = useContext(MarketContext)

        expect(exchangeRates).not.toBeUndefined()
        return null
      }
      render(
        <AppContextProvider>
          <MarketContextProvider>
            <TestComponent />
          </MarketContextProvider>
        </AppContextProvider>,
      )
    })

    describe('exchangeRates', () => {
      test('should initialise with currentFiat property containing { symbol: \'usd\', displayName: \'USD\' }', () => {
        const TestComponent = (): null => {
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
          <AppContextProvider>
            <MarketContextProvider>
              <TestComponent />
            </MarketContextProvider>
          </AppContextProvider>,
        )
      })

      test(`should initialise with crypto property set to ${JSON.stringify(expectedInitialCrypto)}`, () => {
        const TestComponent: FC<{}> = () => {
          const {
            state: { exchangeRates: { crypto } },
          } = useContext<MarketContextProps>(MarketContext)

          expect(crypto).not.toBeUndefined()
          expect(crypto).toEqual(expectedInitialCrypto)
          return <div />
        }

        render(
          <AppContextProvider>
            <MarketContextProvider>
              <TestComponent />
            </MarketContextProvider>
          </AppContextProvider>,
        )
      })
    })
  })
})
