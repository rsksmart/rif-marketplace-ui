import { Web3Store } from '@rsksmart/rif-ui'
import { createService } from 'api/rif-marketplace-cache/cacheController'
import { fetchDomainOffers, RnsServicePaths } from 'api/rif-marketplace-cache/domainsController'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketListingTypes } from 'models/Market'
import { DomainOffer } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'

const LISTING_TYPE = MarketListingTypes.DOMAIN_OFFERS

const DomainOffersPage: FC = () => {
  const {
    state: {
      currentListing,
      filters: {
        domainOffers: offerFilters,
      },
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const history = useHistory()
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  const servicePath = currentListing?.servicePath
  let collection = []

  // component will unmount - clean up
  useEffect(() => () => {
    dispatch({ type: MARKET_ACTIONS.CLEAN_UP, payload: { currentListing: true } })
  }, [dispatch])

  // connect service
  useEffect(() => {
    if (servicePath !== RnsServicePaths.BUY) {
      const serviceAddr = createService(RnsServicePaths.BUY, dispatch)
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: LISTING_TYPE,
          txType: TxType.BUY,
        },
      })
    }
  }, [dispatch, servicePath])

  // fetchDomainOffers and dispatch set items
  useEffect(() => {
    if (servicePath && servicePath === RnsServicePaths.BUY) {
      fetchDomainOffers(offerFilters)
        .then((items) => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            items,
          },
        }))
    }
  }, [offerFilters, dispatch, servicePath])

  // if wrong type, ignore this render
  if (!currentListing || currentListing?.listingType !== LISTING_TYPE) return null

  const headers = {
    domainName: 'Name',
    ownerAddress: 'Owner',
    expirationDate: 'Renewal Date',
    combinedPrice: 'Price',
    action1: '',
  }

  collection = currentListing?.items
    .map((domainItem: DomainOffer) => {
      const {
        id,
        price,
        domainName,
        paymentToken,
        ownerAddress,
        expirationDate,
        tokenId,
      } = domainItem

      const pseudoResolvedName = offerFilters?.domain?.name?.$like && (`${offerFilters?.domain?.name?.$like}.rsk`)
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
                type: MARKET_ACTIONS.SELECT_ITEM,
                payload: {
                  listingType: LISTING_TYPE,
                  item: domainItem,
                  txType: TxType.BUY,
                },
              })
              history.push(ROUTES.DOMAINS.CHECKOUT.BUY)
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
      itemCollection={collection}
      headers={headers}
    />
  )
}

export default DomainOffersPage
