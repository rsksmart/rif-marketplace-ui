import { Web3Store } from '@rsksmart/rif-ui'
import SubscriptionPlans from 'api/rif-notifier-service/subscriptionPlans'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
import NotifierOffersFilters from 'components/organisms/filters/notifier/OffersFilters'
import NotifierPlansDraw from 'components/organisms/notifier/NotifierPlansDraw'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import MarketContext, { MarketContextProps } from 'context/Market'
import { NotifierOffersContext, NotifierOffersContextProps } from 'context/Services/notifier/offers'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, PriceOption } from 'models/marketItems/NotifierItem'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import Tooltip from '@material-ui/core/Tooltip'
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
  { id: selectedItemId, plans }: ProviderItem,
  currentFiat: string,
  crypto: MarketCryptoRecord,
  onPlanSelected: (plan: NotifierOfferItem, priceOption: PriceOption) => void,
): FC<string> => (id): JSX.Element => (
  <NotifierPlansDraw
    plans={plans}
    isOpen={selectedItemId === id}
    {...{ onPlanSelected, currentFiat, crypto }}
  />
)

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

  const [selectedProvider, setSelectedProvider] = useState<ProviderItem>()
  const [collection, setCollection] = useState<MarketplaceItem[]>([])

  useEffect(() => {
    if (items?.length) {
      const providers = Array.from(new Set(items
        .map(({ provider }) => provider)))

      Promise.all(providers
        .map<Promise<MarketplaceItem>>(async (provider) => {
          const providerPlans = items
            .filter((item) => item.provider === provider)
          const { url } = providerPlans[0]

          const notifierService = new SubscriptionPlans(url)
          notifierService.connect(Logger.getInstance().debug)
          const hasActivePlans = await notifierService.hasActivePlans()

          const { priceFiatRange, ...offerDetails } = mapPlansToOffers(
            providerPlans, crypto,
          )

          const isSelected = selectedProvider?.id === provider

          const selectButton = (
            <SelectRowButton
              disabled={!hasActivePlans}
              id={provider}
              isSelected={isSelected}
              handleSelect={(): void => {
                setSelectedProvider(isSelected
                  ? undefined
                  : { id: provider, plans: providerPlans })
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
            action1: account === provider ? 'your offer' : action1,
          }
        })).then((marketplaceItems) => {
        setCollection(marketplaceItems)
      })
    }
  }, [items, crypto, currentFiat, account, selectedProvider])

  return (
    <MarketPageTemplate
      className={contextID}
      filterItems={<NotifierOffersFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
      itemDetail={selectedProvider && showPlans(
        selectedProvider, currentFiat, crypto, onPlanSelected,
      )}
    />
  )
}

export default NotifierOffersPage
