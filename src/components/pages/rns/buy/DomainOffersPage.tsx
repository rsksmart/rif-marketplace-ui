import { Web3Store, ShortenTextTooltip } from '@rsksmart/rif-ui'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketContext from 'context/Market/MarketContext'
import RnsOffersContext, { RnsOffersContextProps } from 'context/Services/rns/OffersContext'
import { OrderPayload, RefreshPayload } from 'context/Services/rns/rnsActions'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'

const DomainOffersPage: FC = () => {
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
      listing: {
        items,
        outdatedTokens,
      },
      filters,
    },
    dispatch,
  } = useContext<RnsOffersContextProps>(RnsOffersContext)
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
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  const headers = {
    domainName: 'Name',
    ownerAddress: 'Owner',
    expirationDate: 'Renewal Date',
    combinedPrice: 'Price',
    action1: '',
  }

  const collection = items
    .map<MarketplaceItem>((item: RnsDomainOffer) => {
      const {
        id,
        price,
        domainName,
        paymentToken,
        ownerAddress,
        expirationDate,
        tokenId,
      } = item

      const pseudoResolvedName: string = filters.name as string && (`${filters.name}.rsk`)
      const { rate, displayName } = crypto[paymentToken]

      const displayDomainName = domainName || pseudoResolvedName
        ? <ShortenTextTooltip value={domainName || pseudoResolvedName} maxLength={30} />
        : <AddressItem pretext="Unknown RNS:" value={tokenId} />

      const displayItem = {
        id,
        domainName: displayDomainName,
        ownerAddress: <AddressItem value={ownerAddress} />,
        expirationDate: expirationDate.toLocaleDateString(),
        combinedPrice: <CombinedPriceCell
          price={price.toString()}
          priceFiat={price.times(rate).toString()}
          currency={displayName}
          currencyFiat={currentFiat.displayName}
          divider=" = "
        />,
        action1: (account?.toLowerCase() === ownerAddress.toLowerCase()) ? 'your offer' : (
          <SelectRowButton
            id={id}
            handleSelect={() => {
              dispatch({
                type: 'SET_ORDER',
                payload: {
                  item,
                } as OrderPayload,
              })
              history.push(ROUTES.RNS.BUY.CHECKOUT)
            }}
          />
        ),
      }

      return displayItem
    })

  return (
    <MarketPageTemplate
      className="Domain Offers"
      filterItems={<DomainOfferFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={outdatedTokens.length}
    />
  )
}

export default DomainOffersPage
