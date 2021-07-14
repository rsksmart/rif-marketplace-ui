import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
  shortenString, Web3Store, Spinner, TooltipIconButton,
} from '@rsksmart/rif-ui'
import { notifierSubscriptionsAddress } from 'api/rif-marketplace-cache/notifier/subscriptions'
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
  useCallback,
} from 'react'
import { getShortDateString } from 'utils/dateUtils'
import { shortChecksumAddress } from 'utils/stringUtils'
import { getFiatPrice } from 'utils/priceUtils'
import { logNotImplemented } from 'utils/utils'
import { SubscriptionDetails, subscriptionHeaders } from 'components/organisms/notifier/mypurchase/details'
import NotifierDetails, { SubscriptionEventsDisplayItem } from 'components/organisms/notifier/details/NotifierDetailsModal'
import RoundBtn from 'components/atoms/RoundBtn'
import { eventDisplayItemIterator } from 'components/organisms/notifier/details/utils'
import { SUBSCRIPTION_STATUSES } from 'api/rif-notifier-service/models/subscriptions'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import ROUTES from 'routes'
import NotifierContract from 'contracts/notifier/Notifier'
import Web3 from 'web3'
import { convertToWeiString } from 'utils/parsers'
import { useHistory } from 'react-router-dom'
import { ConfirmationsContext } from 'context/Confirmations'
import { getOrCreateRenewalSubscription } from 'api/rif-notifier-service/subscriptionUtils'
import Box from '@material-ui/core/Box'
import GridItem from 'components/atoms/GridItem'
import RefreshIcon from '@material-ui/icons/Refresh'
import mapMyPurchases from './mapMyPurchases'

const useStyles = makeStyles((theme: Theme) => ({
  titleContainer: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  refreshContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}))

const NotifierMyPurchasePage: FC = () => {
  const classes = useStyles()

  const {
    state: { account, web3 },
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
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)

  const history = useHistory()
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

  const [isProcessingTx, setIsProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)

  const numberOfConfs = useConfirmations(
    ['NOTIFIER_CREATE_SUBSCRIPTION'],
  ).length
  const isAwaitingConfs = Boolean(numberOfConfs)

  const fetchSubscriptions = useCallback(() => {
    if (account && subscriptionsApi) {
      setIsLoadingData(true)
      subscriptionsApi.connect(reportError)
      subscriptionsApi.fetch({
        consumer: account,
        status: {
          $ne: SUBSCRIPTION_STATUSES.PENDING,
        },
      })
        .then((incomingSubscriptions: Array<NotifierSubscriptionItem>) => {
          const prevSubsMap = incomingSubscriptions.reduce((acc,
            sub) => ({ ...acc, [sub.previousSubscription]: sub }),
          {})

          const filtered = incomingSubscriptions.filter(
            ({ id }) => !prevSubsMap[id],
          )

          setSubscriptions(Object.values(filtered))
        })
        .catch((error) => reportError(new UIError({
          id: 'service-fetch',
          text: 'Error while fetching subscriptions.',
          error,
        })))
        .finally(() => {
          setIsLoadingData(false)
        })
    }
  }, [subscriptionsApi, account, reportError])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

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
      notificationBalance,
      plan: { channels },
      expirationDate,
      price,
      token: { symbol: tokenSymbol },
      events,
      provider,
    } = subscription
    const { provider: providerAddress } = provider

    const viewItem: typeof subscriptionDetails = {
      id: shortenString(id),
      provider: shortChecksumAddress(providerAddress),
      amount: String(notificationBalance),
      channels: channels?.map(({ name }) => name).join(',') || '',
      expDate: getShortDateString(expirationDate),
      price: `${getFiatPrice(price, crypto[tokenSymbol])} ${fiatDisplayName}`,
    }

    setSubscriptionDetails(viewItem)
    setSubscriptionEvents(events.map(eventDisplayItemIterator))
  }

  const onRenew = async (subscriptionId: string): Promise<void> => {
    const subscription: NotifierSubscriptionItem = subscriptions
      ?.find(({ id }) => id === subscriptionId) as NotifierSubscriptionItem

    if (!subscription || !account) return

    try {
      setIsProcessingTx(true)
      const {
        id: subscriptionHash,
        plan: { planId },
        price,
        token: { symbol: tokenSymbol, tokenAddress },
        provider: { provider: providerAddress, url: providerUrl },
      } = subscription

      const response = await getOrCreateRenewalSubscription(
        subscriptionHash, {
          value: price, symbol: tokenSymbol, planId, url: providerUrl,
        }, account, reportError,
      )

      const { hash: renewalHash, signature } = response

      const purchaseReceipt = await NotifierContract.getInstance(web3 as Web3)
        .createSubscription(
          {
            subscriptionHash: renewalHash,
            providerAddress,
            signature,
            amount: price,
            tokenAddress,
          },
          {
            from: account,
            value: convertToWeiString(price),
          },
        )

      if (purchaseReceipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'NOTIFIER_CREATE_SUBSCRIPTION',
            txHash: purchaseReceipt.transactionHash,
          },
        })
      }
    } catch (error) {
      const { customMessage } = error
      reportError({
        error,
        id: 'contract-notifier',
        text: customMessage || 'Could not complete the order',
      })
    } finally {
      setIsProcessingTx(false)
    }
  }

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
          <GridRow className={classes.titleContainer}>
            <GridItem md={4}>
              <Typography
                gutterBottom
                color="primary"
                variant="subtitle1"
              >
                Active plans
              </Typography>
            </GridItem>
            <GridItem
              md={8}
              className={classes.refreshContainer}
            >
              <Typography component="div" align="right">
                <Box
                  color="text.secondary"
                  display="inline"
                >
                  {'Some subscriptions may have been updated '}
                </Box>
                <TooltipIconButton
                  icon={<RefreshIcon />}
                  tooltipTitle="Refresh"
                  iconButtonProps={{
                    onClick: fetchSubscriptions,
                    disabled: isLoadingData,
                  }}
                />
              </Typography>
            </GridItem>
          </GridRow>
          <GridRow>
            {
              isLoadingData
                ? <Spinner />
                : <PurchasesTable items={items} />
            }
          </GridRow>
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
      <ProgressOverlay
        title="Renewing your plan!"
        doneMsg="Your notification plan has been renewed!"
        inProgress={isProcessingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            key="go_to_my_purchases"
            onClick={
              (): void => setTxOperationDone(false)
            }
          >
            View my purchases
          </RoundBtn>,
          <RoundBtn
            key="go_to_list"
            onClick={
              (): void => history.push(ROUTES.NOTIFIER.BUY.BASE)
            }
          >
            View offers listing
          </RoundBtn>,
        ]}
      />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierMyPurchasePage,
  title: 'Connect your wallet to see your purchases',
  contentText: 'Connect your wallet to get detailed information about your purchases',
})
