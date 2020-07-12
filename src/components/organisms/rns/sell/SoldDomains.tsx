import { AddressItem, CombinedPriceCell } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import MarketStore from 'store/Market/MarketStore'
import RnsSoldStore, { RnsSoldStoreProps } from 'store/Market/rns/SoldStore'

const SoldDomains: FC<{}> = () => {
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
      listing,
      filters,
    },
    dispatch,
  } = useContext<RnsSoldStoreProps>(RnsSoldStore)

  const { items, outdatedTokens } = listing
  const { name } = filters

  const headers = {
    domainName: 'Name',
    buyer: 'Buyer',
    currency: 'Currency',
    sellingPrice: 'Selling price',
    soldDate: 'Selling date',
  }

  const collection = items
    .map((domainItem: RnsSoldDomain) => {
      const {
        id,
        domainName,
        buyer,
        paymentToken,
        price,
        soldDate,
        tokenId,
      } = domainItem
      const currency = crypto[paymentToken]

      const pseudoResolvedName = !!name && `${name}.rsk`
      const displayItem = {
        id,
        domainName: domainName || pseudoResolvedName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
        buyer: <AddressItem value={buyer} />,
        currency: currency.displayName,
        sellingPrice: <CombinedPriceCell
          price={price.toString()}
          priceFiat={(currency.rate * price).toString()}
          currency={currency.displayName}
          currencyFiat={currentFiat.displayName}
          divider=" = "
        />,
        soldDate: soldDate.toLocaleDateString(),
      }

      return displayItem
    })

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      itemCollection={collection as any}
      headers={headers}
      requiresAccount
      dispatch={dispatch}
      outdatedCt={outdatedTokens.length}
    />
  )
}

export default SoldDomains
