import React, {
  useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import EditablePlanItem from 'components/organisms/storage/sell/EditablePlanItem'
import { StoragePlanItem } from 'context/Services/storage/interfaces'
import PlanItemWithEdit from 'components/organisms/storage/sell/PlanItemWithEdit'
import StorageListingContext from 'context/Services/storage/ListingContext'
import MarketContext from 'context/Market/MarketContext'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { colors, fonts } from '@rsksmart/rif-ui'

const useStyles = makeStyles((theme: Theme) => ({
  plansList: {
    marginTop: theme.spacing(3),
    borderTop: `1px solid ${colors.gray3}`,
    padding: theme.spacing(3, 0)
  },
  listTitle: {
    fontSize: fonts.size.medium,
    marginRight: theme.spacing(1)
  },
  listTitleContainer: {
    marginBottom: theme.spacing(2)
  }
}))


const PlanItemsList = () => {

  const classes = useStyles()
  const {
    state: {
      planItems,
      availablePeriods,
    },
  } = useContext(StorageListingContext)

  const {
    state: {
      exchangeRates: {
        currentFiat: { displayName: fiatDisplayName },
        crypto,
      },
    },
  } = useContext(MarketContext)

  // TODO: handle multicurrency options
  const currency = 'RBTC'
  const { rate: fiatXR } = crypto[currency.toLowerCase()]

  return (
    <>
      {/* SET PLAN PRICES */}
      {
        !!availablePeriods.length
        && (
          <Grid item xs={12}>
            <EditablePlanItem fiatXR={fiatXR} fiatDisplayName={fiatDisplayName} />
          </Grid>
        )
      }
      {/* STORAGE PLANS */}
      {
        !!planItems.length
        && (
          <Grid className={classes.plansList} item xs={12}>
            <Grid container className={classes.listTitleContainer}>
              <Typography className={classes.listTitle} gutterBottom display='inline'>Storage plans added</Typography>
              <Typography display='inline' color='secondary'>All storage plans below will be listed in the marketplace once you click in List storage.</Typography>
            </Grid>
            <Grid alignItems="center" container spacing={2}>
              {
                planItems.sort(
                  (a: StoragePlanItem, b: StoragePlanItem) => (a.timePeriod - b.timePeriod),
                ).map(
                  (planItem: StoragePlanItem) => (
                    <Grid item xs={12} key={planItem.internalId}>
                      <PlanItemWithEdit fiatXR={fiatXR} fiatDisplayName={fiatDisplayName} planItem={planItem} />
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

export default PlanItemsList
