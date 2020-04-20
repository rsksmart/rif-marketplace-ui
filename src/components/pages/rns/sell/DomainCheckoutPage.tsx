import { createStyles, makeStyles, Theme } from '@material-ui/core';
import PriceItem from 'components/atoms/PriceItem';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, Select, Table, TableBody, TableCell, TableRow, UnitsInput } from 'rifui';
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
    setPrice: {
      border: 'solid 0.1px black',
      maxWidth: '5em',
    },
    detailKey: {
      border: 'none',
    },
    detailValue: {
      border: 'none',
    }
  }),
);

const DomainsCheckoutPage = () => {
  const history = useHistory();
  const {
    state: { currentOrder },
    dispatch
  } = useContext(MarketStore)
  const classes = useStyles();


  const currenyOptions = ['RIF', 'DOC', 'RBTC'];

  const [price, setPrice] = useState('');
  const [priceFiat, setPriceFiat] = useState('');
  const [currency, setCurrency] = useState('0');
  const currencyFiat = 'USD';

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
    },
    isProcessing
  } = currentOrder;

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

  const handlePriceChange = (event) => {
    const { target: { value: newValue } } = event;
    const newValueInt = parseInt(newValue);
    if (newValueInt || newValue === '') {
      setPrice(newValue);
      const newValueInFiat = newValueInt;
      setPriceFiat(newValueInFiat.toString())
    }
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
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.detailKey}>NAME</TableCell>
                  <TableCell className={classes.detailValue}>{name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.detailKey}>RENEWAL DATE</TableCell>
                  <TableCell className={classes.detailValue}>
                    {(new Date(expirationDate)).toDateString()}
                  </TableCell>
                </TableRow>
                {isProcessing &&
                  <TableRow>
                    <TableCell className={classes.detailKey}>PRICE</TableCell>
                    <TableCell className={classes.detailValue}>
                      <CombinedPriceCell {...{
                        price: `${price}`,
                        priceFiat: `${priceFiat}`,
                        currency,
                        currencyFiat: 'USD',
                        divider: ' '
                      }} />
                    </TableCell>
                  </TableRow>
                }
                {!isProcessing && <>
                  <TableRow>
                    <TableCell className={classes.detailKey}>CURRENCY</TableCell>
                    <TableCell className={`${classes.detailValue} ${classes.setPrice}`}>
                      <Select
                        labelId="currency-select"
                        id="currency-select"
                        value={currency}
                        onChange={({ target: { value } }) => {
                          console.log('set currency event:', value);
                          setCurrency(value as string);
                        }
                        }
                      >
                        {currenyOptions.map((currency, i) => <MenuItem key={currency} value={i}>{currency}</MenuItem>)}
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.detailKey}>SET PRICE</TableCell>
                    <TableCell className={`${classes.detailValue} ${classes.setPrice}`}>
                      <UnitsInput
                        handleOnChange={handlePriceChange}
                        handleOnBlur={() => { }}
                        units={currenyOptions[parseInt(currency)]}
                        value={price}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.detailKey}>USD PRICE</TableCell>
                    <TableCell className={classes.detailValue}>
                      <PriceItem type='fiat' price={`${priceFiat}`} currency={currencyFiat} />
                    </TableCell>
                  </TableRow>
                </>}
              </TableBody>
            </Table>

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
      {isProcessing && <TransactionInProgressPanel text='Listing the domain!' progMsg='The waiting period is required to securely list your domain. Please do not close this tab until the process has finished' />}
    </CheckoutPageTemplate >
  );
};

export default DomainsCheckoutPage;