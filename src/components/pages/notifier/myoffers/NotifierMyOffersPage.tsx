/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid,
} from '@material-ui/core'
import {
  Button, Web3Store,
} from '@rsksmart/rif-ui'
import { notifierSubscriptionsAddress } from 'api/rif-marketplace-cache/notifier/subscriptions'
import LabelWithValue from 'components/atoms/LabelWithValue'
import WithLoginCard from 'components/hoc/WithLoginCard'
import InfoBar from 'components/molecules/InfoBar'
import MyOffersHeader from 'components/molecules/MyOffersHeader'
import { PlanViewSummaryProps } from 'components/molecules/plans/PlanViewSummary'
import NotifierProviderDescription, { Profile } from 'components/organisms/notifier/NotifierProviderDescription'
import Staking from 'components/organisms/notifier/Staking'
import PlanView from 'components/organisms/plans/PlanView'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AppContext, { AppContextProps } from 'context/App'
import MarketContext from 'context/Market'
import { NotifierOffersContext } from 'context/Services/notifier/offers'
import NotifierContract from 'contracts/notifier/Notifier'
import useErrorReporter from 'hooks/useErrorReporter'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'
import Web3 from 'web3'
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
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
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

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        provider: account,
        ...limits,
      },
    })
  }, [account, dispatch, limits])

  const reportError = useErrorReporter()

  const [myProfile, setMyProfile] = useState<Profile>()
  const [myCustomers, setMyCustomers] = useState<NotifierSubscriptionItem[]>([])

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
    if (myProfile && subscriptionsApi) {
      subscriptionsApi.connect(reportError)
      subscriptionsApi.fetch({
        providerId: myProfile.address,
      })
        .then(setMyCustomers)
        .catch((error) => reportError(new UIError({
          id: 'service-fetch',
          text: 'Error while fetching subscriptions.',
          error,
        })))
    }
  }, [subscriptionsApi, myProfile, reportError])

  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)

  useEffect(() => {
    if (account) {
      NotifierContract.getInstance(web3 as Web3)
        .isWhitelistedProvider(account)
        .then((isWhitelisted) => setIsWhitelistedProvider(Boolean(isWhitelisted)))
        .catch((error) => reportError({
          error,
          id: 'contract-notifier',
          text: 'Could not determine if the account is whitelisted.',
        }))
    }
  }, [account, web3, reportError])

  const handleAddPlan = () => {}
  const handleEditPlan = () => {}
  const handleCancelPlan = () => {}
  const handleEditProfile = () => {}

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={false}
        text={`Awaiting confirmations for ${false} offer(s)`}
        type="info"
      />
      <Staking isEnabled={isWhitelistedProvider} />

      <Grid container spacing={8}>
        <Grid item md={5}>
          {/* Profile description */ }
          <NotifierProviderDescription {...{ account, myProfile, handleEditProfile }} />
        </Grid>
        {/* Header */ }
        <MyOffersHeader>
          <Button variant="outlined" color="primary" rounded onClick={handleAddPlan}>
            Add notification plan
          </Button>
        </MyOffersHeader>

        {/* Plans */}
        <Grid container direction="column">
          {
            myOffers.map(({
              id: offerId,
              name: offerName,
              limit: offerLimit,
              channels: offerChannels,
              priceOptions: offerPriceOptions,
            }) => {
              const activeContracts: ActiveContractItem[] = mapActiveContracts(
                myCustomers, offerId,
                offerLimit, crypto,
                currentFiat,
              )
              const isPlanEditDisabled = false
              const isPlanCancelDisabled = false
              const isTableLoading = false

              const planSummary: Partial<PlanViewSummaryProps> = {
                name: offerName,
                info: [
                  <LabelWithValue key="notifications" label="Notifications" value={String(offerLimit)} />,
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
                <Grid item key={offerId}>
                  <PlanView {...{
                    summary: planSummary as PlanViewSummaryProps,
                    handlePlanEdit: handleEditPlan,
                    isPlanEditDisabled,
                    handlePlanCancel: handleCancelPlan,
                    isPlanCancelDisabled,
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

      {/* Cancel Offer Progress Overlay */ }
      {/* <ProgressOverlay
        isDone={false}
        inProgress={false}
        title="Canceling your notifier offer"
        doneMsg="Your notifier offer has been canceled"
        buttons={[
          <RoundBtn
            onClick={() => {}}
          >
            Close
          </RoundBtn>,
        ]}
      /> */}
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierMyOffersPage,
  title: 'Connect your wallet to see your offers',
  contentText: 'Connect your wallet to get detailed information about your offers',
})
