import { IconButton } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainNameItem from 'components/molecules/DomainNameItem'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { HeadCell } from 'components/templates/marketplace/Marketplace'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketStore from 'store/Market/MarketStore'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'
import { OrderPayload } from 'store/Market/rns/rnsActions'

const MyOffers: FC<{}> = () => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketStore)

  const {
    state: {
      listing: {
        outdatedTokens,
        items,
      },
      filters,
    },
    dispatch,
  } = useContext(RnsDomainsStore)

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        status: 'placed',
      },
    })
  }, [dispatch])

  const history = useHistory()

  const headers: HeadCell<RnsDomain>[] = [
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'expirationDate',
      label: 'Renewal Date',
    },
    {
      id: 'offer',
      label: 'Price',
    },
    {
      id: 'action1',
      label: '',
    },
    {
      id: 'action2',
      label: '',
    },
  ]

  const collection = items
    .map((domainItem: RnsDomain) => {
      const {
        id,
        name,
        offer,
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
            history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
          }}
        />,
        price: <></>,
        action2: <></>,
      }

      if (offer) {
        const { price, paymentToken } = offer
        const { rate, displayName } = crypto[paymentToken]
        displayItem.price = (
          <CombinedPriceCell
            price={price.toString()}
            priceFiat={price.times(rate).toString()}
            currency={displayName}
            currencyFiat={currentFiat.displayName}
            divider=" = "
          />
        )
        displayItem.action2 = (
          <IconButton
            color="primary"
            id={id}
            onClick={() => {
              dispatch({
                type: 'SET_ORDER',
                payload: {
                  item: domainItem,
                } as OrderPayload,
              })
              history.push(ROUTES.DOMAINS.CHECKOUT.CANCEL)
            }}
          >
            <ClearIcon />
          </IconButton>
        )
      }

      return displayItem
    })

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      items={collection}
      headers={headers}
      requiresAccount
      dispatch={dispatch}
      outdatedCt={outdatedTokens.length}
    />
  )
}

export default MyOffers
