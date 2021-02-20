import React from 'react'
import { render } from '@testing-library/react'
import { useProviderTest } from '__tests__/testUtils'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import Big from 'big.js'
import { StorageUploadContext, StorageUploadContextProvider } from '..'

const ProviderTest = useProviderTest(
  StorageUploadContextProvider, StorageUploadContext,
)

describe('Storage Upload Context', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "storage_upload"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('storage_upload')
        }}
        />)
      })
      test('should contain status: {}', () => {
        render(<ProviderTest test={({ state: { status } }): void => {
          expect(status).toEqual({})
        }}
        />)
      })
      test('should contain fileSizeLimit: Big(1)', () => {
        render(<ProviderTest test={({ state: { fileSizeLimit } }): void => {
          expect(fileSizeLimit).toEqual(Big(UNIT_PREFIX_POW2.GIGA))
        }}
        />)
      })
      test(`should contain isLoading: {
                sizeLimit: boolean,
            }`, () => {
        render(<ProviderTest test={({ state: { isLoading } }): void => {
          expect(isLoading).toBeTruthy()
          expect(isLoading).toHaveProperty('sizeLimit')
          expect(typeof isLoading.sizeLimit).toEqual('boolean')
        }}
        />)
      })
    })
  })
})
