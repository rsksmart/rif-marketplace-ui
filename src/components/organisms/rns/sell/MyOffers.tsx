import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import { RifAddress, CombinedPriceCell, SelectRowButton } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { RnsDomain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketContext, { MarketContextProps } from 'context/Market'
import RnsDomainsContext, { RnsDomainsContextProps } from 'context/Services/rns/DomainsContext'
import { ShortenTextTooltip, Spinner } from '@rsksmart/rif-ui'
import { MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import useConfirmations from 'hooks/useConfirmations'
import InfoBar from 'components/molecules/InfoBar'
import { RnsContractData } from 'context/Confirmations/interfaces'

const MyOffers: FC = () => {
  const {
    state: {
      listing: {
        outdatedTokens,
        items,
      },
      filters,
    },
    dispatch,
  } = useContext<RnsDomainsContextProps>(RnsDomainsContext)
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: fiatDisplayName,
        },
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        status: 'placed',
      },
    })
  }, [dispatch])

  const pendingConfs = useConfirmations(['RNS_CANCEL', 'RNS_PLACE'])

  const history = useHistory()

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    price: 'Listed Price',
    action1: '',
    action2: '',
  }

  const collection = items
    .map<MarketplaceItem>((domainItem: RnsDomain) => {
      const {
        id,
        name,
        offer,
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
        : <RifAddress pretext="Unknown RNS:" value={tokenId} />

      const isProcessingConfs = pendingConfs.some(
        ({ contractActionData }) => (
          (contractActionData as RnsContractData).tokenId === tokenId
        ),
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
              handleSelect={(): void => {
                dispatch({
                  type: 'SET_ORDER',
                  payload: {
                    item: domainItem,
                  },
                })
                history.push(ROUTES.RNS.SELL.CHECKOUT)
              }}
            />
          ),
        price: <></>,
        action2: <></>,
      }

      if (offer && !isProcessingConfs) {
        const {
          price, paymentToken: {
            displayName,
            symbol: token,
          },
        } = offer

        const { rate } = crypto[token]

        displayItem.price = (
          <CombinedPriceCell
            price={price.toString()}
            priceFiat={price.times(rate).toString()}
            currency={displayName}
            currencyFiat={fiatDisplayName}
          />
        )
        displayItem.action2 = (
          <IconButton
            color="primary"
            id={id}
            onClick={(): void => {
              dispatch({
                type: 'SET_ORDER',
                payload: {
                  item: domainItem,
                },
              })
              history.push(ROUTES.RNS.SELL.CANCEL.CHECKOUT)
            }}
          >
            <ClearIcon />
          </IconButton>
        )
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
        outdatedCt={outdatedTokens.length}
      />
    </>
  )
}

export default MyOffers
