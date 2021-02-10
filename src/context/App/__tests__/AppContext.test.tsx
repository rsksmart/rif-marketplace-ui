import { render } from '@testing-library/react'
import { ServiceAddress } from 'api/models/serviceAddresses'
import { confirmationAddress } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { serviceAddress as notificationsAddress } from 'api/rif-marketplace-cache/notifications'
import { xrServiceAddress } from 'api/rif-marketplace-cache/rates/xr'
import React, { FC, useContext } from 'react'
import { storageAddresses } from 'api/rif-marketplace-cache/storage/interfaces'
import { serviceAddress as uploadServiceAddr } from 'api/rif-storage-upload-service/upload/interfaces'
import { rnsAddresses } from 'api/rif-marketplace-cache/rns/common'
import AppContext, { AppContextProvider } from '../AppContext'

const ProviderTest: FC<{test: Function}> = ({ test }) => {
  const MockConsumer: FC = () => {
    test(useContext(AppContext))

    return <div />
  }

  return (
    <AppContextProvider>
      <MockConsumer />
    </AppContextProvider>
  )
}

const testServiceExistence = (service: ServiceAddress): void => {
  test(`should contain ${service} service`, () => {
    const testFn = ({ state: { apis } }): void => {
      expect(apis[service]).toBeTruthy()
    }

    render(<ProviderTest test={testFn} />)
  })
}

describe('AppContext', () => {
  describe('Provider', () => {
    describe('initial state', () => {
      test('should contain contextID: "app"', () => {
        render(<ProviderTest test={({ state: { contextID } }): void => {
          expect(contextID).toEqual('app')
        }}
        />)
      })
      test('should contian an object apis', () => {
        const testFn = ({ state: { apis } }): void => {
          expect(apis).toBeTruthy()
        }

        render(<ProviderTest test={testFn} />)
      })

      describe('apis', () => {
        [
          notificationsAddress,
          xrServiceAddress,
          confirmationAddress,
          ...rnsAddresses,
          ...storageAddresses,
          uploadServiceAddr,
        ].forEach(testServiceExistence)
      })
      test('should contain messages: {}', () => {
        render(<ProviderTest test={({ state: { messages } }): void => {
          expect(messages).toEqual({})
        }}
        />)
      })

      test('should contain loaders', () => {
        render(<ProviderTest test={({ state: { loaders } }): void => {
          expect(loaders).toBeTruthy()
        }}
        />)
      })
      describe('loaders', () => {
        test(`should contain {
              contract: false,
              data: false,
              filters: false,
              other: false,
            }`, () => {
          render(<ProviderTest test={({ state: { loaders } }): void => {
            expect(loaders).toBeTruthy()
          }}
          />)
        })
      })

      test('should contain alertPanel', () => {
        render(<ProviderTest test={({ state: { alertPanel } }): void => {
          expect(alertPanel).toEqual({
            display: false,
            message: '',
          })
        }}
        />)
      })

      describe('alertPanel', () => {
        test(`should contain {
            display: false,
            message: '',
          }`, () => {
          render(<ProviderTest test={({ state: { alertPanel } }): void => {
            expect(alertPanel).toEqual({
              display: false,
              message: '',
            })
          }}
          />)
        })
      })
    })
  })
})
