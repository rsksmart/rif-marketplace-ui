import { Web3Store, ShortenTextTooltip } from '@rsksmart/rif-ui'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AddressItem, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import RifPaging from 'components/molecules/RifPaging'
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsDomainOffer } from 'models/marketItems/DomainItem'
import ROUTES from 'routes'
import MarketContext from 'context/Market/MarketContext'
import RnsOffersContext, { RnsOffersContextProps } from 'context/Services/rns/OffersContext'
import { OrderPayload, RefreshPayload } from 'context/Services/rns/rnsActions'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { RnsSort, SORT_DIRECTION } from 'api/models/RnsFilter'
import { TableSortLabel } from '@material-ui/core'

enum SORT_TO_HEADER {
  name = 'domainName',
  price = 'combinedPrice',
}

const isSortedOn = (
  header: SORT_TO_HEADER, sortedBy: string,
): boolean => SORT_TO_HEADER[sortedBy] === header

const getNewSortDirection = (
  header: SORT_TO_HEADER, sortedBy: string, currentSortDirection: SORT_DIRECTION,
): SORT_DIRECTION => {
  if (isSortedOn(header, sortedBy)) return currentSortDirection > 0 ? -1 : 1
  return 1
}

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
      sort,
      pagination: {
        current: currentPage,
      },
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

  let action1Header: JSX.Element | string = ''

  if (currentPage) {
    const { skip, limit, total } = currentPage
    const nextPage = skip + limit

    action1Header = (
      <RifPaging
        from={skip + 1}
        to={nextPage > total ? total : nextPage}
        total={total}
        onNext={(): void => dispatch({ type: 'NEXT_PAGE', payload: {} })}
        onPrev={(): void => dispatch({ type: 'PREV_PAGE', payload: {} })}
      />
    )
  }

  const sortedBy = Object.keys(sort)[0]
  const sortDirection = sort[sortedBy]

  const triggerSort = (by: RnsSort): void => {
    dispatch({
      type: 'SET_SORT',
      payload: by,
    })
  }

  const headers = {
    domainName: (
      <TableSortLabel
        active={isSortedOn(SORT_TO_HEADER.name, sortedBy)}
        direction={SORT_DIRECTION[sortDirection] as ('asc' | 'desc')}
        onClick={(): void => {
          triggerSort({
            name: getNewSortDirection(
              SORT_TO_HEADER.name, sortedBy, sortDirection,
            ),
          })
        }}
      >
        Name
      </TableSortLabel>
    ),
    ownerAddress: 'Owner',
    expirationDate: 'Renewal Date',
    combinedPrice: (
      <TableSortLabel
        active={isSortedOn(SORT_TO_HEADER.price, sortedBy)}
        direction={SORT_DIRECTION[sortDirection] as ('asc' | 'desc')}
        onClick={(): void => {
          triggerSort({
            price: getNewSortDirection(
              SORT_TO_HEADER.price, sortedBy, sortDirection,
            ),
          })
        }}
      >
        Price
      </TableSortLabel>),
    action1: action1Header,
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
          divider=""
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
