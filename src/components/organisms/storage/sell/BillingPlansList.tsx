import React, {
  useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { StorageBillingPlan } from 'context/Market/storage/interfaces'
import BillingPlanWithEdit from 'components/organisms/storage/sell/BillingPlanWithEdit'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import MarketContext from 'context/Market/MarketContext'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { colors, fonts } from '@rsksmart/rif-ui'
import { BillingPlan, PeriodInSeconds } from 'models/marketItems/StorageItem'
import EditableBillingPlan from './EditableBillingPlan'

const useStyles = makeStyles((theme: Theme) => ({
  editablePlanContainer: {
    marginBottom: theme.spacing(4),
  },
  plansList: {
    marginTop: theme.spacing(2),
    borderTop: `1px solid ${colors.gray3}`,
    padding: theme.spacing(3, 0),
  },
  listTitle: {
    fontSize: fonts.size.medium,
    marginRight: theme.spacing(1),
  },
  listTitleContainer: {
    marginBottom: theme.spacing(2),
  },
}))

const BillingPlansList = () => {
  const classes = useStyles()
  const {
    state: {
      billingPlans,
    },
  } = useContext(OfferEditContext)

  const {
    state: {
      exchangeRates: {
        currentFiat: { displayName: fiatDisplayName },
        crypto: cryptoXRs,
      },
    },
  } = useContext(MarketContext)

  return (
    <>
      <Grid className={classes.editablePlanContainer} item xs={12}>
        <EditableBillingPlan cryptoXRs={cryptoXRs} fiatDisplayName={fiatDisplayName} />
      </Grid>
      {/* STORAGE PLANS */}
      {
        !!billingPlans.length
        && (
          <Grid className={classes.plansList} item xs={12}>
            <Grid container className={classes.listTitleContainer}>
              <Typography className={classes.listTitle} gutterBottom display="inline">Storage plans added</Typography>
              <Typography display="inline" color="secondary">All storage plans below will be listed in the marketplace once you click in List storage.</Typography>
            </Grid>
            <Grid alignItems="center" container spacing={2}>
              {
                billingPlans.sort(
                  ({ period: a }: BillingPlan, { period: b }: BillingPlan) => (
                    PeriodInSeconds[a] - PeriodInSeconds[b]
                  ),
                ).map(
                  (billingPlan: StorageBillingPlan) => (
                    <Grid item xs={12} key={billingPlan.internalId}>
                      <BillingPlanWithEdit
                        cryptoXRs={cryptoXRs}
                        fiatDisplayName={fiatDisplayName}
                        billingPlan={billingPlan}
                      />
                    </Grid>
                  ),
                )
              }
            </Grid>
          </Grid>
        )
      }
    </>
  )
}

export default BillingPlansList
