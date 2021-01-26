import { DomainsSaleStatus } from 'api/models/RnsFilter'
import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import React, { FC, useContext } from 'react'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'

type PerStatusComponents = {
  [key in DomainsSaleStatus]: React.ReactNode
}

const SellDomainsListPage: FC<{}> = () => {
  const {
    state: {
      filters: {
        status,
      },
    },
  } = useContext(RnsDomainsContext)

  const componentPerStatus: PerStatusComponents = {
    owned: <MyDomains />,
    placed: <MyOffers />,
    sold: <SoldDomains />,
  }

  return <>{componentPerStatus[status]}</>
}

export default SellDomainsListPage
