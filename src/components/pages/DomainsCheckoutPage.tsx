import { CardActions, createStyles, makeStyles, Theme } from '@material-ui/core';
import Heading from 'components/atoms/Heading';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import ItemDetailRow from 'components/molecules/ItemDetailRow';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, CardHeader } from 'rifui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { Web3Store } from 'rifui/providers/Web3Provider';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            width: 491,
            height: "fit-content",
            padding: 80,
            paddingTop: 44,
            paddingBottom: 69,

            background: '#FFFFFF',
            border: '1px solid #F8F7F7',
            boxSizing: 'border-box',
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifySelf: 'center',
            alignSelf: 'center'
        },
        footer: {
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            textAlign: 'center'
        },
        details: {
            width: 300,
            display: 'flex',
            flexDirection: 'column',
        }
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

    const shortSeller = `${sellerAddress.slice(0, 6)}..${sellerAddress.slice(-5)}`.toLocaleLowerCase()

    const priceCellProps = { price, price_fiat, currency: paymentToken, currency_fiat: 'USD', divider: ' ' };
    const PriceCell = <CombinedPriceCell {...priceCellProps} />

    const details = {
        'NAME': sellerDomain,
        'SELLER': shortSeller,
        'RENEWAL DATE': (new Date(expirationDate)).toDateString(),
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
            }}
            progressMessage='Completing the purchase!'
        >
            <Card
                className={classes.card}
            >
                <CardHeader
                    title={`Buying ${sellerDomain}`}
                />
                <CardContent>
                    <Heading hLevel={3}>Domain details</Heading>
                    <div className={classes.details}>
                        {
                            Object.keys(details).map((name, i) => {
                                return <ItemDetailRow name={name} value={details[name]} key={'idr-' + name + i} />
                            })
                        }
                    </div>
                </CardContent>
                {!isProcessing &&
                    <CardActions className={classes.footer}>
                        <p >Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>
                        <Button onClick={handleSubmit}>Buy domain</Button>
                    </CardActions>
                }
            </Card>
        </CheckoutPageTemplate >
    );
};

export default DomainsCheckoutPage;