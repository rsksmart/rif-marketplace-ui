import React, { useContext, FC } from 'react'
import { render, RenderResult } from '@testing-library/react'
import RnsDomainsContext, { RnsDomainsContextProvider, RnsDomainsContextProps, initialState } from '../DomainsContext'

const renderTest = (TestComponent: React.ElementType): RenderResult => render(
  <RnsDomainsContextProvider>
    <TestComponent />
  </RnsDomainsContextProvider>,
)

describe('RnsDomainsContextProvider', () => {
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
        const { state: { listing } } = useContext<RnsDomainsContextProps>(RnsDomainsContext)

        expect(listing).toEqual(initialState.listing)
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should contain "filters" unchanged from the initial state', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { filters } } = useContext<RnsDomainsContextProps>(RnsDomainsContext)

        expect(filters).toEqual(initialState.filters)
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should not contain "order"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { order } } = useContext<RnsDomainsContextProps>(RnsDomainsContext)

        expect(order).toBeUndefined()
        return <div />
      }

      renderTest(TestComponent)
    })

    test('should contain "needsRefresh" set to true', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { needsRefresh } } = useContext<RnsDomainsContextProps>(RnsDomainsContext)

        return <input data-testid="test-input" readOnly value={`${needsRefresh}`} />
      }

      const { getByTestId } = renderTest(TestComponent)
      const { value: actualValue } = getByTestId('test-input') as HTMLInputElement
      expect(actualValue).toEqual('true')
    })
  })
})
