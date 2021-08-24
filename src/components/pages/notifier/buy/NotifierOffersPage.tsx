import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { Spinner, Web3Store } from '@rsksmart/rif-ui'
import { SubscriptionPlanDTO } from 'api/rif-notifier-service/models/subscriptionPlan'
import SubscriptionPlans from 'api/rif-notifier-service/subscriptionPlans'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
import { SelectRowButtonProps } from 'components/molecules/SelectRowButton'
import NotifierOffersFilters from 'components/organisms/filters/notifier/OffersFilters'
import NotifierPlansDraw from 'components/organisms/notifier/NotifierPlansDraw'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import MarketContext, { MarketContextProps } from 'context/Market'
import { NotifierOffersContext, NotifierOffersContextProps } from 'context/Services/notifier/offers'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, NotifierPlan, PriceOption } from 'models/marketItems/NotifierItem'
import React, {
  FC, useCallback, useContext, useEffect, useMemo, useState,
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

const getProviderPlans = (url: string): Promise<SubscriptionPlanDTO[]> => {
  const notifierService = new SubscriptionPlans(url)
  notifierService.connect((er) => {
    Logger.getInstance()
      .debug(JSON.stringify(er, null, 2))
  })
  return notifierService.getActivePlans()
}

const createActionButton = (actionButtonProps: SelectRowButtonProps): JSX.Element => {
  const selectButton = (
    <SelectRowButton {...actionButtonProps} />
  )

  return actionButtonProps.disabled
    ? (
      <Tooltip title="This provider doesn't have any active plans that match our records at the moment">
        <span>
          {selectButton}
        </span>
      </Tooltip>
    ) : selectButton
}

const NotifierOffersPage: FC = () => {
  const history = useHistory()
  const {
    state: {
      contextID,
      listing: { items: cachedPlans },
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

  const providers = useMemo(() => Array.from(new Set(cachedPlans
    .map(({ provider }) => provider))), [cachedPlans])
  const [selectedProvider, setSelectedProvider] = useState<string>()
  const [
    selectedProviderPlans,
    setSelectedProviderPlans,
  ] = useState<NotifierPlan[]>([])
  const [collection, setCollection] = useState<MarketplaceItem[]>([])
  const addToCollection = useCallback((newCollectionItem: MarketplaceItem) => {
    setCollection((curCollection) => {
      const spinnerlessCollection = curCollection.slice(0, -1)
      const [spinner] = curCollection.slice(-1)

      return [
        ...spinnerlessCollection,
        newCollectionItem,
        spinner,
      ]
    })
  }, [setCollection])

  useEffect(() => {
    setSelectedProviderPlans(cachedPlans
      .filter(({ provider }) => provider === selectedProvider))
  }, [cachedPlans, selectedProvider])

  useEffect(() => {
    if (cachedPlans?.length) {
      setCollection([
        {
          id: 'pending',
          action1: (<Spinner />),
        },
      ])

      Promise.all(providers.map(async (provider) => {
        const providerPlans = cachedPlans
          .filter((item) => item.provider === provider)
        const [{ url }] = providerPlans

        const notifierActivePlans = await getProviderPlans(url)

        // filter out inactive plans
        const activePlans = providerPlans.filter(
          ({ planId }) => notifierActivePlans && notifierActivePlans.some(
            ({ id: notifierPlanId }) => notifierPlanId === planId,
          ),
        )
        const hasActivePlans = activePlans.length

        const isSelected = selectedProvider === provider

        const buttonSelect = createActionButton({
          disabled: !hasActivePlans,
          id: provider,
          isSelected,
          handleSelect: () => setSelectedProvider(
            isSelected ? undefined : provider,
          ),
        })

        const commonProperties = {
          id: provider,
          provider: <AddressItem value={provider} />,
          action1: account === provider ? 'Your offer' : (buttonSelect),
        }

        if (!hasActivePlans) {
          const collectionItem: MarketplaceItem = {
            ...commonProperties,
            channels: 'N/A',
            currencies: 'N/A',
            notifLimitRange: 'N/A',
            priceFiatRange: <Typography>N/A</Typography>,
          }
          addToCollection(collectionItem)
          return
        }

        const {
          priceFiatRange,
          ...offerDetails
        } = mapPlansToOffers(
          activePlans, crypto,
        )

        const resultItem: MarketplaceItem = {
          ...commonProperties,
          ...offerDetails,
          priceFiatRange: (
            <ItemWUnit
              type="mediumPrimary"
              value={priceFiatRange}
              unit={currentFiat}
            />
          ),
        }

        addToCollection(resultItem)
      }))
        .finally(() => {
          setCollection((curCollection) => curCollection
            .slice(0, -1))
        })
    }
  }, [
    cachedPlans, crypto,
    currentFiat, account, selectedProvider, providers, addToCollection,
  ])

  return (
    <MarketPageTemplate
      className={contextID}
      filterItems={<NotifierOffersFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
      itemDetail={showPlans(
        { id: selectedProvider, plans: selectedProviderPlans },
        currentFiat, crypto, onPlanSelected,
      )}
    />
  )
}

export default NotifierOffersPage
