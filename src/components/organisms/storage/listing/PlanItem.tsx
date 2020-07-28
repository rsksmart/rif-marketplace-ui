import React, { FC, useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import { colors } from '@rsksmart/rif-ui'
import { StoragePlanItem, StorageListingStoreProps } from 'store/Market/storage/interfaces'
import StorageListingStore from 'store/Market/storage/ListingStore'
import { mayBePluralize } from 'utils/utils'
import { RemoveItemPayload } from 'store/Market/storage/listingActions'
import ShortenTextTooltip from 'components/molecules/ShortenTextTooltip'
import TooltipIconButton from 'components/molecules/TooltipIconButton'

export interface PlanItemProps {
  onEditClick: () => void
  planItem: StoragePlanItem
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

const PlanItem: FC<PlanItemProps> = ({ planItem, onEditClick }) => {
  const { dispatch } = useContext<StorageListingStoreProps>(StorageListingStore)
  const classes = useStyles()

  const { monthsDuration, pricePerGb } = planItem

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
        >
          <Grid item xs={12} sm={6} className={classes.leftContent}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography component="div">
                  <Box fontWeight="fontWeightMedium" textAlign="center" color={`${colors.gray5}`}>
                    {mayBePluralize(monthsDuration, 'month')}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography align="center" color="primary">
                  {pricePerGb}
                  {' '}
                  RIF
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography align="center" color="secondary">
                  {pricePerGb}
                  {' '}
                  USD
                </Typography>
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
                    <ShortenTextTooltip value={(pricePerGb / monthsDuration).toString()} maxLength={5} />
                    {' '}
                    RIF
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography align="center" color="textSecondary">1234 USD</Typography>
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
