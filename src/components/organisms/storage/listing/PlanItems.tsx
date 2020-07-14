import React, { FC } from 'react'
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { colors } from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core/styles';
import EditablePlan from 'components/molecules/storage/listing/EditablePlan';
import PlanItem from 'components/molecules/storage/listing/PlanItem';

export interface PlanItemsProps { }

const useStyles = makeStyles((theme: Theme) => ({
  subscriptionCreator: {
    alignItems: 'center'
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px'
  },
  storagePlans: {
    alignItems: 'center'
  }
}))

const PlanItems: FC<PlanItemsProps> = props => {
  const classes = useStyles()

  return (
    <>
      {/* SET PLAN PRICES */}
      <Grid item xs={12}>
        <Typography color='secondary' variant='subtitle1'>SET PLAN PRICES</Typography>
        <EditablePlan />
      </Grid>
      {/* STORAGE PLANS */}
      <Grid item xs={12}>
        <Typography gutterBottom color='secondary' variant='subtitle1'>STORAGE PLANS</Typography>
        <Grid className={classes.storagePlans} container spacing={2}>
          <PlanItem duration={'1 month'} rifPrice={12345} />
        </Grid>
      </Grid>
    </>
  )
}

export default PlanItems


