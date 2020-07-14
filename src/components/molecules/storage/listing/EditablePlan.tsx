import React, { FC } from 'react'
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import PlanItem from './PlanItem';
import { colors } from '@rsksmart/rif-ui'
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton'

export interface EditablePlanProps { }

const useStyles = makeStyles((theme: Theme) => ({
  subscriptionCreator: {
    alignItems: 'center'
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px'
  }
}))

const EditablePlan: FC<EditablePlanProps> = props => {
  const classes = useStyles()

  return (
    <Grid className={classes.subscriptionCreator} container spacing={2}>
      <Grid item xs={12}>
        <Typography gutterBottom color='secondary' variant='caption'>Select the subscription period and the price and add a new storage plan to your list</Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          select fullWidth required label='Subscription Period'
          id="subscription-period-select"
          value='1'
        >
          <MenuItem value='1'>1 month</MenuItem>
          <MenuItem value='2'>2 months</MenuItem>
          <MenuItem value='3'>3 months</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={10} md={5}>
        <Grid className={classes.subscriptionCreatorPrice} container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth required label='Price/GB'
              id="price-gb"
              value='2020'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant='caption' color='primary'>RIF</Typography>
                  </InputAdornment>
                ),
                style: { color: colors.primary }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField disabled
              fullWidth label=' '
              id="price-gb"
              value='100'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant='caption' color='secondary'>USD</Typography>
                  </InputAdornment>
                ),
                style: { color: colors.gray4 }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} md={2}>
        <Grid container direction='row'>
          <Tooltip title='Add plan'>
            <IconButton color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='The average price for a monthly suscription is 2020 RIF'>
            <IconButton>
              <InfoIcon color='secondary' />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default EditablePlan

