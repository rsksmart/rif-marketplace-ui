import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import React, { FC, useContext, useEffect } from 'react'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import { DomainsSaleStatus } from 'api/models/RnsFilter'

type PerStatusComponents = {
  [key in DomainsSaleStatus]: React.ReactNode
}

const SellDomainsListPage: FC<{}> = () => {
  const {
    state: {
      filters: {
        domains: { status: statusFilter },
      },
    }, dispatch,
  } = useContext(MarketStore)

  const componentPerStatus: PerStatusComponents = {
    'owned': <MyDomains />,
    'placed': <MyOffers />,
    'sold': <SoldDomains />,
  }
  useEffect(() => () => {
    dispatch({ type: MARKET_ACTIONS.CLEAN_UP, payload: { currentListing: true } })
  }, [dispatch])

  return <>{componentPerStatus[statusFilter]}</>
}

export default SellDomainsListPage
