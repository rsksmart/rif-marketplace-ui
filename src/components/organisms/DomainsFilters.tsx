import { MarketListingTypes } from 'models/Market';
import React, { useContext } from 'react';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import RangeFilter from './filters/RangeFilter';
import SearchFilter from './filters/SearchFilter';
import { Grid, Typography, SwitchTabs } from 'rifui';
import { makeStyles, Theme } from '@material-ui/core';
import SelectFilter from './filters/SelectFilter';
import Logger from 'utils/Logger';

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  formHeading: {
    paddingBottom: theme.spacing(2)
  }
}));

const DomainsFilters = () => {
  const classes = useStyles();
  const {
    state: {
      filters: {
        domainListing: {
          sellerDomain: {
            $like: searchValue,
          },
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          }
        }
      }
    },
    dispatch
  } = useContext(MarketStore);

  const handleSwitchChange = (newSwitchValue: number) => console.log(`New switch value: ${newSwitchValue}`);

  return (
    <>
      <Grid className={classes.formHeading} container>
        <Grid item md={6}>
          <Typography weight='bold' variant='h6' color='primary'>
            Domains
                  </Typography>
        </Grid>
        <Grid style={{ display: 'flex', alignSelf: 'center' }} item md={6}>
          <SwitchTabs label1='Buy' label2='Sell' onChange={handleSwitchChange} />
        </Grid>
      </Grid>

      <SearchFilter
        value={searchValue}
        onChange={(evt) => {
          const { currentTarget: { value } } = evt;
          dispatch({
            type: MARKET_ACTIONS.SET_FILTER,
            payload: {
              listingType: MarketListingTypes.domainListing,
              filterItems: {
                sellerDomain: {
                  $like: value
                }
              }
            }
          })
        }}
      />
      <RangeFilter
        title='Price'
        values={{
          start: minPrice,
          end: maxPrice,
        }}
        hedgeValues={{
          min: 0,  // TODO: to be defined (get min value from the cache server?)
          max: 100, // TODO: to be defined (get max value from the cache server?)
        }}
        unit='RIF'
        handleChange={({ min, max }) => {
          dispatch({
            type: MARKET_ACTIONS.SET_FILTER,
            payload: {
              listingType: MarketListingTypes.domainListing,
              filterItems: {
                price: {
                  $gte: min,
                  $lte: max,
                }
              }
            }
          })
        }}
      />
      <SelectFilter
        title='Currency'
        onClick={(evt) => {
          logger.error('Currency filter is not attached to the cache.')
          // dispatch({
          //     type: MARKET_ACTIONS.SET_FILTER,
          //     payload: {
          //         listingType: MarketListingTypes.domainListing,
          //     }
          // })
        }}
        items={[
          {
            checked: false,
            id: 'check-rif',
            labelText: 'RIF',
          },
          {
            checked: false,
            id: 'check-rbtc',
            labelText: 'RBTC',
          },
          {
            checked: false,
            id: 'check-doc',
            labelText: 'DOC',
          },
        ]} />
    </>
  )
}

export default DomainsFilters;