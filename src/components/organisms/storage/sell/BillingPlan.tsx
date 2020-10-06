import React, { FC, useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ClearIcon from '@material-ui/icons/Clear'
import EditIcon from '@material-ui/icons/Edit'
import { colors, TooltipIconButton } from '@rsksmart/rif-ui'
import { StorageBillingPlan, OfferEditContextProps } from 'context/Market/storage/interfaces'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { RemoveItemPayload } from 'context/Market/storage/offerEditActions'
import { priceDisplay } from 'utils/utils'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { MarketCryptoRecord } from 'models/Market'

export interface BillingPlanProps {
  className?: string
  onEditClick: () => void
  billingPlan: StorageBillingPlan
  cryptoXRs: MarketCryptoRecord
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

const BillingPlan: FC<BillingPlanProps> = ({
  className = '', billingPlan, onEditClick, cryptoXRs, fiatDisplayName,
}) => {
  const { dispatch } = useContext<OfferEditContextProps>(OfferEditContext)

  const classes = useStyles()

  const { period, price, currency } = billingPlan
  const { rate } = cryptoXRs[currency.toLowerCase()]
  const fiatPrice = (price.mul(rate))

  const fiatPriceDisplay = priceDisplay(fiatPrice, 2)

  const onItemRemoved = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: billingPlan as RemoveItemPayload,
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
                {period}
              </Box>
            </Typography>
          </Grid>
          <Grid xs={6} item style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ItemWUnit type="mediumPrimary" unit={currency.toUpperCase()} value={price.toString()} />
            <ItemWUnit unit={fiatDisplayName.toUpperCase()} type="normalGrey" value={fiatPriceDisplay} />
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

export default BillingPlan
