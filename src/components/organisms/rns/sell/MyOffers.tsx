import { Web3Store } from '@rsksmart/rif-ui'
import ClearIcon from '@material-ui/icons/Clear'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'
import { AddressItem, SelectRowButton, CombinedPriceCell } from 'components/molecules'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import ROUTES from 'routes'
import { IconButton } from '@material-ui/core'
import { RnsDomain } from 'models/marketItems/DomainItem'

const MyOffers: FC<{}> = () => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    }
  } = useContext(MarketStore)

  const {
    state: {
      listing: {
        outdatedTokens,
        items
      },
      filters
    },
    dispatch,
  } = useContext(RnsDomainsStore)

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        status: 'placed'
      }
    })
  }, [])

  const history = useHistory()

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    price: 'Listed Price',
    action1: '',
    action2: '',
  }

  // if (!currentListing || listingType !== LISTING_TYPE) return null

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

      if (offer) {
        const { price, paymentToken } = offer
        const currency = crypto[paymentToken]
        displayItem.price = (
          <CombinedPriceCell
            price={price.toString()}
            priceFiat={(currency.rate * price).toString()}
            currency={currency.displayName}
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
                } as any,
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
      itemCollection={collection}
      headers={headers}
      accountRequired
      dispatch={dispatch}
      outdatedCt={outdatedTokens.length}
    />
  )
}

export default MyOffers
