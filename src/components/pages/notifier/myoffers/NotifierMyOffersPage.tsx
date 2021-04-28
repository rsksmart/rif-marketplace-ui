/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, Typography,
} from '@material-ui/core'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import {
  Button, CopyTextTooltip, shortenString, TooltipIconButton, Web3Store,
} from '@rsksmart/rif-ui'
import { notifierSubscriptionsAddress } from 'api/rif-marketplace-cache/notifier/subscriptions'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import LabelWithValue from 'components/atoms/LabelWithValue'
import WithLoginCard from 'components/hoc/WithLoginCard'
import { SelectRowButton } from 'components/molecules'
import DescriptionCard from 'components/molecules/DescriptionCard'
import InfoBar from 'components/molecules/InfoBar'
import { PlanViewSummaryProps } from 'components/molecules/plans/PlanViewSummary'
import RifAddress from 'components/molecules/RifAddress'
import PlanView from 'components/organisms/plans/PlanView'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AppContext, { AppContextProps } from 'context/App'
import MarketContext from 'context/Market'
import { NotifierOffersContext } from 'context/Services/notifier/offers'
import useErrorReporter from 'hooks/useErrorReporter'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'
import { getShortDateString } from 'utils/dateUtils'
import { parseToBigDecimal } from 'utils/parsers'

const NotifierMyOffersPage: FC = () => {
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: {
      apis: {
        [notifierSubscriptionsAddress]: notifierApi,
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

  type Profile = { address: string, url: string } | undefined
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
    if (myProfile && notifierApi) {
      notifierApi.connect(reportError)
      notifierApi.fetch({
        providerId: myProfile.address,
      })
        .then(setMyCustomers)
        .catch((error) => reportError(new UIError({
          id: 'service-fetch',
          text: 'Error while fetching subscriptions.',
          error,
        })))
    }
  }, [notifierApi, myProfile, reportError])

  const headers = {
    customer: 'Customer',
    notifBalance: 'Notifications',
    expDate: 'Expiration date',
    price: 'Price',
    funds: 'Available funds',
    actions: '',
  }
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
      {/* <Staking /> */}

      <Grid container spacing={8}>
        <Grid item md={5}>
          {/* Profile description */ }
          <DescriptionCard>
            <Grid
              container
              spacing={1}
            >
              <Grid item xs={4} md={5}>
                <Typography color="primary" noWrap>Your profile</Typography>
              </Grid>
              <Grid item xs={4} md={7}>
                <Typography color="primary" noWrap>
                  <TooltipIconButton
                    icon={<EditOutlinedIcon />}
                    iconButtonProps={{
                      onClick: handleEditProfile,
                      style: {
                        padding: 0,
                        margin: 0,
                      },
                    }}
                    tooltipTitle="Edit Profile"
                  />
                </Typography>
              </Grid>
              <Grid item xs={4} md={5}>
                <Typography color="textPrimary" noWrap>Provider address</Typography>
              </Grid>
              <Grid item xs={4} md={7}>
                <RifAddress
                  value={account || ''}
                  color="textSecondary"
                  noWrap
                />
              </Grid>
              <Grid item xs={4} md={5}>
                <Typography color="textPrimary" noWrap>End-point URL</Typography>
              </Grid>
              <Grid item xs={4} md={7}>
                <CopyTextTooltip
                  fullText={myProfile?.url || ''}
                  displayElement={(
                    <Typography color="textSecondary" noWrap>
                      {shortenString(myProfile?.url.replace(/^http[s]*:\/\//, '') || '', 20, 20)}
                    </Typography>
                )}
                />
              </Grid>
            </Grid>
          </DescriptionCard>
        </Grid>
        {/* Header */ }
        <Grid
          container
          alignItems="center"
          justify="space-between"
        >
          <Grid
            container
            item
            xs={10}
            alignItems="center"
          >
            <Grid item xs={1}>
              <img src={handProvidingFunds} alt="hand providing funds" />
            </Grid>
            <Grid item xs={11} md="auto">
              <Typography gutterBottom variant="h6" color="primary">
                You are providing the following plans to your customers
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={2}
            justify="flex-end"
          >
            <Button
              variant="outlined"
              color="primary"
              rounded
              onClick={handleAddPlan}
            >
              Add notification plan
            </Button>
          </Grid>
        </Grid>

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
              const activeContracts = myCustomers.filter((customer) => String(customer.subscriptionPlanId) === offerId)
                .map<{[K in keyof typeof headers]: React.ReactElement} & { id: string }>((customer) => ({
                  id: customer.id,
                  customer: (
                    <RifAddress
                      value={customer.consumer}
                      color="textPrimary"
                      variant="body2"
                      noWrap
                    />
                  ),
                  expDate: (
                    <Typography color="textSecondary" variant="body2">
                      { getShortDateString(customer.expirationDate) }
                    </Typography>
                  ),
                  notifBalance: (
                    <Grid container wrap="nowrap">
                      <Grid item>
                        <Typography color="textSecondary" variant="body2">
                          {`${offerLimit - customer.notificationBalance}/${offerLimit}`}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="textPrimary" variant="body2">
                          {` (${customer.notificationBalance} left)`}
                        </Typography>
                      </Grid>
                    </Grid>
                  ),
                  funds: (
                    <Typography color="textSecondary" variant="body2" />
                  ), // TODO: get from SC
                  price: (
                    <Grid container wrap="nowrap">
                      <Grid item>
                        <Typography color="primary" variant="body2">
                          {parseToBigDecimal(customer.price).mul(crypto?.[customer.token.symbol]?.rate)?.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="primary" variant="caption">
                          {currentFiat.displayName}
                        </Typography>
                      </Grid>
                    </Grid>
                  ),
                  actions: (
                    <Grid container spacing={2} justify="flex-end" wrap="nowrap">
                      <Grid item>
                        <SelectRowButton
                          id={customer.id}
                          handleSelect={(): void => {}}
                          variant="outlined"
                        >
                          Withdraw
                        </SelectRowButton>
                      </Grid>
                      <Grid item>
                        <SelectRowButton
                          id={customer.id}
                          handleSelect={(): void => {}}
                          variant="outlined"
                        >
                          View
                        </SelectRowButton>
                      </Grid>
                    </Grid>
                  ),
                }))
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
                    headers,
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
