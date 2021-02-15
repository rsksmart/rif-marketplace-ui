import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'

import {
  StorageOffersContext,
  StorageOffersContextProvider,
} from '..'
import { ContextFilters, ContextLimits, OffersListing } from '../OffersContext'

const ProviderTest = useProviderTest(
  StorageOffersContextProvider, StorageOffersContext,
)

describe('Storage Offers Context', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "storage_offers"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('storage_offers')
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
      test('should contain correct filters property', () => {
        const expectedFilters: ContextFilters = {
          size: {
            min: 0,
            max: 0,
          },
          price: {
            min: 0,
            max: 0,
          },
          periods: new Set(),
          provider: undefined,
        }
        render(<ProviderTest test={({ state: { filters } }): void => {
          expect(filters).toEqual(expectedFilters)
        }}
        />)
      })
      test('should contain correct limits property', () => {
        const expectedLimits: ContextLimits = {
          size: {
            min: 0,
            max: 0,
          },
          price: {
            min: 0,
            max: 0,
          },
        }
        render(<ProviderTest test={({ state: { limits } }): void => {
          expect(limits).toEqual(expectedLimits)
        }}
        />)
      })
    })
  })
})
