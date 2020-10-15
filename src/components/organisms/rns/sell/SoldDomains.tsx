import { AddressItem, CombinedPriceCell } from 'components/molecules'
import DomainNameItem from 'components/molecules/DomainNameItem'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { HeadCell } from 'components/templates/marketplace/Marketplace'
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

  const headers: HeadCell<RnsSoldDomain>[] = [
    {
      id: 'domainName',
      label: 'Name',
    },
    {
      id: 'buyer',
      label: 'Buyer',
    },
    {
      id: 'paymentToken',
      label: 'Currency',
    },
    {
      id: 'price',
      label: 'Selling price',
    },
    {
      id: 'soldDate',
      label: 'Selling date',
    },
  ]

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
      const { rate, displayName } = crypto[paymentToken]

      const pseudoResolvedName = name && `${name}.rsk`
      const displayDomainName = domainName || pseudoResolvedName
        ? <DomainNameItem value={domainName || pseudoResolvedName as string} />
        : <AddressItem pretext="Unknown RNS:" value={tokenId} />

      const displayItem = {
        id,
        domainName: displayDomainName,
        buyer: <AddressItem value={buyer} />,
        currency: displayName,
        sellingPrice: <CombinedPriceCell
          price={price.toString()}
          priceFiat={price.times(rate).toString()}
          currency={displayName}
          currencyFiat={currentFiat.displayName}
          divider=" = "
        />,
        soldDate: soldDate.toLocaleDateString(),
      }

      return displayItem
    })

  return (
    <MarketPageTemplate<RnsSoldDomain>
      filterItems={<DomainFilters />}
      items={collection as any}
      headers={headers}
      requiresAccount
      dispatch={dispatch as React.Dispatch<unknown>} // FIXME: this sould be fixed when fixing the context typing
      outdatedCt={outdatedTokens.length}
    />
  )
}

export default SoldDomains
