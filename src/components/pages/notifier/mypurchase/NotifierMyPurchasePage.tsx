import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
  shortenString,
  theme, Web3Store,
} from '@rsksmart/rif-ui'
import { notifierSubscriptionsAddress } from 'api/rif-marketplace-cache/notifier/subscriptions'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import RoundedCard from 'components/atoms/RoundedCard'
import WithLoginCard from 'components/hoc/WithLoginCard'
import InfoBar from 'components/molecules/InfoBar'
import MyPurchasesHeader from 'components/molecules/MyPurchasesHeader'
import PurchasesTable, { MySubscription } from 'components/organisms/notifier/mypurchase/PurchasesTable'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AppContext, { AppContextProps } from 'context/App'
import MarketContext from 'context/Market'
import useConfirmations from 'hooks/useConfirmations'
import useErrorReporter from 'hooks/useErrorReporter'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { getShortDateString } from 'utils/dateUtils'
import { shortChecksumAddress } from 'utils/stringUtils'
import { getFiatPrice } from 'utils/tokenUtils'
import { logNotImplemented } from 'utils/utils'
import { SubscriptionDetails, subscriptionHeaders } from 'components/organisms/notifier/mypurchase/details'
import NotifierDetails, { SubscriptionEventsDisplayItem } from 'components/organisms/notifier/details/NotifierDetailsModal'
import RoundBtn from 'components/atoms/RoundBtn'
import { eventDisplayItemIterator } from 'components/organisms/notifier/details/utils'
import mapMyPurchases from './mapMyPurchases'

const useTitleStyles = makeStyles(() => ({
  root: {
    marginBlockStart: `${theme.spacing(2)}px`,
    marginInlineStart: `${theme.spacing(2)}px`,
  },
}))

const NotifierMyPurchasePage: FC = () => {
  const titleStyles = useTitleStyles()

  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: {
      apis: {
        [notifierSubscriptionsAddress]: subscriptionsApi,
      },
    },
  } = useContext<AppContextProps>(AppContext)
  const {
    state: {
      exchangeRates,
    },
  } = useContext(MarketContext)

  const reportError = useErrorReporter()

  const [
    subscriptions,
    setSubscriptions,
  ] = useState<Array<NotifierSubscriptionItem>>()
  const [
    subscriptionDetails,
    setSubscriptionDetails,
  ] = useState<SubscriptionDetails>()
  const [
    subscriptionEvents,
    setSubscriptionEvents,
  ] = useState<Array<SubscriptionEventsDisplayItem>>()

  const [isTableLoading, setIsTableLoading] = useState<boolean>()

  const numberOfConfs = useConfirmations(
    ['NOTIFIER_CREATE_SUBSCRIPTION'],
  ).length
  const isAwaitingConfs = Boolean(numberOfConfs)

  useEffect(() => {
    if (account && subscriptionsApi) {
      setIsTableLoading(true)
      subscriptionsApi.connect(reportError)
      subscriptionsApi.fetch({
        consumer: account,
      })
        .then(setSubscriptions)
        .catch((error) => reportError(new UIError({
          id: 'service-fetch',
          text: 'Error while fetching subscriptions.',
          error,
        })))
        .finally(() => {
          setIsTableLoading(false)
        })
    }
  }, [subscriptionsApi, account, reportError])

  const {
    crypto,
    currentFiat: {
      displayName: fiatDisplayName,
    },
  } = exchangeRates

  const onView = (subscriptionId: string): void => {
    const subscription: NotifierSubscriptionItem = subscriptions
      ?.find(({ id }) => id === subscriptionId) as NotifierSubscriptionItem

    if (!subscription) return

    const {
      id,
      provider,
      notificationBalance,
      plan: { channels },
      expirationDate,
      price,
      token: { symbol: tokenSymbol },
      events,
    } = subscription

    const viewItem: typeof subscriptionDetails = {
      id: shortenString(id),
      provider: shortChecksumAddress(provider),
      amount: String(notificationBalance),
      channels: channels?.map(({ name }) => name).join(',') || '',
      expDate: getShortDateString(expirationDate),
      price: `${getFiatPrice(price, crypto[tokenSymbol])} ${fiatDisplayName}`,
    }

    setSubscriptionDetails(viewItem)
    setSubscriptionEvents(events.map(eventDisplayItemIterator))
  }

  const onRenew = logNotImplemented('handle renew')

  const items = subscriptions?.map(mapMyPurchases(
    exchangeRates, { onView, onRenew },
  )) || [] as Array<MySubscription>

  const onModalClose = (): void => {
    setSubscriptionDetails(undefined)
    setSubscriptionEvents([])
  }

  return (
    <CenteredPageTemplate>
      <InfoBar
        text={`Awaiting confirmations for ${numberOfConfs} purchase(s)`}
        type="info"
        isVisible={isAwaitingConfs}
      />
      <>
        <MyPurchasesHeader />
        <RoundedCard color="secondary">
          <GridColumn>
            <GridItem>
              <Typography
                gutterBottom
                color="primary"
                variant="subtitle1"
                classes={titleStyles}
              >
                Active plans
              </Typography>
            </GridItem>
            <GridRow>
              <PurchasesTable
                items={items}
                isTableLoading={Boolean(isTableLoading)}
              />
            </GridRow>
          </GridColumn>
        </RoundedCard>
        {subscriptionDetails
          && (
            <NotifierDetails
              headers={subscriptionHeaders}
              details={subscriptionDetails}
              events={subscriptionEvents}
              onClose={onModalClose}
              actions={(
                <RoundBtn onClick={logNotImplemented('cancel handle')}>
                  Cancel plan
                </RoundBtn>
              )}
            />
          )}
      </>
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierMyPurchasePage,
  title: 'Connect your wallet to see your purchases',
  contentText: 'Connect your wallet to get detailed information about your purchases',
})
