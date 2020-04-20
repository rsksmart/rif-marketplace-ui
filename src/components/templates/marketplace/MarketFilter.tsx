import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { FC, useContext } from 'react';
import { useHistory } from 'react-router';
import { Grid, SwitchTabs, Typography } from 'rifui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { colors } from 'rifui/theme';

export interface MarketFilterProps {
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filter: {
      background: colors.white,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      maxWidth: '20%',
      flex: '1 1 auto',
      padding: theme.spacing(3, 3, 0, 3),
      [theme.breakpoints.down('sm')]: {
        maxHeight: '100%'
      },
      [theme.breakpoints.up('md')]: {
        height: '100%',
      },
    },
    formHeading: {
      paddingBottom: theme.spacing(2),
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