import React, { useContext, FC } from 'react'
import { render } from '@testing-library/react'
import RnsSoldStore, { RnsSoldStoreProps, RnsSoldStoreProvider } from '../SoldStore'

const renderTest = (TestComponent: React.ElementType) => render(
  <RnsSoldStoreProvider>
    <TestComponent />
  </RnsSoldStoreProvider>,
)

describe('RnsSoldStoreProvider', () => {
  describe('initial state', () => {
    test('should contain empty array "listing"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { listing } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

        expect(listing).toEqual({
          items: [],
          outdatedTokens: [],
        })
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should contain an empty object "filters"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { filters } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

        expect(filters).toEqual({})
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should not contain object "order"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { order } } = useContext<RnsSoldStoreProps>(RnsSoldStore)

        expect(order).toBeUndefined()
        return <div />
      }

      renderTest(TestComponent)
    })

    test('should contain boolean "needsRefresh" set to false', () => {
      const TestComponent: FC<{}> = () => {
        const { state } = useContext<RnsSoldStoreProps>(RnsSoldStore)

        expect(state).toHaveProperty('needsRefresh')
        const { needsRefresh } = state

        expect(needsRefresh).toBe(false)
        return <div />
      }

      renderTest(TestComponent)
    })
  })
})
