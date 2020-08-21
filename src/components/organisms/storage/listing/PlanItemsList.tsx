import React, {
  useContext,
} from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import EditablePlanItem from 'components/organisms/storage/listing/EditablePlanItem'
import { StoragePlanItem } from 'context/Services/storage/interfaces'
import PlanItemWithEdit from 'components/organisms/storage/listing/PlanItemWithEdit'
import StorageListingContext from 'context/Services/storage/ListingContext'
import MarketContext from 'context/Market/MarketContext'

const PlanItemsList = () => {
  const {
    state: {
      planItems,
      availablePeriods,
      currency,
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

  const { rate: fiatXR } = crypto[currency.toLowerCase()]

  return (
    <>
      {/* SET PLAN PRICES */}
      {
        !!availablePeriods.length
        && (
          <Grid item xs={12}>
            <Typography color="secondary" variant="subtitle1">SET PLAN PRICES</Typography>
            <EditablePlanItem fiatXR={fiatXR} fiatDisplayName={fiatDisplayName} />
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
