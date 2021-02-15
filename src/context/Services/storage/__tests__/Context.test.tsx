import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'

import StorageContextProvider, {
  StorageGlobalContext,
} from '..'

const ProviderTest = useProviderTest(
  StorageContextProvider, StorageGlobalContext,
)

describe('Storage Global Context', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "storage_global"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('storage_global')
        }}
        />)
      })
    })
  })
})
