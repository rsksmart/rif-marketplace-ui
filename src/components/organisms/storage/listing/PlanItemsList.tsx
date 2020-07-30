import React, {
  useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import EditablePlanItem from 'components/organisms/storage/listing/EditablePlanItem'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import PlanItemWithEdit from 'components/organisms/storage/listing/PlanItemWithEdit'
import StorageListingStore from 'store/Market/storage/ListingStore'

const PlanItemsList = () => {
  const {
    state: {
      planItems,
      availablePeriods,
    },
  } = useContext(StorageListingStore)

  return (
    <>
      {/* SET PLAN PRICES */}
      {
        !!availablePeriods.length
        && (
          <Grid item xs={12}>
            <Typography color="secondary" variant="subtitle1">SET PLAN PRICES</Typography>
            <EditablePlanItem />
          </Grid>
        )
      }
      {/* STORAGE PLANS */}
      {
        !!planItems.length
        && (
          <Grid item xs={12}>
            <Typography gutterBottom color="secondary" variant="subtitle1">STORAGE PLANS</Typography>
            <Grid alignItems="center" container spacing={2}>
              {
                planItems.sort(
                  (a: StoragePlanItem, b: StoragePlanItem) => (a.timePeriod - b.timePeriod),
                ).map(
                  (planItem: StoragePlanItem) => (
                    <Grid item xs={12} key={planItem.internalId}>
                      <PlanItemWithEdit planItem={planItem} />
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
