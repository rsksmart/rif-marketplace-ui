import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Tooltip, Grid, Typography, MenuItem, TextField, InputAdornment, IconButton,
} from '@material-ui/core'
import { colors } from '@rsksmart/rif-ui'
import AddIcon from '@material-ui/icons/Add'
import InfoIcon from '@material-ui/icons/Info'
import PlanItem from 'components/molecules/storage/PlanItem'

export interface StorageListingPageProps {
  className?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(10),
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  basicSettings: {
    display: 'flex',
    width: '100%',
    maxWidth: '75%',
    marginTop: theme.spacing(2),
  },
  subscriptionCreator: {
    alignItems: 'center',
  },
  subscriptionCreatorPrice: {
    backgroundColor: colors.gray1,
    borderRadius: '5px',
  },
  storagePlans: {
    alignItems: 'center',
  },
}))

const StorageListingPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h5" color="primary">List storage service</Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        Fill out the form below to list your service. All information provided is meant to be true and correct.
      </Typography>
      <Grid className={classes.basicSettings} container spacing={5}>
        {/* GLOBAL SETTINGS */}
        <GlobalSettings />
        {/* SET PLAN PRICES */}
        <Grid item xs={12}>
          <Typography color="secondary" variant="subtitle1">SET PLAN PRICES</Typography>
          <Grid className={classes.subscriptionCreator} container spacing={2}>
            <Grid item xs={12}>
              <Typography gutterBottom color="secondary" variant="caption">Select the subscription period and the price and add a new storage plan to your list</Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                select
                fullWidth
                required
                label="Subscription Period"
                id="subscription-period-select"
                value="1"
              >
                <MenuItem value="1">1 month</MenuItem>
                <MenuItem value="2">2 months</MenuItem>
                <MenuItem value="3">3 months</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={10} md={5}>
              <Grid className={classes.subscriptionCreatorPrice} container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    label="Price/GB"
                    id="price-gb"
                    value="2020"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="primary">RIF</Typography>
                        </InputAdornment>
                      ),
                      style: { color: colors.primary },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled
                    fullWidth
                    label=" "
                    id="price-gb"
                    value="100"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="secondary">USD</Typography>
                        </InputAdornment>
                      ),
                      style: { color: colors.gray4 },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} md={2}>
              <Grid container direction="row">
                <Tooltip title="Add plan">
                  <IconButton color="primary">
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="The average price for a monthly suscription is 2020 RIF">
                  <IconButton>
                    <InfoIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* STORAGE PLANS */}
        <Grid item xs={12}>
          <Typography gutterBottom color="secondary" variant="subtitle1">STORAGE PLANS</Typography>
          <Grid className={classes.storagePlans} container spacing={2}>
            <PlanItem duration="1 month" rifPrice={12345} />
            {/*  */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default StorageListingPage

const GlobalSettings = () => (
  <>
    <Grid item xs={12} md={6}>
      <TextField
        select
        fullWidth
        required
        label="System"
        id="system-select"
        value="IPFS"
      >
        <MenuItem value="IPFS">IPFS</MenuItem>
        <MenuItem value="ASDF">ASDF</MenuItem>
        <MenuItem value="ZXCVB">ZXCVB</MenuItem>
      </TextField>
    </Grid>
    <Grid item xs={12} md={6}>
      <Grid alignItems="center" container spacing={1}>
        <Grid item xs={10}>
          <TextField
            required
            fullWidth
            label="Available Size"
            id="available-size"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="primary">GB</Typography>
                </InputAdornment>
              ),
              style: { color: colors.primary },
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Tooltip title="Different buyers can hire portions of the total size.">
            <InfoIcon color="secondary" />
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} md={6}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={10}>
          <TextField
            select
            fullWidth
            label="Location"
            id="location-select"
            value="ARG"
          >
            <MenuItem value="ARG">ARG</MenuItem>
            <MenuItem value="SVK">SVK</MenuItem>
            <MenuItem value="UYU">UYU</MenuItem>
            <MenuItem value="CZE">CZE</MenuItem>
            <MenuItem value="UKR">UKR</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title="Regulations to use the uploaded content are directly associated to the location.">
            <InfoIcon color="secondary" />
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        select
        fullWidth
        label="Currency"
        id="currency-select"
        value="RIF"
      >
        <MenuItem value="RIF">RIF</MenuItem>
        <MenuItem value="USD">USD</MenuItem>
      </TextField>
    </Grid>
  </>
)
