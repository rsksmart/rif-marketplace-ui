import React, { useContext, FC } from 'react'
import { render } from '@testing-library/react'
import RnsOffersContext, { RnsOffersContextProps, RnsOffersContextProvider } from '../OffersContext'

const renderTest = (
  TestComponent: React.ElementType,
): ReturnType<typeof render> => render(
  <RnsOffersContextProvider>
    <TestComponent />
  </RnsOffersContextProvider>,
)

describe('RnsOffersContextProvider', () => {
  describe('initial state', () => {
    test('should contain empty array "listing"', () => {
      const TestComponent: FC<{}> = () => {
        const expectedListing = {
          items: [],
          outdatedTokens: [],
        }
        const { state: { listing } } = useContext<RnsOffersContextProps>(RnsOffersContext)

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
        const { state: { filters } } = useContext<RnsOffersContextProps>(RnsOffersContext)

        expect(filters).toEqual(expectedFilters)
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should not contain object "order"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { order } } = useContext<RnsOffersContextProps>(RnsOffersContext)

        expect(order).toBeUndefined()
        return <div />
      }

      renderTest(TestComponent)
    })

    test.skip('should contain boolean "needsRefresh" set to false', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { needsRefresh } } = useContext<RnsOffersContextProps>(RnsOffersContext)

        expect(needsRefresh).toBe(false)
        return <div />
      }

      renderTest(TestComponent)
    })
  })
})
