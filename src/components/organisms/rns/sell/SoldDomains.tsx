import { AddressItem, CombinedPriceCell } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsSoldDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import MarketContext from 'context/Market'
import RnsSoldContext, { RnsSoldContextProps } from 'context/Services/rns/SoldContext'
import { ShortenTextTooltip } from '@rsksmart/rif-ui'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'

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
    .map<MarketplaceItem>((domainItem: RnsSoldDomain) => {
      const {
        id,
        domainName,
        buyer,
        paymentToken,
        price,
        soldDate,
        tokenId,
      } = domainItem
      const { rate, displayName } = crypto[paymentToken.symbol]

      const pseudoResolvedName = name && `${name}.rsk`
      const displayDomainName = domainName || pseudoResolvedName
        ? <ShortenTextTooltip value={domainName || pseudoResolvedName as string} maxLength={30} />
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
        />,
        soldDate: soldDate.toLocaleDateString(),
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

export default SoldDomains
