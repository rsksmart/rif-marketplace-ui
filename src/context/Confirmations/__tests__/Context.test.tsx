import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'
import { Context, Provider } from '../Context'

const ProviderTest = useProviderTest(
  Provider, Context,
)
describe('Confirmations Context', () => {
  describe('initialState', () => {
    test('should contain contextID: "confirmations"', () => {
      render(<ProviderTest test={({ state: { contextID } }): void => {
        expect(contextID).toEqual('confirmations')
      }}
      />)
    })
    test('should contain an empty confirmations object', () => {
      render(<ProviderTest test={({ state: { confirmations } }): void => {
        expect(confirmations).toEqual({})
      }}
      />)
    })
  })
})
