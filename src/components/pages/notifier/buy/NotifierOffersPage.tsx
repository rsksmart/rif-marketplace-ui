import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { Web3Store } from '@rsksmart/rif-ui'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
import NotifierOffersFilters from 'components/organisms/filters/notifier/OffersFilters'
import NotifierPlansDraw from 'components/organisms/notifier/NotifierPlansDraw'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import MarketContext, { MarketContextProps } from 'context/Market'
import { NotifierOffersContext, NotifierOffersContextProps } from 'context/Services/notifier/offers'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, NotifierPlan, PriceOption } from 'models/marketItems/NotifierItem'
import React, {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
<<<<<<< HEAD
=======
import Logger from 'utils/Logger'
>>>>>>> 625a32d (fix(notifier): filters selected provider plans)
import { mapPlansToOffers } from './utils'

const headers: TableHeaders = {
  provider: 'Provider',
  notifLimitRange: 'Notifications',
  channels: 'Channels',
  currencies: 'Currencies',
  priceFiatRange: 'Price',
  action1: '',
}

type ProviderItem = {
  id: string
  plans: Array<NotifierOfferItem>
}

const showPlans = (
  { id: selectedItemId, plans }: Partial<ProviderItem>,
  currentFiat: string,
  crypto: MarketCryptoRecord,
  onPlanSelected: (plan: NotifierOfferItem, priceOption: PriceOption) => void,
): FC<string> => (id): JSX.Element => {
  const isSelected = selectedItemId && plans?.length

  return (
    <>
      {isSelected && (
      <NotifierPlansDraw
        plans={plans as Array<NotifierOfferItem>}
        isOpen={selectedItemId === id}
        {...{ onPlanSelected, currentFiat, crypto }}
      />
      )}
    </>
  )
}

const NotifierOffersPage: FC = () => {
  const history = useHistory()
  const {
    state: {
      contextID,
      listing: { items },
    },
    dispatch,
  } = useContext<NotifierOffersContextProps>(NotifierOffersContext)
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: currentFiat,
        },
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: { provider: undefined },
    })
  }, [dispatch])

  const onPlanSelected = (
    plan: NotifierOfferItem,
    priceOption: PriceOption,
  ): void => {
    dispatch({
      type: 'SET_ORDER',
      payload: { plan, priceOption },
    })
    history.push(ROUTES.NOTIFIER.BUY.CHECKOUT)
  }

<<<<<<< HEAD
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem>()

  const providers = Array.from(new Set(items.map(({ provider }) => provider)))

  const collection: MarketplaceItem[] = providers
    .map<MarketplaceItem>((provider) => {
      const providerPlans = items.filter((item) => item.provider === provider)

      const { priceFiatRange, ...offerDetails } = mapPlansToOffers(
        providerPlans, crypto,
      )

      const isSelected = selectedProvider?.id === provider

      return {
        id: provider,
        provider: <AddressItem value={provider} />,
        ...offerDetails,
        priceFiatRange: (
          <ItemWUnit
            type="mediumPrimary"
            value={priceFiatRange}
            unit={currentFiat}
          />
        ),
        action1: account === provider ? 'your offer' : (
          <SelectRowButton
            id={provider}
            isSelected={isSelected}
            handleSelect={(): void => {
              setSelectedProvider(isSelected
                ? undefined
                : { id: provider, plans: providerPlans })
            }}
          />
        ),
      }
    })
=======
  const providers = useMemo(() => Array.from(new Set(items
    .map(({ provider }) => provider))), [items])
  const [selectedProvider, setSelectedProvider] = useState<string>()
  const [
    selectedProviderPlans,
    setSelectedProviderPlans,
  ] = useState<NotifierPlan[]>([])
  const [collection, setCollection] = useState<MarketplaceItem[]>([])

  useEffect(() => {
    setSelectedProviderPlans(items
      .filter(({ provider }) => provider === selectedProvider))
  }, [items, selectedProvider])

  useEffect(() => {
    if (items?.length) {
      Promise.all(providers
        .map<Promise<MarketplaceItem>>(async (provider) => {
          const providerPlans = items
            .filter((item) => item.provider === provider)
          const { url } = providerPlans[0]

          const notifierService = new SubscriptionPlans(url)
          notifierService.connect((er) => {
            Logger.getInstance()
              .debug(JSON.stringify(er, null, 2))
          })
          const notifierActivePlans = await notifierService.getActivePlans()

          // filter out inactive plans
          const activePlans = providerPlans.filter(
            ({ planId }) => notifierActivePlans.some(
              ({ id: notifierPlanId }) => notifierPlanId === planId,
            ),
          )
          const hasActivePlans = activePlans.length

          const isSelected = selectedProvider === provider

          const selectButton = (
            <SelectRowButton
              disabled={!hasActivePlans}
              id={provider}
              isSelected={isSelected}
              handleSelect={(): void => {
                setSelectedProvider(isSelected
                  ? undefined
                  : provider)
              }}
            />
          )
          const action1 = hasActivePlans
            ? selectButton
            : (
              <Tooltip title="This provider doesn't have any active plan at the moment">
                <span>
                  {selectButton}
                </span>
              </Tooltip>
            )

          const commonResult = {
            id: provider,
            provider: <AddressItem value={provider} />,
            action1: account === provider ? 'Your offer' : (action1),
          }

          if (!hasActivePlans) {
            return {
              ...commonResult,
              channels: 'N/A',
              currencies: 'N/A',
              notifLimitRange: 'N/A',
              priceFiatRange: <Typography>N/A</Typography>,
            }
          }

          const {
            priceFiatRange,
            ...offerDetails
          } = mapPlansToOffers(
            activePlans, crypto,
          )

          return {
            ...commonResult,
            ...offerDetails,
            priceFiatRange: (
              <ItemWUnit
                type="mediumPrimary"
                value={priceFiatRange}
                unit={currentFiat}
              />
            ),
          }
        })).then((marketplaceItems) => {
        setCollection(marketplaceItems)
      })
    }
  }, [items, crypto, currentFiat, account, selectedProvider, providers])
>>>>>>> 625a32d (fix(notifier): filters selected provider plans)

  return (
    <MarketPageTemplate
      className={contextID}
      filterItems={<NotifierOffersFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
<<<<<<< HEAD
      itemDetail={
        selectedProvider && showPlans(
          selectedProvider, currentFiat, crypto, onPlanSelected,
        )
      }
=======
      itemDetail={showPlans(
        { id: selectedProvider, plans: selectedProviderPlans },
        currentFiat, crypto, onPlanSelected,
      )}
>>>>>>> 625a32d (fix(notifier): filters selected provider plans)
    />
  )
}

export default NotifierOffersPage
