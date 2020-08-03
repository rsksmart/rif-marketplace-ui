import React, { useContext, FC } from 'react'
import { render } from '@testing-library/react'
import RnsDomainsStore, { RnsDomainsStoreProvider, RnsDomainsStoreProps, initialState } from '../DomainsStore'

const renderTest = (TestComponent: React.ElementType) => render(
  <RnsDomainsStoreProvider>
    <TestComponent />
  </RnsDomainsStoreProvider>,
)

describe('RnsDomainsStoreProvider', () => {
  describe('initial state', () => {
    test('should contain object "listing"', () => {
      expect(initialState.listing).toEqual({
        items: [],
        outdatedTokens: [],
      })
    })
    test('should contain object "filters"', () => {
      expect(initialState.filters).toEqual({ status: 'owned' })

    })
    test('should not contain object "order"', () => {
      expect(initialState.order).toBeUndefined()
    })

    test('should contain boolean "needsRefresh" set to false', () => {
      expect(initialState.needsRefresh).toEqual(false)
    })
  })
  describe('state after initialisation', () => {
    test('should contain "listing" unchanged from the initial state', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { listing } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

        expect(listing).toEqual(initialState.listing)
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should contain "filters" unchanged from the initial state', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { filters } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

        expect(filters).toEqual(initialState.filters)
        return <div />
      }

      renderTest(TestComponent)

    })
    test('should not contain "order"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { order } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

        expect(order).toBeUndefined()
        return <div />
      }

      renderTest(TestComponent)
    })

    test('should contain "needsRefresh" set to true', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { needsRefresh } } = useContext<RnsDomainsStoreProps>(RnsDomainsStore)

        return <input data-testid='test-input' readOnly value={`${needsRefresh}`} />
      }

      const { getByTestId } = renderTest(TestComponent)
      const { value: actualValue } = getByTestId('test-input') as HTMLInputElement
      expect(actualValue).toEqual("true")
    })
  })
})
