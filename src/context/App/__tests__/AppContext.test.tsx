import { render } from '@testing-library/react'
import { ServiceAddress } from 'api/models/serviceAddresses'
import { confirmationAddress } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { serviceAddress as notificationsAddress } from 'api/rif-marketplace-cache/notifications'
import { xrServiceAddress } from 'api/rif-marketplace-cache/rates/xr'
import React, { FC, useContext } from 'react'
import { storageAddresses } from 'api/rif-marketplace-cache/storage/interfaces'
import { serviceAddress } from 'api/rif-storage-upload-service/upload/interfaces'
import AppContext, { AppContextProvider } from '../AppContext'
import { rnsAddresses } from '../../../api/rif-marketplace-cache/rns/common'

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
  describe('AppContext.Provider', () => {
    describe('AppState', () => {
      test('initial state should contian an object apis', () => {
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
          serviceAddress,
        ].forEach(testServiceExistence)
      })
    })
  })
})
