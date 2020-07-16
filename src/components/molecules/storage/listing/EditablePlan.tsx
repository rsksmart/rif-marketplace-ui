import React, { FC, useState } from 'react'
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { colors, validatedNumber } from '@rsksmart/rif-ui'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton'
import { StoragePlan } from 'models/marketItems/StorageItem';
import { mayBePluralize } from '../../../../utils/utils'

export interface EditablePlanProps {
  onPlanAdded: (plan: StoragePlan) => void
  availableMonths: number[]
  suggestedMonth?: number
  contractLength: number
  onContractLengthChange: (value: number) => void
}

const useStyles = makeStyles(() => ({
  subscriptionCreator: {
    alignItems: 'center'
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px'
  }
}))

const EditablePlan: FC<EditablePlanProps> = ({ onPlanAdded, availableMonths, contractLength, onContractLengthChange }) => {
  const classes = useStyles()
  const [pricePerGb, setPricePerGb] = useState(0)
  const currency = 'RIF'

  const handleOnAddClick = () => {
    const plan: StoragePlan = {
      pricePerGb,
      monthsDuration: contractLength,
      currency
    }
    onPlanAdded(plan)
  }

  const onPeriodChange = ({ target: { value } }) => {
    onContractLengthChange(Number(value))
  }
  const onPricePerGbChange = ({ target: { value } }) => {
    setPricePerGb(validatedNumber(Number(value)))
  }

  return (
    <Grid className={classes.subscriptionCreator} container spacing={2}>
      <Grid item xs={12}>
        <Typography gutterBottom color='secondary' variant='caption'>Select the subscription period and the price and add a new storage plan to your list</Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          select fullWidth required label='Subscription Period'
          id="subscription-period-select"
          value={contractLength}
          onChange={onPeriodChange}
        >
          {
            availableMonths.sort((a, b) => a - b).map(mo => (
              <MenuItem value={mo} key={mo}>{mayBePluralize(mo, 'month')}</MenuItem>
            ))
          }
        </TextField>
      </Grid>
      <Grid item xs={10} md={5}>
        <Grid className={classes.subscriptionCreatorPrice} container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth required label='Price/GB'
              id="price-gb"
              type='number'
              value={pricePerGb.toString()}
              onChange={onPricePerGbChange}
              error={pricePerGb <= 0}
              inputProps={{
                min: "0"
              }}
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
            <TextField
              disabled
              fullWidth
              label=' '
              id="price-gb-usd"
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
            <span>
              <IconButton
                onClick={handleOnAddClick}
                disabled={pricePerGb <= 0 || availableMonths.indexOf(contractLength) === -1}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </span>
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

