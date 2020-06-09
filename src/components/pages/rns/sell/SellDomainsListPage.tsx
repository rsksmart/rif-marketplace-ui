import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import { SellDomainStatus } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import MarketStore from 'store/Market/MarketStore'

const SellDomainsListPage: FC<{}> = () => {
  const {
    state: {
      filters: {
        domains: { status: statusFilter },
      },
    },
  } = useContext(MarketStore)

  const componentPerStatus = {
    [SellDomainStatus.OWNED]: <MyDomains />,
    [SellDomainStatus.PLACED]: <MyOffers />,
    [SellDomainStatus.SOLD]: <SoldDomains />
  }

  return <>{componentPerStatus[statusFilter]}</>
}

export default SellDomainsListPage
