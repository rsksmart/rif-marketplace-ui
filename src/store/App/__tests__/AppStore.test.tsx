import { render } from '@testing-library/react'
import React, { FC, useContext } from 'react'
import { ConfirmationsService } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { XRService } from 'api/rif-marketplace-cache/rates/xr'
import { ServiceMap } from 'api/models/apiService'
import AppStore, { AppStoreProvider } from '../AppStore'

const isServiceMap = (obj: ServiceMap): obj is ServiceMap => {
  if (!obj) return false

  if (!(obj.confirmations instanceof ConfirmationsService)) return false

  if (!(obj['rates/v0'] instanceof XRService)) return false

  if (!(obj['rns/v0/domains'] instanceof DomainsService)) return false

  if (!(obj['rns/v0/offers'] instanceof OffersService)) return false

  if (!(obj['rns/v0/sold'] instanceof SoldDomainsService)) return false

  return true
}

describe('AppStore', () => {
  describe('AppStore.Provider', () => {
    test('initial state should contian property apis of type ServiceMap', () => {
      const MockConsumer: FC<{}> = () => {
        const { state: { apis } } = useContext(AppStore)
        expect(isServiceMap(apis)).toBe(true)
        return <div />
      }

      render(
        <AppStoreProvider>
          <MockConsumer />
        </AppStoreProvider>,
      )
    })
  })
})
