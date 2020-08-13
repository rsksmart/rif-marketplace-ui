import React, { FC } from 'react'
import Grid from '@material-ui/core/Grid'
import { Theme, makeStyles } from '@material-ui/core/styles'
import Marketplace from 'components/templates/marketplace/Marketplace'
import { colors } from '@rsksmart/rif-ui'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'

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
  // END - MarketFilter classes
}))

const StorageOffersPage: FC = () => {
  const classes = useStyles()

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

  // TODO: here we will reference to MarketPageTemplate and MarketFilters but for the
  // purpose of showing a preview version we are only adding styles with hardcoded data
  // we will move to that once we start fethcing storage offers
  return (
    <Grid container direction="row" className={`${classes.root}`}>
      <>
        <Grid className={classes.filtersContainer} item sm={12} md={3}>
          <div className={classes.filter}>
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
