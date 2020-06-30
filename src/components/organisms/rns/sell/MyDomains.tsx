import { AddressItem, SelectRowButton } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { Domain } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'

const MyDomains: FC<{}> = () => {
  const {
    state: {
      listing,
      filters: filters
    },
    dispatch,
  } = useContext(RnsDomainsStore)
  const history = useHistory()

  const { items } = listing

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    action1: '',
  }

  const collection = items
    .map((domainItem: Domain) => {
      const {
        id,
        name,
        expirationDate,
        tokenId,
      } = domainItem

      const pseudoResolvedName = filters?.name?.$like && (`${filters?.name?.$like}.rsk`)
      const displayItem = {
        id,
        name: name || pseudoResolvedName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
        expirationDate: expirationDate.toLocaleDateString(),
        action1: <SelectRowButton
          id={id}
          handleSelect={() => {
            dispatch({
              type: 'SET_ORDER',
              payload: {
                item: domainItem,
              } as any,
            })
            history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
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
      accountRequired
      dispatch={dispatch}
      outdatedCt={listing.outdatedTokens.length}
    />
  )
}

export default MyDomains
