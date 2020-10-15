import { Web3Store } from '@rsksmart/rif-ui'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainNameItem from 'components/molecules/DomainNameItem'
import RifPaging from 'components/molecules/RifPaging'
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { HeadCell } from 'components/templates/marketplace/Marketplace'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import RnsOffersStore from 'store/Market/rns/OffersStore'
import { OrderPayload, RefreshPayload } from 'store/Market/rns/rnsActions'

const DomainOffersPage: FC = () => {
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
    dispatch: mDispatch,
  } = useContext(MarketStore)
  const {
    state: {
      listing: {
        items,
        outdatedTokens,
      },
      filters,
      pagination: {
        current: currentPage,
      },
    },
    dispatch,
  } = useContext(RnsOffersStore)

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

  useEffect(() => {
    mDispatch({
      type: 'TOGGLE_TX_TYPE',
      payload: {
        txType: TxType.BUY,
      },
    })
  }, [mDispatch])

  let collection = []

  let action1Header: JSX.Element | '' = ''

  if (currentPage) {
    const { skip, limit, total } = currentPage
    const nextPage = skip + limit

    action1Header = (
      <RifPaging
        from={skip + 1}
        to={nextPage > total ? total : nextPage}
        total={total}
        onNext={(): void => dispatch({ type: 'NEXT_PAGE' })}
        onPrev={(): void => dispatch({ type: 'PREV_PAGE' })}
      />
    )
  }

  const headers: HeadCell<RnsDomainOffer>[] = [
    {
      id: 'domainName',
      label: 'Name',
    },
    {
      id: 'ownerAddress',
      label: 'Owner',
    },
    {
      id: 'expirationDate',
      label: 'Renewal Date',
    },
    {
      id: 'price',
      label: 'Price',
    },
    {
      id: 'action1',
      label: action1Header,
    },
  ]

  collection = items
    .map((item: RnsDomainOffer) => {
      const {
        id,
        price,
        domainName,
        paymentToken,
        ownerAddress,
        expirationDate,
        tokenId,
      } = item

      const pseudoResolvedName = filters.name && (`${filters.name}.rsk`)
      const { rate, displayName } = crypto[paymentToken]

      const displayDomainName = domainName || pseudoResolvedName
        ? <DomainNameItem value={domainName || pseudoResolvedName} />
        : <AddressItem pretext="Unknown RNS:" value={tokenId} />

      const displayItem = {
        id,
        domainName: displayDomainName,
        ownerAddress: <AddressItem value={ownerAddress} />,
        expirationDate: expirationDate.toLocaleDateString(),
        price: <CombinedPriceCell
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
              history.push(ROUTES.DOMAINS.CHECKOUT.BUY)
            }}
          />
        ),
      }

      return displayItem
    }) as any // TODO: remove as any

  return (
    <MarketPageTemplate<RnsDomainOffer>
      className="Domain Offers"
      filterItems={<DomainOfferFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={outdatedTokens.length}
      sort={{
        by: 'domainName',
        order: 'asc',
        onChange: (evt, prop) => {
        },
      }}
    />
  )
}

export default DomainOffersPage
