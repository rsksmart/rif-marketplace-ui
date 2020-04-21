import { CardActions, createStyles, makeStyles, Theme } from '@material-ui/core';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableRow, Typography } from 'rifui';
import { Card, CardContent, CardHeader } from 'rifui/components/atoms/card';
// import { Web3Store } from 'rifui/providers/Web3Provider';
import { shortenAddress } from 'rifui/utils';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { colors } from 'rifui/theme';

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

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifySelf: 'center',
            alignSelf: 'center',
        },
        contentTitle: {
            marginBottom: theme.spacing(1),
            textAlign: 'center',
        },
        footer: {
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            textAlign: 'center'
        },
        contentDetails: {
            width: 300,
            display: 'flex',
            flexDirection: 'column',
        },
        detailKey: {
            border: 'none',
        },
        detailValue: {
            border: 'none',
        }
    }),
);

const DomainOffersCheckoutPage = () => {
    const history = useHistory();
    const {
        state: { currentOrder },
        dispatch
    } = useContext(MarketStore)
    // const {
    //     state: {
    //         account,
    //     }
    // } = useContext(Web3Store);
    const classes = useStyles();

    useEffect(() => {
        if (!currentOrder) {
            history.replace(ROUTES.LANDING);
        }
    }, [currentOrder, history])

    if (!currentOrder) return null;


    const {
        item: {
            domainName,
            sellerAddress,
            expirationDate,
            price,
            priceFiat,
            paymentToken
        },
        isProcessing
    } = currentOrder;

    const shortSeller = shortenAddress(sellerAddress);

    const priceCellProps = { price, priceFiat, currency: paymentToken, currencyFiat: 'USD', divider: ' ' };
    const PriceCell = <CombinedPriceCell {...priceCellProps} />

    const details = {
        'NAME': domainName,
        'SELLER': shortSeller,
        'RENEWAL DATE': (new Date(expirationDate)).toDateString(),
        'PRICE': PriceCell
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
            history.replace(ROUTES.DONE.DOMAIN_OFFERS)
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
                <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Buying ${domainName}`} />
                {!!currentOrder && currentOrder.isProcessing && <CardHeader titleTypographyProps={{ variant: 'h1', color: 'error' }} title={`TIMEOUT 5s ONLY`} />}
                <CardContent>
                    <Typography className={classes.contentTitle} variant='h6' color='secondary'>Domain details</Typography>
                    <Table className={classes.contentDetails}>
                        <TableBody>
                            {Object.keys(details).map((key) => {
                                return <TableRow key={key}>
                                    <TableCell className={classes.detailKey}>{key}</TableCell>
                                    <TableCell className={classes.detailValue}>{details[key]}</TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
                {!isProcessing &&
                    <CardActions className={classes.footer}>
                        <p >Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>
                        <Button color='primary' variant='contained'
                            rounded shadow onClick={handleSubmit}>Buy domain</Button>
                    </CardActions>
                }
            </Card>
            {!!currentOrder && currentOrder.isProcessing && <TransactionInProgressPanel text='Listing the domain!' progMsg='The waiting period is required to securely buy your domain. Please do not close this tab until the process has finished.' />}
        </CheckoutPageTemplate >
    );
};

export default DomainOffersCheckoutPage;