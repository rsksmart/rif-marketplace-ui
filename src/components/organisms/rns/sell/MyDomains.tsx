import React, { FC, useEffect, useContext } from 'react'
import { Web3Store } from '@rsksmart/rif-ui'
import Marketplace from 'components/templates/marketplace/Marketplace'
import { MarketListingTypes } from 'models/Market'
import { fetchDomains, RnsServicePaths } from 'api/rif-marketplace-cache/domainsController'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import { Domain } from 'models/marketItems/DomainItem'
import { SelectRowButton, AddressItem } from 'components/molecules'
import ROUTES from 'routes'
import { useHistory } from 'react-router-dom'
import { createService } from 'api/rif-marketplace-cache/cacheController'

export interface MyDomainsProps {
  className?: string
}

const LISTING_TYPE = MarketListingTypes.DOMAINS

const MyDomains: FC<MyDomainsProps> = ({ className = '' }) => {
  const {
    state: {
      currentListing,
      filters: {
        domains: domainFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const {
    state: { account },
  } = useContext(Web3Store)
  const history = useHistory()

  const { servicePath, listingType, items } = currentListing
  const { ownerAddress } = domainFilters

  // connect service
  useEffect(() => {
    if (account && servicePath !== RnsServicePaths.SELL) {
      const serviceAddr = createService(RnsServicePaths.SELL, dispatch)
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: MarketListingTypes.DOMAINS,
          txType: TxType.SELL,
        },
      })
    }
  }, [account, dispatch])

  // fetch domains based on the statusFilter
  useEffect(() => {
    if (ownerAddress && servicePath === RnsServicePaths.SELL) {
      fetchDomains(domainFilters)
        .then((items) => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: MarketListingTypes.DOMAINS,
            items,
          },
        }))
    }
  }, [account, dispatch, domainFilters])

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

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    action1: '',
  }

  if (listingType !== LISTING_TYPE) return null

  const collection = items
    .map((domainItem: Domain) => {
      const {
        id,
        name,
        expirationDate,
        tokenId,
      } = domainItem

      const pseudoResolvedName = domainFilters?.name?.$like && (`${domainFilters?.name?.$like}.rsk`)
      const displayItem = {
        id,
        name: name || pseudoResolvedName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
        expirationDate: expirationDate.toLocaleDateString(),
        action1: <SelectRowButton
          id={id}
          handleSelect={() => {
            dispatch({
              type: MARKET_ACTIONS.SELECT_ITEM,
              payload: {
                listingType: LISTING_TYPE,
                item: domainItem,
                txType: TxType.SELL,
              },
            })
            history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
          }}
        />,
        price: <></>,
        action2: <></>,
      }
      return displayItem
    })

  return (
    <Marketplace className={className} items={collection} headers={headers} />
  )
}

export default MyDomains
