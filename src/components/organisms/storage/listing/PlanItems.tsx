import React, {
  FC, useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { colors } from '@rsksmart/rif-ui'
import { makeStyles } from '@material-ui/core/styles'
import EditablePlanItem from 'components/molecules/storage/listing/EditablePlanItem'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import PlanItemWithEdit from 'components/organisms/storage/listing/PlanItemWithEdit'
import StorageListingStore from 'store/Market/storage/ListingStore'

const useStyles = makeStyles(() => ({
  subscriptionCreator: {
    alignItems: 'center',
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px',
  },
  storagePlans: {
    alignItems: 'center',
  },
}))

const PlanItems: FC<{}> = () => {
  const { state: { plan } } = useContext(StorageListingStore)
  const planItems = plan?.planItems || []
  const availableMonths = plan?.availableMonths || []

  const classes = useStyles()

  return (
    <>
      {/* SET PLAN PRICES */}
      {
        availableMonths.length > 0
        && (
          <Grid item xs={12}>
            <Typography color="secondary" variant="subtitle1">SET PLAN PRICES</Typography>
            <EditablePlanItem />
          </Grid>
        )
      }
      {/* STORAGE PLANS */}
      {
        planItems.length > 0
        && (
          <Grid item xs={12}>
            <Typography gutterBottom color="secondary" variant="subtitle1">STORAGE PLANS</Typography>
            <Grid className={classes.storagePlans} container spacing={2}>
              {
                (planItems.sort((a, b) => a.monthsDuration - b.monthsDuration).map((p: StoragePlanItem) => (
                  <Grid
                    item
                    xs={12}
                    key={p.internalId}
                  >
                    <PlanItemWithEdit planItem={p} />
                  </Grid>
                )))
              }
            </Grid>
          </Grid>
        )
      }
    </>
  )
}

export default PlanItems
