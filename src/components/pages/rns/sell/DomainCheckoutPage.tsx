import { createStyles, makeStyles, Theme } from '@material-ui/core';
import ItemDetailRow from 'components/molecules/ItemDetailRow';
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'rifui';
import { Card, CardActions, CardContent, CardHeader } from 'rifui/components/atoms/card';
import { colors } from 'rifui/theme';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: 491,
      height: "fit-content",
      padding: 80,
      paddingTop: 44,
      paddingBottom: 69,

      background: colors.white,
      border: `1px solid ${colors.gray1}`,
      boxSizing: 'border-box',
      boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',

      alignItems: 'center',
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifySelf: 'center',
    },
    contentDetails: {
      display: 'flex',
      flexDirection: 'column',
      width: 300,
    },
    contentTitle: {
      marginBottom: theme.spacing(1),
      textAlign: 'center',
    },
    footer: {
      alignContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    },
    footerCaptions: {
      marginBottom: theme.spacing(1)
    },
  }),
);

const DomainsCheckoutPage = () => {
  const history = useHistory();
  const {
    state: { currentOrder },
    dispatch
  } = useContext(MarketStore)
  const classes = useStyles();

  useEffect(() => {
    if (!currentOrder) {
      history.replace(ROUTES.LANDING);
    }
  }, [currentOrder, history])

  if (!currentOrder) return null;


  const {
    item: {
      name,
      expirationDate,
      // price,
      // price_fiat,
      // paymentToken
    },
    isProcessing
  } = currentOrder;

  // const priceCellProps = {
  //     // price,
  //     // price_fiat,
  //     // currency: paymentToken,
  //     currency_fiat: 'USD',
  //     divider: ' '
  // };
  // const PriceCell = <CombinedPriceCell {...priceCellProps} />

  const details = {
    'NAME': name,
    'RENEWAL DATE': (new Date(expirationDate)).toDateString(),
    // 'CURRENCY': 
    // 'PRICE':
    // 'PRICE_FIAT:
  }

  const handleSubmit = () => {
    // TODO: Make transactions
    dispatch({
      type: MARKET_ACTIONS.SELECT_ITEM,
      payload: {
        ...currentOrder,
        isProcessing: true
      }
    })
    setTimeout(() => {
      history.replace(ROUTES.DONE.DOMAINS)
    }, 5000)
  }
  return (
    <CheckoutPageTemplate
      className='domains-checkout-page'
      backButtonProps={{
        backTo: 'domains',
        onClick: () => { }
      }}
    >
      <Card
        className={classes.card}
      >
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Listing ${name}`} />
        {!!currentOrder && currentOrder.isProcessing && <CardHeader titleTypographyProps={{ variant: 'h1', color: 'error' }} title={`TIMEOUT 5s ONLY`} />}
        <CardContent>
          <div className={classes.contentDetails}>
            {
              Object.keys(details).map((name, i) => {
                return <ItemDetailRow name={name} value={details[name]} key={'idr-' + name + i} />
              })
            }

          </div>
        </CardContent>
        {!isProcessing &&
          <CardActions className={classes.footer}>
            <p>Your wallet will open and you will be asked to confirm the transaction for listing the domain.</p>
            <Button color='primary' variant='contained'
              rounded shadow onClick={handleSubmit}>List domain</Button>
          </CardActions>
        }
      </Card>
      {!!currentOrder && currentOrder.isProcessing && <TransactionInProgressPanel text='Listing the domain!' progMsg='The waiting period is required to securely list your domain. Please do not close this tab until the process has finished' />}
    </CheckoutPageTemplate >
  );
};

export default DomainsCheckoutPage;