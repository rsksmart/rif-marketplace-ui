import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'
import { Context, Provider } from '../Context'

const ProviderTest = useProviderTest(
  Provider, Context,
)
describe('Notifications Context', () => {
  describe('initialState', () => {
    test('should contain contextID: "notification"', () => {
      render(<ProviderTest test={({ state: { contextID } }): void => {
        expect(contextID).toEqual('notification')
      }}
      />)
    })
    test('should contain an empty notifications array', () => {
      render(<ProviderTest test={({ state: { notifications } }): void => {
        expect(notifications).toEqual([])
      }}
      />)
    })
  })
})
