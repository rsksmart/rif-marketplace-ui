import { render } from '@testing-library/react'
import React, { FC, useContext } from 'react'
import { ConfirmationsService } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { XRService } from 'api/rif-marketplace-cache/rates/xr'
import { ServiceMap } from 'api/models/apiService'
import { ServiceAddress } from 'api/models/serviceAddresses'
import AppStore, { AppStoreProvider } from '../AppStore'

const svcAddrss: Record<string, ServiceAddress> = {
  rates: 'rates/v0',
  confirmations: 'confirmations',
  rnsDomains: 'rns/v0/domains',
  rnsOffers: 'rns/v0/offers',
  rnsSold: 'rns/v0/sold',
}

const isServiceMap = (obj: ServiceMap): obj is ServiceMap => {
  if (!obj) return false
  const {
    rates, confirmations, rnsDomains, rnsOffers, rnsSold,
  } = svcAddrss

  if (!(obj[confirmations] instanceof ConfirmationsService)) return false

  if (!(obj[rates] instanceof XRService)) return false

  if (!(obj[rnsDomains] instanceof DomainsService)) return false

  if (!(obj[rnsOffers] instanceof OffersService)) return false

  if (!(obj[rnsSold] instanceof SoldDomainsService)) return false

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
