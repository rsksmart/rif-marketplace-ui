import React, {
  FC, useContext, useState,
} from 'react'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import {
  NotifierOffersContextProps as ContextProps,
  NotifierOffersContext,
} from 'context/Services/notifier/offers'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import NotifierPlanDescription from 'components/organisms/notifier/NotifierPlanDescription'
import MarketContext, { MarketContextProps } from 'context/Market'
import CheckoutStepper from 'components/organisms/notifier/buy/CheckoutStepper'
import { NotifierEventItem } from 'models/marketItems/NotifierEventItem'
import NotifierContract from 'contracts/notifier/Notifier'
import Web3 from 'web3'
import { Web3Store } from '@rsksmart/rif-ui'
import useErrorReporter from 'hooks/useErrorReporter'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'
import ROUTES from 'routes'
import { useHistory } from 'react-router-dom'
import { ConfirmationsContext } from 'context/Confirmations'
import { subscribeToPlan } from 'api/rif-notifier-service/subscriptionBatch'
import {
  NotificationPreference, NotificationServiceType, SubscribeToPlanDTO, TopicDTO, TopicParams, TOPIC_PARAM_TYPES, TOPIC_TYPES,
} from 'api/rif-notifier-service/models/subscriptions'
import { SUPPORTED_EVENTS } from 'config/notifier'
import { convertToWeiString } from 'utils/parsers'
import { OrderItem } from 'context/Services/notifier/offers/interfaces'

const buildSubscribeToPlanDTO = (
  item: OrderItem, eventsAdded: NotifierEventItem[], account: string,
): SubscribeToPlanDTO => {
  const topics: Array<TopicDTO> = []
  const {
    token: { symbol: currencySymbol },
    planId: subscriptionPlanId,
    value: price,
  } = item

  eventsAdded.forEach((eventAdded) => {
    const {
      event: {
        type: eventType, channels, smartContract, name, params,
      },
    } = eventAdded
    const notificationPreferences: Array<NotificationPreference> = []
    channels.forEach((channel) => {
      const notificationPreference: NotificationPreference = {
        notificationService: channel.type as NotificationServiceType,
        destination: channel.destination,
        destinationParams: {
          username: '',
          password: '',
          apiKey: '',
        },
      }
      notificationPreferences.push(notificationPreference)
    })

    if (eventType === SUPPORTED_EVENTS.NEWBLOCK) {
      const topic: TopicDTO = {
        type: TOPIC_TYPES.NEW_BLOCK,
        notificationPreferences,
      }
      topics.push(topic)
    } else if (eventType === SUPPORTED_EVENTS.SMARTCONTRACT) {
      const topicParams: Array<TopicParams> = [
        {
          type: TOPIC_PARAM_TYPES.CONTRACT_ADDRESS,
          value: smartContract as string,
        },
        {
          type: TOPIC_PARAM_TYPES.EVENT_NAME,
          value: name as string,
        },
      ]

      if (params) {
        params.forEach(({
          type: valueType,
          name: paramName,
          indexed: paramIsIndexed,
        }) => {
          const topicParam: TopicParams = {
            type: TOPIC_PARAM_TYPES.EVENT_PARAM,
            value: paramName,
            indexed: paramIsIndexed,
            valueType: valueType.charAt(0).toUpperCase() + valueType.slice(1),
          }
          topicParams.push(topicParam)
        })
      }

      const topic: TopicDTO = {
        type: TOPIC_TYPES.CONTRACT_EVENT,
        notificationPreferences,
        topicParams,
      }
      topics.push(topic)
    }
  })

  const newSubscription: SubscribeToPlanDTO = {
    subscriptionPlanId: Number(subscriptionPlanId),
    userAddress: account,
    price: convertToWeiString(price),
    currency: currencySymbol,
    topics,
  }
  return newSubscription
}

const NotifierOfferCheckoutPage: FC = () => {
  const {
    state: { account, web3 },
  } = useContext(Web3Store)
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
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)

  const {
    state: {
      order,
    },
  } = useContext<ContextProps>(NotifierOffersContext)
  const reportError = useErrorReporter()
  const history = useHistory()

  const [isProcessingTx, setIsProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [eventsAdded, setEventsAdded] = useState<NotifierEventItem[]>([])

  if (!order?.item) return null

  const handleEventItemRemoved = (
    { id: notifierEventId }: NotifierEventItem,
  ): void => {
    const filteredEvents = eventsAdded.filter(
      ({ id }) => id === notifierEventId,
    )
    setEventsAdded(filteredEvents)
  }

  const handleEventItemAdded = (
    eventItem: NotifierEventItem,
  ): void => {
    setEventsAdded([...eventsAdded, eventItem])
  }

  const handleOnBuy = async (): Promise<void> => {
    if (!account) return // should be unreachable if no account is provided
    try {
      setIsProcessingTx(true)

      const { item } = order
      const subscribeToPlanDTO = buildSubscribeToPlanDTO(
        item, eventsAdded, account,
      )
      const {
        url: providerUrl,
        provider: providerAddress,
        value: amount,
        token,
      } = item

      const {
        signature, hash: subscriptionHash,
      } = await subscribeToPlan(providerUrl, subscribeToPlanDTO)

      const purchaseReceipt = await NotifierContract.getInstance(web3 as Web3)
        .createSubscription(
          {
            subscriptionHash,
            providerAddress,
            signature,
            amount,
            token,
          },
          {
            from: account,
            value: convertToWeiString(amount),
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
      reportError({
        error,
        id: 'contract-notifier',
        text: 'Could not complete the order.',
      })
    } finally {
      setIsProcessingTx(false)
    }
  }

  return (
    <CenteredPageTemplate>
      <Grid item xs={11} md="auto">
        <Typography gutterBottom variant="h6" color="primary">
          Notification plan selected
        </Typography>
      </Grid>
      <NotifierPlanDescription {...{ item: order.item, crypto, currentFiat }} />
      <CheckoutStepper
        onBuy={handleOnBuy}
        onEventItemAdded={handleEventItemAdded}
        onEventItemRemoved={handleEventItemRemoved}
        order={order}
        eventsAdded={eventsAdded}
      />
      <ProgressOverlay
        title="Buying your plan!"
        doneMsg="Your notification plan has been bought!"
        inProgress={isProcessingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            key="go_to_my_purchases"
            onClick={
              (): void => history.push(ROUTES.NOTIFIER.MYPURCHASES.BASE)
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

export default NotifierOfferCheckoutPage
