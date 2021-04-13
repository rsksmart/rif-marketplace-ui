/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, Typography,
} from '@material-ui/core'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import {
  Button, CopyTextTooltip, shortenString, TooltipIconButton, Web3Store,
} from '@rsksmart/rif-ui'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import RoundBtn from 'components/atoms/RoundBtn'
import WithLoginCard from 'components/hoc/WithLoginCard'
import DescriptionCard from 'components/molecules/DescriptionCard'
import InfoBar from 'components/molecules/InfoBar'
import RifAddress from 'components/molecules/RifAddress'
import PlanView from 'components/organisms/plans/PlanView'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import withNotifierOffersContext, { NotifierOffersContext } from 'context/Services/notifier/offers'
import React, {
  FC, useContext, useEffect, useMemo,
} from 'react'

const NotifierMyOffersPage: FC = () => {
  const {
    state: { account },
  } = useContext(Web3Store)
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

  const myOffers = useMemo(() => items
    .filter(({ provider }) => provider === account), [
    items,
    account,
  ])

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
  const handlePlanEdit = () => {}
  const handlePlanCancel = () => {}

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
                      onClick: () => {},
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
                  fullText={myOffers?.[0]?.url || ''}
                  displayElement={(
                    <Typography color="textSecondary" noWrap>
                      {shortenString(myOffers?.[0]?.url.replace(/^http[s]*:\/\//, '') || '', 20, 20)}
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
        >
          <Grid item xs={1}>
            <img src={handProvidingFunds} alt="hand providing funds" />
          </Grid>
          <Grid item xs={9} md="auto">
            <Typography gutterBottom variant="h5" color="primary">
              You are providing the following plans to your customers
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button rounded>Add notification plan</Button>
          </Grid>
        </Grid>

        {/* Plans */}
        <Grid container direction="column">
          {
            myOffers.map(({
              id,
              name,
              limit,
              channels,
              priceOptions,
              daysLeft,
              provider,
              url,
            }) => {
              const activeContracts = []
              const isPlanEditDisabled = false
              const isPlanCancelDisabled = false
              const isTableLoading = false

              const planSummary = {
                name,
                left: { label: 'Notifications', value: String(limit) },
                middle: { label: 'Channels', value: channels.join(', ') },
                right: {
                  label: 'Currency',
                  value: priceOptions
                    .map((option) => option.token.displayName)
                    .join(', '),
                },
              }

              return (
                <Grid item key={id}>
                  <PlanView {...{
                    planSummary,
                    handlePlanEdit,
                    isPlanEditDisabled,
                    handlePlanCancel,
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

      {/* Progress Overlay */ }
      <ProgressOverlay
        isDone={false}
        inProgress={false}
        title="Canceling your storage offer"
        doneMsg="Your storage offer has been canceled"
        buttons={[
          <RoundBtn
            onClick={() => {}}
          >
            Close
          </RoundBtn>,
        ]}
      />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: withNotifierOffersContext(NotifierMyOffersPage),
  title: 'Connect your wallet to see your offers',
  contentText: 'Connect your wallet to get detailed information about your offers',
})
