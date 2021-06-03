import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'
import { StakingContextProvider, StakingContext } from '..'

const ProviderTest = useProviderTest(
  StakingContextProvider, StakingContext,
)

describe('Staking Context', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "staking"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('staking')
        }}
        />)
      })

      test('should contain needsRefresh: true', () => {
        render(<ProviderTest test={({ state: { needsRefresh } }): void => {
          expect(needsRefresh).toEqual(true)
        }}
        />)
      })

      test('should contain totalStakedUSD: ""', () => {
        render(<ProviderTest test={({ state: { totalStakedUSD } }): void => {
          expect(totalStakedUSD).toEqual('')
        }}
        />)
      })

      test(`should contain stakes: {
                rbtc: '0',
                rif: '0',
              }`, () => {
        render(<ProviderTest test={({ state: { stakes } }): void => {
          expect(stakes).toEqual({
            rbtc: '0',
            rif: '0',
          })
        }}
        />)
      })
    })
  })
})
