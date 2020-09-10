import React, { FC, useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import { colors, TooltipIconButton } from '@rsksmart/rif-ui'
import { StoragePlanItem, StorageSellContextProps, TimePeriodEnum } from 'context/Services/storage/interfaces'
import StorageSellContext from 'context/Services/storage/StorageSellContext'
import { RemoveItemPayload } from 'context/Services/storage/storageSellActions'
import { priceDisplay } from 'utils/utils'
import ItemWUnit from 'components/atoms/ItemWUnit'

export interface PlanItemProps {
  className?: string
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
  className = '', planItem, onEditClick, fiatXR, fiatDisplayName,
}) => {
  const { dispatch } = useContext<StorageSellContextProps>(StorageSellContext)

  const classes = useStyles()

  const { timePeriod, pricePerGb, currency } = planItem
  const fiatPrice = (pricePerGb * fiatXR)
  const fiatPriceDisplay = priceDisplay(fiatPrice, 2)

  const onItemRemoved = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: planItem as RemoveItemPayload,
    } as any)
  }

  return (
    <Grid className={className} container alignItems="center" spacing={2}>
      <Grid item xs={9}>
        <Grid
          container
          alignItems="center"
          className={classes.innerContainer}
          spacing={1}
        >
          <Grid xs={6} item>
            <Typography component="div">
              <Box fontWeight="fontWeightMedium" textAlign="center" color={colors.gray5}>
                {TimePeriodEnum[timePeriod]}
              </Box>
            </Typography>
          </Grid>
          <Grid xs={6} item style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ItemWUnit type="mediumPrimary" unit={currency} value={pricePerGb.toString()} />
            <ItemWUnit unit={fiatDisplayName} type="normalGrey" value={fiatPriceDisplay} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="row">
          <TooltipIconButton icon={<EditIcon />} iconButtonProps={{ onClick: onEditClick }} tooltipTitle="Edit item" />
          <TooltipIconButton icon={<ClearIcon />} iconButtonProps={{ onClick: onItemRemoved }} tooltipTitle="Remove item" />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PlanItem
