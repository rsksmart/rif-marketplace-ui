import { Web3Store } from '@rsksmart/rif-ui'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import MarketStore from 'store/Market/MarketStore'


const MyOffers: FC<{}> = () => {
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

  // const servicePath = currentListing?.servicePath
  // const listingType = currentListing?.listingType
  // const items = currentListing?.items
  // const { ownerAddress } = domainFilters
  // connect service
  // useEffect(() => {
  //   if (account && servicePath !== RnsServicePaths.SELL) {
  //     const serviceAddr = createService(RnsServicePaths.SELL, dispatch)
  //     dispatch({
  //       type: MARKET_ACTIONS.CONNECT_SERVICE,
  //       payload: {
  //         servicePath: serviceAddr,
  //         listingType: LISTING_TYPE,
  //         txType: TxType.SELL,
  //       },
  //     })
  //   }
  // }, [account, servicePath, dispatch])

  // fetch domains based on the statusFilter
  // useEffect(() => {
  //   if (ownerAddress && servicePath === RnsServicePaths.SELL) {
  //     fetchDomains(domainFilters)
  //       .then((receivedItems) => dispatch({
  //         type: MARKET_ACTIONS.SET_ITEMS,
  //         payload: { items: receivedItems },
  //       }))
  //   }
  // }, [domainFilters, ownerAddress, servicePath, dispatch])

  // useEffect(() => {
  //   if (account) {
  //     dispatch({
  //       type: MARKET_ACTIONS.SET_FILTER,
  //       payload: {
  //         filterItems: {
  //           ownerAddress: account,
  //         },
  //       },
  //     })
  //   }
  // }, [account, dispatch])

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    price: 'Listed Price',
    action1: '',
    action2: '',
  }

  // if (!currentListing || listingType !== LISTING_TYPE) return null

  // const collection = items
  //   .map((domainItem: Domain) => {
  //     const {
  //       id,
  //       name,
  //       offer,
  //       expirationDate,
  //       tokenId,
  //     } = domainItem
  //     const pseudoResolvedName = domainFilters?.name?.$like && (`${domainFilters?.name?.$like}.rsk`)
  //     const displayItem = {
  //       id,
  //       name: name || pseudoResolvedName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
  //       expirationDate: expirationDate.toLocaleDateString(),
  //       action1: <SelectRowButton
  //         id={id}
  //         handleSelect={() => {
  //           dispatch({
  //             type: MARKET_ACTIONS.SELECT_ITEM,
  //             payload: {
  //               listingType: LISTING_TYPE,
  //               item: domainItem,
  //               txType: TxType.SELL,
  //             },
  //           })
  //           history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
  //         }}
  //       />,
  //       price: <></>,
  //       action2: <></>,
  //     }

  //     if (offer) {
  //       const { price, paymentToken } = offer
  //       const currency = crypto[paymentToken]
  //       displayItem.price = (
  //         <CombinedPriceCell
  //           price={price.toString()}
  //           priceFiat={(currency.rate * price).toString()}
  //           currency={currency.displayName}
  //           currencyFiat={currentFiat.displayName}
  //           divider=" = "
  //         />
  //       )
  //       displayItem.action2 = (
  //         <IconButton
  //           color="primary"
  //           id={id}
  //           onClick={() => {
  //             dispatch({
  //               type: MARKET_ACTIONS.SELECT_ITEM,
  //               payload: {
  //                 listingType: LISTING_TYPE,
  //                 item: domainItem,
  //                 // txType: TxType.SELL,
  //               },
  //             })
  //             history.push(ROUTES.DOMAINS.CHECKOUT.CANCEL)
  //           }}
  //         >
  //           <ClearIcon />
  //         </IconButton>
  //       )
  //     }

  //     return displayItem
  //   })

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      itemCollection={[]}
      // itemCollection={collection}
      headers={headers}
      accountRequired
      dispatch={dispatch}
      outdatedCt={currentListing.outdatedTokens.length}
    />
  )
}

export default MyOffers
