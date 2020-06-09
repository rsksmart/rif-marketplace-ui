import MyDomains from 'components/organisms/rns/sell/MyDomains'
import MyOffers from 'components/organisms/rns/sell/MyOffers'
import SoldDomains from 'components/organisms/rns/sell/SoldDomains'
import { SellDomainStatus } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import MarketStore from 'store/Market/MarketStore'
import { MARKET_ACTIONS } from 'store/Market/marketActions'

const SellDomainsListPage: FC<{}> = () => {
  const {
    state: {
      filters: {
        domains: { status: statusFilter },
      },
    }, dispatch,
  } = useContext(MarketStore)

  const componentPerStatus = {
    [SellDomainStatus.OWNED]: <MyDomains />,
    [SellDomainStatus.PLACED]: <MyOffers />,
    [SellDomainStatus.SOLD]: <SoldDomains />,
  }
  useEffect(() => () => {
    dispatch({ type: MARKET_ACTIONS.CLEAN_UP, payload: { currentListing: true } })
  }, [dispatch])

  return <>{componentPerStatus[statusFilter]}</>
}

export default SellDomainsListPage
