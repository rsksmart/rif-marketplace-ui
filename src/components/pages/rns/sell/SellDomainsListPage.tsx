import { DomainsSaleStatus } from 'api/models/RnsFilter'
import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import React, { FC, useContext } from 'react'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'

type PerStatusComponents = {
  [key in DomainsSaleStatus]: React.ReactNode
}

const SellDomainsListPage: FC<{}> = () => {
  const {
    state: {
      filters: {
        status: statusFilter,
      },
    },
  } = useContext(RnsDomainsStore)

  const componentPerStatus: PerStatusComponents = {
    owned: <MyDomains />,
    placed: <MyOffers />,
    sold: <SoldDomains />,
  }

  return <>{componentPerStatus[statusFilter]}</>
}

export default SellDomainsListPage
