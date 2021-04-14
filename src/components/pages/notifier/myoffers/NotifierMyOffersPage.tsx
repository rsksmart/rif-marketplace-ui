/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, Typography,
} from '@material-ui/core'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import {
  Button, CopyTextTooltip, shortenString, TooltipIconButton, Web3Store,
} from '@rsksmart/rif-ui'
import NotifierService from 'api/rif-notifier-service'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import LabelWithValue from 'components/atoms/LabelWithValue'
import WithLoginCard from 'components/hoc/WithLoginCard'
import DescriptionCard from 'components/molecules/DescriptionCard'
import InfoBar from 'components/molecules/InfoBar'
import { PlanViewSummaryProps } from 'components/molecules/plans/PlanViewSummary'
import RifAddress from 'components/molecules/RifAddress'
import PlanView from 'components/organisms/plans/PlanView'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import AppContext, { AppContextProps } from 'context/App'
import withNotifierOffersContext, { NotifierOffersContext } from 'context/Services/notifier/offers'
import React, {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'

const NotifierMyOffersPage: FC = () => {
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: { apis },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const {
    state: {
      listing: {
        items,
      },
    },
    dispatch,
  } = useContext(NotifierOffersContext)

  useEffect(() => {
    dispatch({
      type: 'FILTER',
      payload: {
        provider: account,
      },
    })
  }, [account])

  type Profile = { address: string, url: string } | undefined
  const [myProfile, setMyProfile] = useState<Profile>()
  const [myCustomers, setMyCustomers] = useState()

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
    if (myProfile?.url) {
      appDispatch({
        type: 'SET_SERVICE',
        payload: new NotifierService(myProfile.url),
      })
    }
  }, [myProfile])

  // useEffect(() => {
  //   if (myProfile && apis[myProfile.url]) {
  //     const notifierApi: NotifierAPIService = apis[myProfile.url]

  //     notifierApi.getSubscriptions(myProfile.address)
  //     .then((subscriptions) => setMyCustomers(subscriptions))
  //   }
  // }, [apis, myProfile])

  // const history = useHistory()
  // const {
  //   state: appState,
  //   dispatch: appDispatch,
  // } = useContext<AppContextProps>(AppContext)
  // const reportError = useCallback((
  //   e: UIError,
  // ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const headers = {
    customer: 'Customer',
    limit: 'Notifications',
    expDate: 'Expiration date',
    price: 'Price',
    funds: 'Available funds',
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
              daysLeft: offerDaysLeft,
            }) => {
              const activeContracts = []
              const isPlanEditDisabled = false
              const isPlanCancelDisabled = false
              const isTableLoading = false

              const planSummary: PlanViewSummaryProps = {
                name: offerName,
                info: [
                  <LabelWithValue label="Notifications" value={String(offerLimit)} />,
                  <LabelWithValue label="Channels" value={offerChannels.join(', ')} />,
                  <LabelWithValue
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
                    summary: planSummary,
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
  WrappedComponent: withNotifierOffersContext(NotifierMyOffersPage),
  title: 'Connect your wallet to see your offers',
  contentText: 'Connect your wallet to get detailed information about your offers',
})
