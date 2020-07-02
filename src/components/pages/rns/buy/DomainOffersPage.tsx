import { Web3Store } from '@rsksmart/rif-ui'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { DomainOffer } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketStore from 'store/Market/MarketStore'
import RnsOffersStore, { RnsOffersStoreProps } from 'store/Market/rns/OffersStore'


const DomainOffersPage: FC = () => {
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
        items,
        outdatedTokens
      },
      filters
    },
    dispatch
  } = useContext<RnsOffersStoreProps>(RnsOffersStore)
  const history = useHistory()
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  let collection = []

  const headers = {
    domainName: 'Name',
    ownerAddress: 'Owner',
    expirationDate: 'Renewal Date',
    combinedPrice: 'Price',
    action1: '',
  }

  collection = items
    .map((item: DomainOffer) => {
      const {
        id,
        price,
        domainName,
        paymentToken,
        ownerAddress,
        expirationDate,
        tokenId,
      } = item

      const pseudoResolvedName = filters.name && (`${filters.name}.rsk`)
      const currency = crypto[paymentToken]
      const displayItem = {
        id,
        domainName: domainName || pseudoResolvedName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
        ownerAddress: <AddressItem value={ownerAddress} />,
        expirationDate: expirationDate.toLocaleDateString(),
        combinedPrice: <CombinedPriceCell
          price={price.toString()}
          priceFiat={(currency.rate * price).toString()}
          currency={currency.displayName}
          currencyFiat={currentFiat.displayName}
          divider=" = "
        />,
        action1: (account?.toLowerCase() === ownerAddress.toLowerCase()) ? 'your offer' : (
          <SelectRowButton
            id={id}
            handleSelect={() => {
              dispatch({
                type: "SET_ORDER",
                payload: {
                  item
                } as any,
              })
              history.push(ROUTES.DOMAINS.CHECKOUT.BUY)
            }}
          />
        ),
      }

      return displayItem
    }) as any //TODO: remove as any

  return (
    <MarketPageTemplate
      className="Domain Offers"
      filterItems={<DomainOfferFilters />}
      itemCollection={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={outdatedTokens.length}
    />
  )
}

export default DomainOffersPage
