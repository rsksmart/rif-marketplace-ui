import {
  Grid,
} from '@material-ui/core'
import {
  shortenString, Web3Store,
} from '@rsksmart/rif-ui'
import { notifierSubscriptionsAddress } from 'api/rif-marketplace-cache/notifier/subscriptions'
import LabelWithValue from 'components/atoms/LabelWithValue'
import FeatureNotSupportedButton from 'components/atoms/FeatureNotSupportedButton'
import RoundBtn from 'components/atoms/RoundBtn'
import WithLoginCard from 'components/hoc/WithLoginCard'
import InfoBar from 'components/molecules/InfoBar'
import MyOffersHeader from 'components/molecules/MyOffersHeader'
import { PlanViewSummaryProps } from 'components/molecules/plans/PlanViewSummary'
import NotifierDetails, { SubscriptionEventsDisplayItem } from 'components/organisms/notifier/details/NotifierDetailsModal'
import { eventDisplayItemIterator } from 'components/organisms/notifier/details/utils'
import { SubscriptionDetails, subscriptionHeaders } from 'components/organisms/notifier/myoffers/details'
import NotifierProviderDescription, { Profile } from 'components/organisms/notifier/NotifierProviderDescription'
import Staking from 'components/organisms/notifier/Staking'
import PlanView from 'components/organisms/plans/PlanView'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import ProgressOverlay, { ProgressOverlayProps } from 'components/templates/ProgressOverlay'
import AppContext, { AppContextProps } from 'context/App'
import { ConfirmationsContext } from 'context/Confirmations'
import MarketContext from 'context/Market'
import { NotifierOffersContext } from 'context/Services/notifier/offers'
import NotifierContract from 'contracts/notifier/Notifier'
import useErrorReporter from 'hooks/useErrorReporter'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import React, {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { getShortDateString } from 'utils/dateUtils'
import { shortChecksumAddress } from 'utils/stringUtils'
import { getFiatPrice } from 'utils/priceUtils'
import Web3 from 'web3'
import useConfirmations from 'hooks/useConfirmations'
import mapActiveContracts, { activeContractHeaders, ActiveContractItem } from './mapActiveContracts'

const NotifierMyOffersPage: FC = () => {
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
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)
  const {
    state: {
      exchangeRates,
    },
  } = useContext(MarketContext)
  const {
    state: {
      listing: {
        items,
      },
      limits,
    },
    dispatch,
  } = useContext(NotifierOffersContext)
  const pendingConfs = useConfirmations(['NOTIFIER_WITHDRAW_FUNDS'])

  const history = useHistory()

  const [myProfile, setMyProfile] = useState<Profile>()
  const [
    myCustomers,
    setMyCustomers,
  ] = useState<Array<NotifierSubscriptionItem>>([])
  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)
  const [progress, setProgress] = useState<Pick<ProgressOverlayProps, 'title' | 'doneMsg'>>()
  const [txDone, setTxDone] = useState(false)
  const [txInProgress, setTxInProgress] = useState(false)
  const [
    subscriptionDetails,
    setSubscriptionDetails,
  ] = useState<SubscriptionDetails>()
  const [
    subscriptionEvents,
    setSubscriptionEvents,
  ] = useState<Array<SubscriptionEventsDisplayItem>>()

  const onModalClose = (): void => {
    setSubscriptionDetails(undefined)
    setSubscriptionEvents([])
  }

  const reportError = useErrorReporter()

  // Set provider upon wallet connection
  const myOffers = useMemo(() => {
    const offers = items
      .filter(({ provider }) => provider === account)

    if (offers.length) {
      const offer = offers[0]
      setMyProfile({
        address: offer.provider,
        url: offer.url,
      })
    }

    return offers
  }, [
    items,
    account,
  ])

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        provider: account,
        ...limits,
      },
    })
  }, [account, dispatch, limits])

  useEffect(() => {
    if (myProfile && subscriptionsApi) {
      subscriptionsApi.connect(reportError)
      subscriptionsApi.fetch({
        providerId: myProfile.address,
      })
        .then(setMyCustomers)
        .catch((error) => reportError({
          id: 'service-fetch',
          text: 'Error while fetching subscriptions.',
          error,
        }))
    }
  }, [subscriptionsApi, myProfile, reportError])

  useEffect(() => {
    if (account) {
      NotifierContract.getInstance(web3 as Web3)
        .isWhitelistedProvider(account)
        .then((isWhitelisted) => setIsWhitelistedProvider(
          Boolean(isWhitelisted),
        ))
        .catch((error) => reportError({
          error,
          id: 'contract-notifier',
          text: 'Could not determine if the account is whitelisted.',
        }))
    }
  }, [account, web3, reportError])

  const handleEditProfile = (): void => {
    history.push(ROUTES.NOTIFIER.MYOFFERS.EDIT)
  }
  const onWithdraw = ({
    token, price, id,
  }: Pick<NotifierSubscriptionItem, 'token' | 'price' | 'id'>): void => {
    if (account) {
      setProgress({
        title: 'Withdrawing your funds from the contract',
        doneMsg: 'Funds withdrawn',
      })
      setTxInProgress(true)

      NotifierContract.getInstance(web3 as Web3)
        .withdrawFunds(id, token, price, account)
        .then((receipt) => {
          if (receipt) {
            confirmationsDispatch({
              type: 'NEW_REQUEST',
              payload: {
                contractAction: 'NOTIFIER_WITHDRAW_FUNDS',
                txHash: receipt.transactionHash,
              },
            })

            setTxDone(true)
          }
        })
        .catch((error) => {
          reportError({
            error,
            id: 'contract-notifier',
            text: 'Could not withdraw funds from the contract.',
          })
          setTxDone(false)
        })
        .finally(() => {
          setTxInProgress(false)
        })
    }
  }

  const {
    crypto,
    currentFiat: {
      displayName: fiatDisplayName,
    },
  } = exchangeRates

  const onView = (subscriptionId: string): void => {
    const subscription: NotifierSubscriptionItem = myCustomers
      ?.find(({ id }) => id === subscriptionId) as NotifierSubscriptionItem

    if (!subscription) return

    const {
      id,
      consumer,
      notificationBalance,
      plan: { channels },
      expirationDate,
      price,
      token: { symbol: tokenSymbol },
      events,
    } = subscription

    const viewItem: typeof subscriptionDetails = {
      id: shortenString(id),
      customer: shortChecksumAddress(consumer),
      amount: String(notificationBalance),
      channels: channels?.map(({ name }) => name).join(',') || '',
      expDate: getShortDateString(expirationDate),
      price: `${getFiatPrice(price, crypto[tokenSymbol])} ${fiatDisplayName}`,
    }

    setSubscriptionDetails(viewItem)
    setSubscriptionEvents(events.map(eventDisplayItemIterator))
  }

  return (
    <CenteredPageTemplate>
      {/* TODO: grab confirmations */}
      <InfoBar
        isVisible={Boolean(pendingConfs.length)}
        text={`Awaiting confirmations for ${pendingConfs.length} offer(s)`}
        type="info"
      />
      <Staking isEnabled={isWhitelistedProvider} />

      <Grid container spacing={8}>
        <Grid item md={5}>
          {/* Profile description */}
          <NotifierProviderDescription {...{
            account,
            myProfile,
            handleEditProfile,
          }}
          />
        </Grid>
        {/* Header */}
        <MyOffersHeader>
          <FeatureNotSupportedButton>Add Notification Plan</FeatureNotSupportedButton>
        </MyOffersHeader>

        {/* Plans */}
        <Grid container direction="column">
          {
            myOffers.map(({
              id,
              name: offerName,
              limit,
              channels: offerChannels,
              priceOptions: offerPriceOptions,
            }) => {
              const activeContracts: ActiveContractItem[] = mapActiveContracts(
                myCustomers,
                { id, limit },
                exchangeRates,
                { onWithdraw, onView },
              )
              const isTableLoading = false

              const planSummary: Partial<PlanViewSummaryProps> = {
                name: offerName,
                info: [
                  <LabelWithValue key="notifications" label="Notifications" value={String(limit)} />,
                  <LabelWithValue key="channels" label="Channels" value={offerChannels.join(', ')} />,
                  <LabelWithValue
                    key="currency"
                    label="Currency"
                    value={offerPriceOptions
                      .map((option) => option.token.displayName)
                      .join(', ')}
                  />,
                ],
              }

              return (
                <Grid item key={id}>
                  <PlanView {...{
                    summary: planSummary as PlanViewSummaryProps,
                    editButton: <FeatureNotSupportedButton>Edit Plan</FeatureNotSupportedButton>,
                    cancelButton: <FeatureNotSupportedButton>Cancel Plan</FeatureNotSupportedButton>,
                    isTableLoading,
                    headers: activeContractHeaders,
                    activeContracts,
                  }}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </Grid>

      {subscriptionDetails
        && (
          <NotifierDetails
            headers={subscriptionHeaders}
            details={subscriptionDetails}
            events={subscriptionEvents}
            onClose={onModalClose}
            actions={(
              <FeatureNotSupportedButton>
                Cancel plan
              </FeatureNotSupportedButton>
            )}
          />
        )
      }
      {/* Progress Overlay */}
      {progress && (
        <ProgressOverlay
          {...progress}
          inProgress={txInProgress}
          isDone={txDone}
          buttons={[
            <RoundBtn
              onClick={(): void => { setProgress(undefined) }}
            >
              Close
            </RoundBtn>,
          ]}
        />
      )}
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierMyOffersPage,
  title: 'Connect your wallet to see your offers',
  contentText: 'Connect your wallet to get detailed information about your offers',
})
