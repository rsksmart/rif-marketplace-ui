import React, { FC, useContext, useEffect } from 'react';
import MarketFilter from 'components/templates/marketplace/MarketFilter';
import Marketplace, { TableHeaders } from 'components/templates/marketplace/Marketplace';
import { MarketItemType } from 'models/Market';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Web3Store } from '@rsksmart/rif-ui';
import MarketStore from 'store/Market/MarketStore';
import { fetchExchangeRatesFor } from 'api/rif-marketplace-cache/exchangeRateController';
import { MARKET_ACTIONS } from 'store/Market/marketActions';

export interface MarketPageTemplateProps {
  className: string;
  filterItems: React.ReactNode;
  headers: TableHeaders;
  itemCollection: MarketItemType[];
  accountRequired?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  resultsContainer: {
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(3)
    }
  },
  filtersContainer: {
    width: '100%',
  }
}));

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  filterItems,
  itemCollection,
  headers,
  accountRequired,
}) => {
  const classes = useStyles();
  const {
    state: { account },
  } = useContext(Web3Store);
  const {
    state: {
      exchangeRates: {
        currentFiat: { symbol: fiatSymbol },
        crypto: {
          rif
        },
      },
    },
    dispatch
  } = useContext(MarketStore);

  const { rate: rifXr, displayName } = rif;
  useEffect(() => {
    if (!rifXr) {
      fetchExchangeRatesFor('rif', fiatSymbol)
        .then((xr: { [fiatSymbol: string]: number }) => {
          dispatch({
            type: MARKET_ACTIONS.SET_EXCHANGE_RATE,
            payload: {
              rif: {
                rate: xr[fiatSymbol],
                displayName,
              }
            }
          })
        })
    }
  }, [fiatSymbol, rifXr, displayName, dispatch])

  return (
    <Grid container direction='row' className={`${classes.root} ${className}`}>
      {accountRequired && !account && <p>Please sign in to your wallet</p>}
      {(!accountRequired || account) &&
        <>
          <Grid className={classes.filtersContainer} item sm={12} md={3}>
            <MarketFilter>{filterItems}</MarketFilter>
          </Grid>
          <Grid className={classes.resultsContainer} item sm={12} md={9}>
            <Marketplace items={itemCollection} headers={headers} />
          </Grid>
        </>
      }
    </Grid >
  );
};

export default MarketPageTemplate;
