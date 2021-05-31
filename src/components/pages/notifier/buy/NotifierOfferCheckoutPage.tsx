import React, {
  FC, useContext, useState,
} from 'react'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import { NotifierOffersContextProps as ContextProps, NotifierOffersContext } from 'context/Services/notifier/offers'
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
      // console.log({ order })
      // console.log({ addedEvents: eventsAdded })
      setIsProcessingTx(true)

      const {
        id: subscriptionHash,
        provider: providerAddress,
        value: amount,
        token,
      } = order.item

      const purchaseReceipt = await NotifierContract.getInstance(web3 as Web3)
        .createSubscription(
          {
            subscriptionHash,
            providerAddress,
            signature: '', // TODO: get provider signature of the given hash
            amount,
            token,
          },
          {
            from: account,
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
        // TODO: confirmationsDispatch
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
