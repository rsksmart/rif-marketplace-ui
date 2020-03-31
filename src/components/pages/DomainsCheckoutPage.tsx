import React, { FC, useContext } from 'react';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import { useHistory } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
} from 'rifui';
import MarketStore from 'store/Market/MarketStore';
import { ROUTES } from 'routes';
import { makeStyles, Theme, createStyles, CardActions } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import Heading from 'components/atoms/Heading';
import PriceItem from 'components/atoms/PriceItem';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            width: 491,
            height: 533,
            left: 484,
            top: 159,

            background: '#FFFFFF',
            border: '1px solid #F8F7F7',
            boxSizing: 'border-box',
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        footer: {
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            textAlign: 'center'
        },
        details: {},
        details_list: {
            listStyleType: 'none',
            paddingLeft: 0,

        },
        details_row: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    }),
);

const DomainsCheckoutPage = () => {
    const history = useHistory();
    const {
        state: {
            MarketState: {
                currentOrder
            }
        }
    } = useContext(MarketStore)
    const classes = useStyles();

    if (!currentOrder) {
        history.replace(ROUTES.DOMAINS);

        return null;
    } else {
        const { item: { domain, seller, expirationDate, price, price_fiat, currency } } = currentOrder;


        const PriceCell = (
            <div>
                <PriceItem key='hola' type='crypto' price={price} currency={currency} />
                <PriceItem type='fiat' price={price_fiat} currency='USD' />
            </div>
        )

        return (
            <CheckoutPageTemplate
                className='domains-checkout-page'
                backButtonProps={{
                    backTo: 'domains',
                    handleBackTo: () => {
                        history.goBack()
                    }
                }}
            >
                <Card
                    className={classes.card}
                >
                    <CardHeader
                        title={`Buying ${domain}`}
                    />
                    <CardContent>
                        <Heading hLevel={3} >Domain details</Heading>
                        <div className={classes.details}>
                            <ul className={classes.details_list}>
                                <li>
                                    <div className={classes.details_row}>
                                        <p>NAME</p>
                                        <p>{domain}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={classes.details_row}>
                                        <p>SELLER</p>
                                        <p>{seller}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={classes.details_row}>
                                        <p>RENEWAL DATE</p>
                                        <p>{expirationDate}</p>
                                    </div>
                                </li>
                                <li>
                                    <div className={classes.details_row}>
                                        <p>PRICE</p>
                                        {PriceCell}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardActions className={classes.footer}>
                        <p >Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>
                        <Button>Buy domain</Button>
                    </CardActions>
                </Card>
            </CheckoutPageTemplate>
        );
    }
};

export default DomainsCheckoutPage;