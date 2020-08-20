import React, { useContext, FC } from 'react'
import { render } from '@testing-library/react'
import RnsOffersStore, { RnsOffersStoreProps, RnsOffersStoreProvider } from '../OffersStore'

const renderTest = (TestComponent: React.ElementType) => render(
  <RnsOffersStoreProvider>
    <TestComponent />
  </RnsOffersStoreProvider>,
)

describe('RnsOffersStoreProvider', () => {
  describe('initial state', () => {
    test('should contain empty array "listing"', () => {
      const TestComponent: FC<{}> = () => {
        const expectedListing = {
          items: [],
          outdatedTokens: [],
        }
        const { state: { listing } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

        expect(listing).toEqual(expectedListing)
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should contain an empty object "filters"', () => {
      const TestComponent: FC<{}> = () => {
        const expectedFilters = {
          price: {
            min: 0,
            max: 0,
          },
        }
        const { state: { filters } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

        expect(filters).toEqual(expectedFilters)
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should not contain object "order"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { order } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

        expect(order).toBeUndefined()
        return <div />
      }

      renderTest(TestComponent)
    })

    test('should contain boolean "needsRefresh" set to false', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { needsRefresh } } = useContext<RnsOffersStoreProps>(RnsOffersStore)

        expect(needsRefresh).toBe(false)
        return <div />
      }

      renderTest(TestComponent)
    })
  })
})
