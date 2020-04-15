import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import ItemDetailRow from 'components/molecules/ItemDetailRow';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from 'rifui';
import { colors } from 'rifui/theme';
import { Web3Store } from 'rifui/providers/Web3Provider';
import { shortenAddress } from 'rifui/utils';

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
  const {
    state: {
      account,
    }
  } = useContext(Web3Store);
  const classes = useStyles();

  useEffect(() => {
    if (!currentOrder) {
      history.replace(ROUTES.DOMAINS);
    }
  }, [currentOrder, history])

  if (!currentOrder) return null;


  const {
    item: {
      sellerDomain,
      sellerAddress,
      expirationDate,
      price,
      price_fiat,
      paymentToken
    },
    isProcessing
  } = currentOrder;

  const shortSeller = shortenAddress(sellerAddress);

  const priceCellProps = { price, price_fiat, currency: paymentToken, currency_fiat: 'USD', divider: ' ' };
  const PriceCell = <CombinedPriceCell {...priceCellProps} />
  const TextCell = text => <Typography color='primary'>{text}</Typography>

  const details = {
    'NAME': TextCell(sellerDomain),
    'SELLER': TextCell(shortSeller),
    'RENEWAL DATE': TextCell((new Date(expirationDate)).toDateString()),
    'PRICE': PriceCell
  }

  const handleSubmit = () => {
    // TODO: Make transactions
    dispatch({
      type: MARKET_ACTIONS.SET_BUY_ITEM,
      payload: {
        ...currentOrder,
        isProcessing: true
      }
    })
    const { txType } = currentOrder;
    history.replace(ROUTES.DONE.replace(':service', 'domains'), { txType })
  }

  console.log('account:', account)
  return (
    <CheckoutPageTemplate
      className='domains-checkout-page'
      backButtonProps={{
        backTo: 'domains',
        onClick: () => { }
      }}
      progressMessage='Completing the purchase!'
    >
      <Card
        className={classes.card}
      >
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Buying ${sellerDomain}`} />
        <CardContent>
          <Typography className={classes.contentTitle} variant='h6' color='secondary'>Domain details</Typography>
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
            <Typography className={classes.footerCaptions} variant='caption' color='secondary'>
              Your wallet will open and you will be asked to confirm the transaction for buying the domain.
            </Typography>
            <Button color='primary' variant='contained'
              rounded shadow onClick={handleSubmit}>
              Buy domain
              </Button>
          </CardActions>
        }
      </Card>
    </CheckoutPageTemplate >
  );
};

export default DomainsCheckoutPage;