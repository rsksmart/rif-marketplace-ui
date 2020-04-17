import { MarketListingTypes } from 'models/Market';
import React, { FC, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { Grid, Typography, SwitchTabs } from 'rifui';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { useHistory } from 'react-router';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import { ROUTES } from 'routes';



export interface MarketFilterProps {
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filter: {
      background: '#ffffff',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      maxWidth: '20%',
      flex: '1 1 auto',
      padding: theme.spacing(3)
    },
    formHeading: {
      paddingBottom: theme.spacing(2)
    }
  })
)



const MarketFilter: FC<MarketFilterProps> = ({ children }) => {
  const classes = useStyles();
  const {
    state: {
      currentListing
    },
    dispatch
  } = useContext(MarketStore);
  const history = useHistory();
  const txType = currentListing?.txType;

  const handleSwitchChange = (): void => {
    dispatch({
      type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
      payload: {
        txType: txType === TxType.BUY ? TxType.SELL : TxType.BUY
      }
    })
    history.replace(txType === TxType.BUY ? ROUTES.DOMAINS.SELL : ROUTES.DOMAINS.BUY)
  }

  return (
    <div className={classes.filter}>
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
      {children}
    </div>
  );
};

export default MarketFilter;