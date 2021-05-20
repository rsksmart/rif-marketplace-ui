import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'
import { NotifierOffersContextProvider, NotifierOffersContext } from '..'
import { OffersListing } from '../interfaces'

const ProviderTest = useProviderTest(
  NotifierOffersContextProvider, NotifierOffersContext,
)

describe('Notifier Offers Context', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "notifier_offers"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('notifier_offers')
        }}
        />)
      })
      test('should contain correct listing property', () => {
        const expectedListing: OffersListing = { items: [] }
        render(<ProviderTest test={({ state: { listing } }): void => {
          expect(listing).toEqual(expectedListing)
        }}
        />)
      })
      test('should not contain order property', () => {
        render(<ProviderTest test={({ state: { order } }): void => {
          expect(order).toBeUndefined()
        }}
        />)
      })
    })
  })
})
