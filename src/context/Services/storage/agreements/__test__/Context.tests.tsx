import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'

import AgreementsContext, {
  AgreementsContextProvider,
} from '..'

const ProviderTest = useProviderTest(
  AgreementsContextProvider, AgreementsContext,
)

describe('AgreementsContext', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "storage_agreements"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('storage_agreements')
        }}
        />)
      })
      test('should contain empty agreements array', () => {
        render(<ProviderTest test={({ state: { agreemnents } }): void => {
          expect(agreemnents).toEqual([])
        }}
        />)
      })
    })
  })
})
