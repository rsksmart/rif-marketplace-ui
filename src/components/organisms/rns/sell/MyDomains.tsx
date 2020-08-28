import { AddressItem, SelectRowButton } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'
import { OrderPayload, RefreshPayload } from 'context/Services/rns/rnsActions'
import { ShortenTextTooltip } from '@rsksmart/rif-ui'

const MyDomains: FC<{}> = () => {
  const {
    state: {
      listing,
      filters,
    },
    dispatch,
  } = useContext(RnsDomainsContext)
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
        ? <ShortenTextTooltip value={name || pseudoResolvedName} maxLength={30} />
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
            history.push(ROUTES.RNS.SELL.CHECKOUT)
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
