import { AddressItem, SelectRowButton } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import RnsDomainsContext, { RnsDomainsContextProps } from 'context/Services/rns/DomainsContext'
import { ShortenTextTooltip, Spinner } from '@rsksmart/rif-ui'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import InfoBar from 'components/molecules/InfoBar'
import useConfirmations from 'hooks/useConfirmations'

const MyDomains: FC = () => {
  const {
    state: {
      listing,
      filters,
    },
    dispatch,
  } = useContext<RnsDomainsContextProps>(RnsDomainsContext)
  const history = useHistory()

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        status: 'owned',
      },
    })
  }, [dispatch])

  const pendingConfs = useConfirmations(['RNS_BUY', 'RNS_CANCEL', 'RNS_PLACE'])

  const routeState = history.location.state as { refresh?: boolean }

  if (routeState?.refresh) {
    routeState.refresh = false
    dispatch({
      type: 'REFRESH',
      payload: {
        refresh: true,
      },
    })
  }

  const { items } = listing

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    action1: '',
  }

  const collection = items
    .map<MarketplaceItem>((domainItem: RnsDomain) => {
      const {
        id,
        name,
        expirationDate,
        tokenId,
      } = domainItem

      const pseudoResolvedName = filters.name as string && (`${filters.name}.rsk`)
      const displayDomainName = name || pseudoResolvedName
        ? (
          <ShortenTextTooltip
            value={name || pseudoResolvedName}
            maxLength={30}
          />
        )
        : <AddressItem pretext="Unknown RNS:" value={tokenId} />

      const isProcessingConfs = pendingConfs.some(
        ({ contractActionData }) => contractActionData?.id === tokenId,
      )

      const displayItem = {
        id,
        name: displayDomainName,
        expirationDate: expirationDate.toLocaleDateString(),
        action1: isProcessingConfs
          ? <Spinner />
          : (
            <SelectRowButton
              id={id}
              handleSelect={
                (): void => {
                  dispatch({
                    type: 'SET_ORDER',
                    payload: {
                      item: domainItem,
                    },
                  })
                  history.push(ROUTES.RNS.SELL.CHECKOUT)
                }
              }
            />
          ),
      }
      return displayItem
    })

  return (
    <>
      <InfoBar
        isVisible={Boolean(pendingConfs.length)}
        text={`Awaiting confirmations for ${pendingConfs.length} domain(s)`}
        type="info"
      />
      <MarketPageTemplate
        filterItems={<DomainFilters />}
        items={collection}
        headers={headers}
        requiresAccount
        dispatch={dispatch}
        outdatedCt={listing.outdatedTokens.length}
      />
    </>
  )
}

export default MyDomains
