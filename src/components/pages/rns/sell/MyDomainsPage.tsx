import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import { Web3Store } from '@rsksmart/rif-ui'
import { createDomainService, DOMAINS_SERVICE_PATHS, fetchDomains } from 'api/rif-marketplace-cache/domainsController'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketListingTypes } from 'models/Market'
import { Domain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'

const LISTING_TYPE = MarketListingTypes.DOMAINS
const TX_TYPE = TxType.SELL

const MyDomainsPage: FC<{}> = () => {
  const {
    state: {
      currentListing,
      filters: {
        domains: domainFilters,
      },
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const {
    state: { account },
  } = useContext(Web3Store)
  const history = useHistory()

  const servicePath = currentListing?.servicePath
  const statusFilter = domainFilters.status

  /* Initialise */
  useEffect(() => {
    if (statusFilter === 'sold') {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.SOLD,
        },
      })
      history.replace(ROUTES.DOMAINS.SOLD)
    }
  }, [statusFilter, dispatch, history])
  useEffect(() => {
    if (servicePath && account && servicePath !== DOMAINS_SERVICE_PATHS.SELL(account)) {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.SELL,
        },
      })
    }
  }, [servicePath, account, dispatch])

  useEffect(() => {
    if (!servicePath && account) {
      const serviceAddr = createDomainService(account)
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: LISTING_TYPE,
          txType: TX_TYPE,
        },
      })
    }
  }, [servicePath, account, dispatch])

  useEffect(() => {
    if (servicePath && account && servicePath === DOMAINS_SERVICE_PATHS.SELL(account) && domainFilters.status !== 'sold') { // TODO: refactor
      fetchDomains(domainFilters)
        .then((items) => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: LISTING_TYPE,
            items,
          },
        }))
    }
  }, [domainFilters, account, servicePath, dispatch])

  if (!currentListing) return null

  const headers = {
    owned:
    {
      name: 'Name',
      expirationDate: 'Renewal Date',
      action1: '',
    },
    placed: {
      name: 'Name',
      expirationDate: 'Renewal Date',
      price: 'Listed Price',
      action1: '',
      action2: '',
    },
    sold: {},
  }

  const collection = currentListing?.items
    .map((domainItem: Domain) => {
      const {
        id,
        name,
        offer,
        expirationDate,
        tokenId,
      } = domainItem
      const pseudoResolvedName = domainFilters?.name?.$like && `${domainFilters?.name?.$like}.rsk`
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
                txType: TX_TYPE,
              },
            })
            history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
          }}
        />,
        price: <></>,
        action2: <></>,
      }

      if (statusFilter === 'placed' && offer) {
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
                type: MARKET_ACTIONS.SELECT_ITEM,
                payload: {
                  listingType: LISTING_TYPE,
                  item: domainItem,
                  txType: TX_TYPE,
                },
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
      className="Domains"
      filterItems={<DomainFilters />}
      itemCollection={collection}
      headers={headers[statusFilter]}
      accountRequired
    />
  )
}

export default MyDomainsPage
