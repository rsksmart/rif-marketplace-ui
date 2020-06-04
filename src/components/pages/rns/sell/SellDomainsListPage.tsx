import React, { FC, useContext } from 'react'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketStore from 'store/Market/MarketStore'
import MyDomains from 'components/organisms/rns/sell/MyDomains'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import { SellDomainStatus } from 'models/marketItems/DomainItem'

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

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      resultsContent={componentPerStatus[statusFilter]}
      accountRequired
    />
  )
}

export default SellDomainsListPage
