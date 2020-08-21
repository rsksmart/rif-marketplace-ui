import React, { FC, useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import { colors } from '@rsksmart/rif-ui'
import { StoragePlanItem, StorageListingContextProps, TimePeriodEnum } from 'context/Services/storage/interfaces'
import StorageListingContext from 'context/Services/storage/ListingContext'
import { RemoveItemPayload } from 'context/Services/storage/listingActions'
import TooltipIconButton from 'components/molecules/TooltipIconButton'
import PriceItem from 'components/atoms/PriceItem'
import { priceDisplay } from 'utils/utils'

export interface PlanItemProps {
  onEditClick: () => void
  planItem: StoragePlanItem
  fiatXR: number
  fiatDisplayName: string
}

const useStyles = makeStyles((theme: Theme) => ({
  innerContainer: {
    backgroundColor: colors.gray1,
    borderRadius: 5,
    padding: theme.spacing(2),
  },
  leftContent: {
    [theme.breakpoints.up('sm')]: {
      borderRight: `1px solid ${colors.gray3}`,
    },
  },
}))

const PlanItem: FC<PlanItemProps> = ({
  planItem, onEditClick, fiatXR, fiatDisplayName,
}) => {
  const { dispatch, state: { currency } } = useContext<StorageListingContextProps>(StorageListingContext)

  const classes = useStyles()

  const { timePeriod, pricePerGb } = planItem
  const fiatPrice = (pricePerGb * fiatXR)
  const fiatPriceDisplay = priceDisplay(fiatPrice, 2)
  const fiatMonthlyFee = priceDisplay(fiatPrice / (timePeriod / 30), 2)
  const criptoMonthlyFee = priceDisplay(pricePerGb / (timePeriod / 30))

  const onItemRemoved = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: planItem as RemoveItemPayload,
    } as any)
  }

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={10}>
        <Grid
          container
          alignItems="center"
          className={classes.innerContainer}
          spacing={1}
        >
          <Grid item xs={12} sm={6} className={classes.leftContent}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" textAlign="center" color={`${colors.gray5}`}>
                    {TimePeriodEnum[timePeriod]}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <PriceItem type="crypto" currency={currency} price={`${pricePerGb}`} />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <PriceItem currency={fiatDisplayName} type="fiat" price={fiatPriceDisplay} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography component="div" variant="caption" color="textSecondary">
                  <Box textAlign="center">Monthly fee</Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography component="div">
                  <Box textAlign="center" color={`${colors.gray5}`}>
                    <PriceItem currency={currency} type="crypto" price={criptoMonthlyFee} />
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <PriceItem currency={fiatDisplayName} type="fiat" price={fiatMonthlyFee} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Grid container direction="row">
          <TooltipIconButton icon={<EditIcon />} iconButtonProps={{ onClick: onEditClick }} tooltipTitle="Edit item" />
          <TooltipIconButton icon={<ClearIcon />} iconButtonProps={{ onClick: onItemRemoved }} tooltipTitle="Remove item" />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PlanItem
