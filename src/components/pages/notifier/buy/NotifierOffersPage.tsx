import Typography from '@material-ui/core/Typography'
import { Spinner, Web3Store } from '@rsksmart/rif-ui'
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
import { NotifierOfferItem, NotifierPlan, PriceOption } from 'models/marketItems/NotifierItem'
import React, {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { mapPlansToOffers } from './utils'

const headers: TableHeaders = {
  provider: 'Provider',
  notifLimitRange: 'Notifications',
  channels: 'Channels',
  currencies: 'Currencies',
  priceFiatRange: 'Price',
  action1: '',
}

type ItemDetailProps = {
  plans: Array<NotifierOfferItem>
  isOpen: boolean
  currentFiat: string
  crypto: MarketCryptoRecord
  onPlanSelected: (plan: NotifierOfferItem, priceOption: PriceOption) => void
}

const ItemDetail: FC<ItemDetailProps> = ({
  plans, isOpen, currentFiat, crypto, onPlanSelected,
}) => {
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [activePlans, setActivePlans] = useState<Array<NotifierOfferItem>>([])

  const { url } = plans[0]
  const notifierService = new SubscriptionPlans(url)
  notifierService.connect((er) => {
    Logger.getInstance()
      .debug(JSON.stringify(er, null, 2))
  })

  useEffect(() => {
    const fetchPlans = async (): Promise<void> => {
      setIsLoadingPlans(true)
      try {
        const notifierActivePlans = await notifierService.getActivePlans()

        // filter out inactive plans
        const providerActivePlans = plans.filter(
          ({ planId }) => notifierActivePlans.some(
            ({ id: notifierPlanId }) => notifierPlanId === planId,
          ),
        )
        setActivePlans(providerActivePlans)
      } catch (error) {
        // show error
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchPlans()
  }, [])

  if (isLoadingPlans) return <Spinner />

  const hasActivePlans = Boolean(activePlans.length)

  if (!hasActivePlans) {
    return (
      <Typography>
        This provider doesn&apos;t have any active plan at the moment
      </Typography>
    )
  }

  return (
    <NotifierPlansDraw
      plans={plans as Array<NotifierOfferItem>}
      isOpen={isOpen}
      {...{ onPlanSelected, currentFiat, crypto }}
    />
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
      const marketplaceItems = providers
        .map<MarketplaceItem>((provider) => {
          const providerPlans = items
            .filter((item) => item.provider === provider)

          const isSelected = selectedProvider === provider

          const selectButton = (
            <SelectRowButton
              disabled={!providerPlans.length}
              id={provider}
              isSelected={isSelected}
              handleSelect={(): void => {
                setSelectedProvider(isSelected
                  ? undefined
                  : provider)
              }}
            />
          )

          const commonResult = {
            id: provider,
            provider: <AddressItem value={provider} />,
            action1: account === provider ? 'Your offer' : (selectButton),
          }

          const {
            priceFiatRange,
            ...offerDetails
          } = mapPlansToOffers(
            providerPlans, crypto,
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
        })

      setCollection(marketplaceItems)
    }
  }, [items, crypto, currentFiat, account, selectedProvider, providers])

  return (
    <MarketPageTemplate
      className={contextID}
      filterItems={<NotifierOffersFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
      itemDetail={
        selectedProviderPlans.length
          ? (
            <ItemDetail
              isOpen
              plans={selectedProviderPlans}
              crypto={crypto}
              currentFiat={currentFiat}
              onPlanSelected={onPlanSelected}
            />
          )
          : <Typography>No plans yet!</Typography>
      }
    />
  )
}

export default NotifierOffersPage
