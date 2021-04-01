import { Box, Collapse } from '@material-ui/core'
import { Web3Store } from '@rsksmart/rif-ui'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
import NotifierPlan from 'components/molecules/notifier/NotifierPlan'
import NotifierOffersFilters from 'components/organisms/filters/notifier/OffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import MarketContext, { MarketContextProps } from 'context/Market'
import { NotifierOffersContext, NotifierOffersContextProps } from 'context/Services/notifier/offers'
import { MarketCryptoRecord } from 'models/Market'
import { NotifierOfferItem, PriceOption } from 'models/marketItems/NotifierItem'
import React, { FC, useContext, useState } from 'react'
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
  selectedItem: ProviderItem,
  currentFiat: string,
  crypto: MarketCryptoRecord,
  onPlanSelected: (plan: NotifierOfferItem, priceOption: PriceOption) => void,
): FC<string> => (id): JSX.Element => (
  <Collapse
    in={selectedItem.id === id}
    timeout="auto"
    unmountOnExit
  >
    <Box margin={1}>
      <GridRow spacing={1} wrap="nowrap">
        {
        selectedItem.plans.map((plan) => (
          <GridItem xs={2}>
            <NotifierPlan
              onSelect={(priceOption): void => {
                onPlanSelected(plan, priceOption)
              }}
              {...{ currentFiat, crypto, ...plan }}
            />
          </GridItem>
        ))
      }
      </GridRow>
    </Box>
  </Collapse>
)

const NotifierOffersPage: FC = () => {
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

  const onPlanSelected = (
    plan: NotifierOfferItem,
    priceOption: PriceOption,
  ): void => {
    dispatch({
      type: 'SET_ORDER',
      payload: { plan, priceOption },
    })
    // TODO: history.push(ROUTES.NOTIFIER.BUY.CHECKOUT)
  }

  const [selectedProvider, setSelectedProvider] = useState<ProviderItem>()

  const providers = Array.from(new Set(items.map(({ provider }) => provider)))

  const collection: MarketplaceItem[] = providers
    .map<MarketplaceItem>((provider) => {
      const providerPlans = items.filter((item) => item.provider === provider)

      const { priceFiatRange, ...offerDetails } = mapPlansToOffers(
        providerPlans, crypto,
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
        action1: account === provider ? 'your offer' : (
          <SelectRowButton
            id={provider}
            handleSelect={(): void => {
              setSelectedProvider({ id: provider, plans: providerPlans })
            }}
          />
        ),
      }
    })

  return (
    <MarketPageTemplate
      className={contextID}
      filterItems={<NotifierOffersFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
      itemDetail={
        selectedProvider && showPlans(
          selectedProvider, currentFiat, crypto, onPlanSelected,
        )
      }
    />
  )
}

export default NotifierOffersPage
