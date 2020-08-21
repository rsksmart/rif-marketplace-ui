import { AddressItem, CombinedPriceCell } from 'components/molecules'
import DomainNameItem from 'components/molecules/DomainNameItem'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import MarketContext from 'context/Market/MarketContext'
import RnsSoldContext, { RnsSoldContextProps } from 'context/Services/rns/SoldContext'

const SoldDomains: FC<{}> = () => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)
  const {
    state: {
      listing,
      filters,
    },
    dispatch,
  } = useContext<RnsSoldContextProps>(RnsSoldContext)

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
