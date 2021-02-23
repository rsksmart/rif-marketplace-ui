import React, { useContext, FC } from 'react'
import { render, RenderResult } from '@testing-library/react'
import RnsSoldContext, { RnsSoldContextProps, RnsSoldContextProvider } from '../SoldContext'

const renderTest = (TestComponent: React.ElementType): RenderResult => render(
  <RnsSoldContextProvider>
    <TestComponent />
  </RnsSoldContextProvider>,
)

describe('RnsSoldContextProvider', () => {
  describe('initial state', () => {
    test('should contain empty array "listing"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { listing } } = useContext<RnsSoldContextProps>(RnsSoldContext)

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
        const { state: { filters } } = useContext<RnsSoldContextProps>(RnsSoldContext)

        expect(filters).toEqual({})
        return <div />
      }

      renderTest(TestComponent)
    })
    test('should not contain object "order"', () => {
      const TestComponent: FC<{}> = () => {
        const { state: { order } } = useContext<RnsSoldContextProps>(RnsSoldContext)

        expect(order).toBeUndefined()
        return <div />
      }

      renderTest(TestComponent)
    })

    test('should contain boolean "needsRefresh" set to false', () => {
      const TestComponent: FC<{}> = () => {
        const { state } = useContext<RnsSoldContextProps>(RnsSoldContext)

        expect(state).toHaveProperty('needsRefresh')
        const { needsRefresh } = state

        expect(needsRefresh).toBe(false)
        return <div />
      }

      renderTest(TestComponent)
    })
  })
})
