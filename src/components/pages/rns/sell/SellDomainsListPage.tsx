import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import React, { FC, useContext, useEffect } from 'react'
import { DomainsSaleStatus } from 'api/models/RnsFilter'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import { MARKET_ACTIONS } from 'store/Market/marketActions'

type PerStatusComponents = {
  [key in DomainsSaleStatus]: React.ReactNode
}

const SellDomainsListPage: FC<{}> = () => {
  const {
    state: {
      filters: {
        status: statusFilter
      },
    },
  } = useContext(RnsDomainsStore)
  const {
    dispatch: mDispatch
  } = useContext(MarketStore)

  useEffect(() => {
    mDispatch({
      type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
      payload: {
        txType: TxType.SELL
      }
    })
  }, [])

  const componentPerStatus: PerStatusComponents = {
    'owned': <MyDomains />,
    'placed': <MyOffers />,
    'sold': <SoldDomains />,
  }

  return <>{componentPerStatus[statusFilter]}</>
}

export default SellDomainsListPage
