import React from 'react'
import Big from 'big.js'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'
import OfferEditContext, { OfferEditContextProvider } from '..'

const ProviderTest = useProviderTest(
  OfferEditContextProvider, OfferEditContext,
)

describe('Storage Edit Page Context', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "storage_offer_edit"', () => {
        render(
          <ProviderTest test={({ state: { contextID } }): void => {
            expect(contextID).toEqual('storage_offer_edit')
          }}
          />, { wrapper: MemoryRouter }, // as advised by https://testing-library.com/docs/example-react-router/#reducing-boilerplate
        )
      })

      test('should contain system: "IPFS"', () => {
        render(
          <ProviderTest test={({ state: { system } }): void => {
            expect(system).toEqual('IPFS')
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain totalCapacity: Big(1)', () => {
        render(
          <ProviderTest test={({ state: { totalCapacity } }): void => {
            expect(totalCapacity).toEqual(Big(1))
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain country: ""', () => {
        render(
          <ProviderTest test={({ state: { country } }): void => {
            expect(country).toEqual('')
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain internalCounter: 1', () => {
        render(
          <ProviderTest test={({ state: { internalCounter } }): void => {
            expect(internalCounter).toEqual(1)
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain peerId: ""', () => {
        render(
          <ProviderTest test={({ state: { peerId } }): void => {
            expect(peerId).toEqual('')
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain usedPeriodsPerCurrency: {}', () => {
        render(
          <ProviderTest test={({ state: { usedPeriodsPerCurrency } }): void => {
            expect(usedPeriodsPerCurrency).toEqual({})
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain billingPlans: []', () => {
        render(
          <ProviderTest test={({ state: { billingPlans } }): void => {
            expect(billingPlans).toEqual([])
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should contain allBillingPeriods: [\'Daily\', \'Weekly\', \'Monthly\']', () => {
        render(
          <ProviderTest test={({ state: { allBillingPeriods } }): void => {
            expect(allBillingPeriods).toEqual(['Daily', 'Weekly', 'Monthly'])
          }}
          />, { wrapper: MemoryRouter },
        )
      })

      test('should not contain originalOffer', () => {
        render(
          <ProviderTest test={({ state: { originalOffer } }): void => {
            expect(originalOffer).toBeFalsy()
          }}
          />, { wrapper: MemoryRouter },
        )
      })
    })
  })
})
