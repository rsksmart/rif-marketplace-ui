import { Web3Store } from '@rsksmart/rif-ui'
import { createService } from 'api/rif-marketplace-cache/cacheController'
import { fetchSoldDomains, RnsServicePaths } from 'api/rif-marketplace-cache/domainsController'
import { AddressItem, CombinedPriceCell } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketListingTypes } from 'models/Market'
import { SoldDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'

const LISTING_TYPE = MarketListingTypes.DOMAINS
const TX_TYPE = TxType.SELL

const SoldDomains: FC<{}> = () => {
  const {
    state: {
      currentListing,
      exchangeRates: {
        currentFiat,
        crypto,
      },
      filters: {
        domains: domainFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const {
    state: { account },
  } = useContext(Web3Store)

  const servicePath = currentListing?.servicePath
  const listingType = currentListing?.listingType
  const items = currentListing?.items
  const { ownerAddress } = domainFilters

  // connect service
  useEffect(() => {
    if (account && servicePath !== RnsServicePaths.SOLD) {
      const serviceAddr = createService(RnsServicePaths.SOLD, dispatch)
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: LISTING_TYPE,
          txType: TX_TYPE,
        },
      })
    }
  }, [account, dispatch, servicePath])

  // fetchSoldDomains and dispatch set items
  useEffect(() => {
    if (ownerAddress && servicePath === RnsServicePaths.SOLD) {
      fetchSoldDomains(domainFilters)
        .then((receivedItems) => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            items: receivedItems,
          },
        }))
    }
  }, [account, dispatch, domainFilters, ownerAddress, servicePath])

  useEffect(() => {
    if (account) {
      dispatch({
        type: MARKET_ACTIONS.SET_FILTER,
        payload: {
          filterItems: {
            ownerAddress: account,
          },
        },
      })
    }
  }, [account, dispatch])

  if (!currentListing || listingType !== LISTING_TYPE) return null

  const collection = items
    .map((domainItem: SoldDomain) => {
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

      const pseudoResolvedName = domainFilters?.name?.$like && `${domainFilters?.name?.$like}.rsk`
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

  const headers = {
    domainName: 'Name',
    buyer: 'Buyer',
    currency: 'Currency',
    sellingPrice: 'Selling price',
    soldDate: 'Selling date',
  }

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      itemCollection={collection}
      headers={headers}
      accountRequired
    />
  )
}

export default SoldDomains
