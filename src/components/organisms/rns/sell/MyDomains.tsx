import { AddressItem, SelectRowButton } from 'components/molecules'
import DomainNameItem from 'components/molecules/DomainNameItem'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import RnsDomainsStore from 'store/Services/rns/DomainsStore'
import { OrderPayload, RefreshPayload } from 'store/Services/rns/rnsActions'

const MyDomains: FC<{}> = () => {
  const {
    state: {
      listing,
      filters,
    },
    dispatch,
  } = useContext(RnsDomainsStore)
  const history = useHistory()
  const routeState = history.location.state as { refresh?: boolean }

  if (routeState && routeState.refresh) {
    routeState.refresh = false
    dispatch({
      type: 'REFRESH',
      payload: {
        refresh: true,
      } as RefreshPayload,
    })
  }

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        status: 'owned',
      },
    })
  }, [dispatch])

  const { items } = listing

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    action1: '',
  }

  const collection = items
    .map((domainItem: RnsDomain) => {
      const {
        id,
        name,
        expirationDate,
        tokenId,
      } = domainItem

      const pseudoResolvedName = filters.name && (`${filters.name}.rsk`)
      const displayDomainName = name || pseudoResolvedName
        ? <DomainNameItem value={name || pseudoResolvedName} />
        : <AddressItem pretext="Unknown RNS:" value={tokenId} />

      const displayItem = {
        id,
        name: displayDomainName,
        expirationDate: expirationDate.toLocaleDateString(),
        action1: <SelectRowButton
          id={id}
          handleSelect={() => {
            dispatch({
              type: 'SET_ORDER',
              payload: {
                item: domainItem,
              } as OrderPayload,
            })
            history.push(ROUTES.DOMAINS.SELL.CHECKOUT)
          }}
        />,
        price: <></>,
        action2: <></>,
      }
      return displayItem
    })

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      itemCollection={collection}
      headers={headers}
      requiresAccount
      dispatch={dispatch}
      outdatedCt={listing.outdatedTokens.length}
    />
  )
}

export default MyDomains
