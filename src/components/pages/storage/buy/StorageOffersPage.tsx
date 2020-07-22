import React, { FC, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Marketplace from 'components/templates/marketplace/Marketplace'
import { colors, SwitchTabs, Typography } from '@rsksmart/rif-ui'
import { useHistory } from 'react-router-dom'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import ROUTES from 'routes'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  resultsContainer: {
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(3),
    },
  },
  filtersContainer: {
    width: '100%',
  },
  // START - MarketFilter classes
  filter: {
    background: colors.white,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    flex: '1 1 auto',
    padding: theme.spacing(3, 3, 0, 3),
    [theme.breakpoints.down('sm')]: {
      maxHeight: '100%',
    },
    [theme.breakpoints.up('md')]: {
      height: '100%',
      minHeight: theme.spacing(60),
    },
  },
  formHeading: {
    paddingBottom: theme.spacing(2),
  },
  switchContainer: {
    alignSelf: 'center',
    display: 'flex',
    width: '100%',
  },
  // END - MarketFilter classes
}))

const StorageOffersPage: FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const headers = {
    provider: 'Provider',
    location: 'Location',
    system: 'System',
    availableSize: 'Available Size',
    subscriptionOptions: 'Subscription Options',
    pricePerGb: 'Price/GB',
    action1: '',
  }
  const itemCollection = []

  const [txType, setTxType] = useState(0)
  // TODO: this will be removed soon as per the buy/sell restructure
  const switchTxType = () => {
    if (!txType) {
      setTxType(1)
      history.replace(ROUTES.STORAGE.SELL)
      return
    }
    setTxType(0)
    history.replace(ROUTES.STORAGE.BUY)
  }

  // TODO: here we will reference to MarketPageTemplate and MarketFilters but for the
  // purpose of showing a preview version we are only adding styles with hardcoded data
  return (
    <Grid container direction="row" className={`${classes.root}`}>
      <>
        <Grid className={classes.filtersContainer} item sm={12} md={3}>
          <div className={classes.filter}>
            <Grid className={classes.formHeading} container>
              <Grid item xs={6}>
                <Typography weight="lightBold" variant="h6" color="primary">Storage</Typography>
              </Grid>
              <Grid className={classes.switchContainer} item xs={6}>
                <SwitchTabs label1="Buy" label2="Sell" value={txType} onChange={switchTxType} />
              </Grid>
            </Grid>
            <StorageFilters />
          </div>
        </Grid>
        <Grid className={classes.resultsContainer} item sm={12} md={9}>
          <Marketplace items={itemCollection} headers={headers} isLoading={false} />
        </Grid>
      </>
    </Grid>
  )
}

export default StorageOffersPage
