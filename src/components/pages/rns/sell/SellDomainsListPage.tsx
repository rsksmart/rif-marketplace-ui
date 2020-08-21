import { DomainsSaleStatus } from 'api/models/RnsFilter'
import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import React, { FC, useContext, useEffect } from 'react'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'
import MarketContext, { TxType } from 'context/Market/MarketContext'

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
  } = useContext(RnsDomainsContext)
  const {
    dispatch: mDispatch,
  } = useContext(MarketContext)

  useEffect(() => {
    mDispatch({
      type: 'TOGGLE_TX_TYPE',
      payload: {
        txType: TxType.SELL,
      },
    })
  }, [mDispatch])

  const componentPerStatus: PerStatusComponents = {
    owned: <MyDomains />,
    placed: <MyOffers />,
    sold: <SoldDomains />,
  }

  return <>{componentPerStatus[statusFilter]}</>
}

export default SellDomainsListPage
