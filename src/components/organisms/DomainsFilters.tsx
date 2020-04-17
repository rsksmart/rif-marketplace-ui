import { makeStyles, Theme } from '@material-ui/core';
import { MarketListingTypes } from 'models/Market';
import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { Grid, SwitchTabs, Typography } from 'rifui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import RangeFilter from './filters/RangeFilter';
import SearchFilter from './filters/SearchFilter';
const useStyles = makeStyles((theme: Theme) => ({
  formHeading: {
    paddingBottom: theme.spacing(2)
  },
  switchContainer: {
    alignSelf: 'center',
    display: 'flex',
  }
}));

const DomainsFilters = ({ txType }) => {
  const classes = useStyles();
  const {
    state: {
      filters: {
        domains: {
          name: nameFilter,
          price: priceFilter
        }
      }
    },
    dispatch
  } = useContext(MarketStore);
  const history = useHistory();

  const searchValue = nameFilter && nameFilter.$like;
  const minPrice = priceFilter && priceFilter.$gte;
  const maxPrice = priceFilter && priceFilter.$lte;

  const handleSwitchChange = (): void => {
    dispatch({
      type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
    })
    history.replace(txType === TxType.BUY ? ROUTES.DOMAINS.SELL : ROUTES.DOMAINS.BUY)
  }

  return (
    <>
      <Grid className={classes.formHeading} container>
        <Grid item md={6}>
          <Typography weight='bold' variant='h6' color='primary'>
            Domains
                  </Typography>
        </Grid>
        <Grid style={{ display: 'flex', alignSelf: 'center' }} item md={6}>
          <SwitchTabs label1='Buy' label2='Sell' value={txType} onChange={handleSwitchChange} />
        </Grid>
      </Grid>

      <SearchFilter
        value={searchValue}
        onChange={(evt) => {
          const { currentTarget: { value } } = evt;
          dispatch({
            type: MARKET_ACTIONS.SET_FILTER,
            payload: {
              listingType: MarketListingTypes.DOMAINS,
              filterItems: {
                name: {
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
              listingType: MarketListingTypes.DOMAINS,
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
      {/* <SelectFilter title='Currency' items={currencyItems}/> */}
    </>
  )
}

export default DomainsFilters;