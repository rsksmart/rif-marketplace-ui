import React, {
  FC, useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import EditablePlanItem from 'components/organisms/storage/listing/EditablePlanItem'
import { StoragePlanItem } from 'store/Market/storage/interfaces'
import PlanItemWithEdit from 'components/organisms/storage/listing/PlanItemWithEdit'
import StorageListingStore from 'store/Market/storage/ListingStore'

const PlanItemsList: FC<{}> = () => {
  const { state: { planItems, availableMonths } } = useContext(StorageListingStore)

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
            <Grid alignItems="center" container spacing={2}>
              {
                (planItems.sort(
                  (a: StoragePlanItem, b: StoragePlanItem) => (a.monthsDuration - b.monthsDuration),
                ).map((p: StoragePlanItem) => (
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

export default PlanItemsList
