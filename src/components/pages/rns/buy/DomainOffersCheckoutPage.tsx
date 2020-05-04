import { CardActions, createStyles, makeStyles, Theme } from '@material-ui/core';
import ERC677 from '@rsksmart/rif-marketplace-nfts/build/contracts/ERC677.json';
import ERC721SimplePlacements from '@rsksmart/rif-marketplace-nfts/build/contracts/ERC721SimplePlacements.json';
import Login from 'components/atoms/Login';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, colors, shortenAddress, Table, TableBody, TableCell, TableRow, Typography, Web3Store } from '@rsksmart/rif-ui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import contractAdds from 'ui-config.json';
import { ContractWrapper } from 'utils/blockchain.utils';
import Logger from 'utils/Logger';
const logger = Logger.getInstance();

const NETWORK: string = process.env.REACT_APP_NETWORK || 'ganache';
const rifTokenAddress = contractAdds[NETWORK].rif;
const marketPlaceAddress = contractAdds[NETWORK].marketplace;


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
        },
    }),
);

const DomainOffersCheckoutPage = () => {
    const history = useHistory();
    const {
        state: {
            currentOrder,
            exchangeRates: {
                currentFiat,
                crypto,
            }
        },
        dispatch
    } = useContext(MarketStore)
    const {
        state: {
            account,
            web3
        }
    } = useContext(Web3Store);
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
            paymentToken
        },
        isProcessing
    } = currentOrder;

    const shortSeller = shortenAddress(sellerAddress);
    const currency = crypto[paymentToken];

    const priceCellProps = {
        price,
        priceFiat: (currency.rate * price).toString(),
        currency: currency.displayName,
        currencyFiat: currentFiat.displayName,
        divider: ' '
    };
    const PriceCell = <CombinedPriceCell {...priceCellProps} />

    const details = {
        'NAME': domainName,
        'SELLER': shortSeller,
        'RENEWAL DATE': expirationDate.toLocaleDateString(),
        'PRICE': PriceCell
    }

    const handleBuyDomain = async () => {
        if (web3 && account) {
            const tokenId = web3.utils.sha3(domainName.replace('.rsk', ''));
            const Contract = c => ContractWrapper(c, web3, account);

            dispatch({
                type: MARKET_ACTIONS.SELECT_ITEM,
                payload: {
                    ...currentOrder,
                    isProcessing: true,
                }
            })

            const marketPlaceContract = await Contract(ERC721SimplePlacements).at(marketPlaceAddress)
            const rifContract = await Contract(ERC677).at(rifTokenAddress)

            const tokenPlacement = await marketPlaceContract.placement(tokenId);
            const price = tokenPlacement[1]

            const transferReceipt = await rifContract.transferAndCall(marketPlaceAddress, price, tokenId)
            logger.info('transferReceipt:', transferReceipt)
        };
        dispatch({
            type: MARKET_ACTIONS.SELECT_ITEM,
            payload: {
                ...currentOrder,
                isProcessing: false
            }
        })
        history.replace(ROUTES.DOMAINS.DONE.BUY)
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
                {!isProcessing && account &&
                    <CardActions className={classes.footer}>
                        <p >Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>
                        <Button color='primary' variant='contained'
                            rounded shadow onClick={handleBuyDomain}>Buy domain</Button>
                    </CardActions>
                }
                {!account && <Login color='primary' variant='contained' rounded shadow />}
            </Card>
            {!!isProcessing && <TransactionInProgressPanel text='Listing the domain!' progMsg='The waiting period is required to securely buy your domain. Please do not close this tab until the process has finished.' />}
        </CheckoutPageTemplate >
    );
};

export default DomainOffersCheckoutPage;