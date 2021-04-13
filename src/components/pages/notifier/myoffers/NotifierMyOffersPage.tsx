/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Grid, makeStyles, Paper, Typography,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Divider from '@material-ui/core/Divider'
import TableContainer from '@material-ui/core/TableContainer'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import {
  Button, colors, CopyTextTooltip, shortenString, TooltipIconButton, Web3Store,
} from '@rsksmart/rif-ui'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import LabelWithValue from 'components/atoms/LabelWithValue'
import RoundBtn from 'components/atoms/RoundBtn'
import WithLoginCard from 'components/hoc/WithLoginCard'
import InfoBar from 'components/molecules/InfoBar'
import PlanViewActions from 'components/molecules/plans/PlanViewActions'
import PlanViewSummary from 'components/molecules/plans/PlanViewSummary'
import RifAddress from 'components/molecules/RifAddress'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import Marketplace from 'components/templates/marketplace/Marketplace'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import withNotifierOffersContext, { NotifierOffersContext } from 'context/Services/notifier/offers'
import React, {
  FC, useContext, useEffect, useMemo,
} from 'react'

const useDescriptionStyles = makeStyles({
  root: {
    background: colors.gray1,
    paddingLeft: '41px',
    paddingTop: '18px',
    paddingBottom: '28px',
  },
})

const usePlanStyles = makeStyles({
  root: {
    width: '100%',
    border: `1px solid ${colors.gray3}`,
    borderRadius: 15,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&:last-child': {
      borderRadius: 15,
    },
    '&:first-child': {
      borderRadius: 15,
    },
  },
})

const NotifierMyOffersPage: FC = () => {
  const descriptionClasses = useDescriptionStyles()
  const planViewClasses = usePlanStyles()

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

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={false}
        text={`Awaiting confirmations for ${false} offer(s)`}
        type="info"
      />
      {/* <Staking /> */}

      {/* Profile description */ }
      <Grid container spacing={8}>
        <Grid item md={5}>
          <Paper
            elevation={0}
            classes={{
              root: descriptionClasses.root,
            }}
          >
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
          </Paper>
        </Grid>
        {/* You are providing the following plans to your customers */ }
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
            myOffers.map((offer) => (
              <Grid item key={offer.id}>
                <Accordion
                  classes={{
                    root: planViewClasses.root,
                  }}
                  expanded // FIXME: add isCollapsed
                  onChange={() => {}} // FIXME: add handler
                >
                  <PlanViewSummary
                    name={`Plan ${offer.name}`}
                    left={<LabelWithValue label="Notifications" value={`${offer.limit}`} />}
                    middle={<LabelWithValue label="Channels" value={offer.channels.join(', ')} />}
                    right={(
                      <LabelWithValue
                        label="Currency"
                        value={`${offer.priceOptions
                          .map((option) => option.token.displayName)
                          .join(', ')}`}
                      />
                    )}
                  />
                  <AccordionDetails>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <PlanViewActions
                          editProps={{
                            onClick: () => {},
                            disabled: true,
                          }}
                          cancelProps={{
                            onClick: () => {},
                            disabled: true,
                          }}
                        />
                      </Grid>
                      <Grid item><Divider /></Grid>
                      <Grid item>
                        <Grid container>
                          <TableContainer>
                            <Marketplace
                              headers={[]}
                              isLoading={false}
                              items={items}
                            />
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))
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
