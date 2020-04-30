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
import MarketStore, { TxType } from 'store/Market/MarketStore';
import { MarketListingTypes } from 'models/Market';
import { Web3Store } from 'rifui/providers/Web3Provider';

import ERC721SimplePlacements from '@rsksmart/rif-marketplace-nfts/build/contracts/ERC721SimplePlacements.json';
import ERC677 from '@rsksmart/rif-marketplace-nfts/build/contracts/ERC677.json';
import ERC721 from '@rsksmart/rif-marketplace-nfts/build/contracts/ERC721.json';
import { colors } from 'rifui/theme';
import { ContractWrapper } from 'utils/blockchain.utils';

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
    const {
        state: {
            account,
            web3
        }
    } = useContext(Web3Store);
    const classes = useStyles();

    const corder = {
        listingType: MarketListingTypes.DOMAIN_OFFERS,
        item: {
            paymentToken: 'TOKEN',
            domainName: 'NAME',
            expirationDate: 1233423324544,
            priceFiat: '9999',
            price: '3',
            sellerAddress: 'THEUNIVERSE'
        },
        txType: TxType.BUY,
        isProcessing: false,
    };

    // useEffect(() => {
    //     if (!currentOrder) {
    //         history.replace(ROUTES.LANDING);
    //     }
    // }, [currentOrder, history])

    // if (!currentOrder) return null;


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
    } = corder;

    const shortSeller = shortenAddress(sellerAddress);

    const priceCellProps = { price, priceFiat, currency: paymentToken, currencyFiat: 'USD', divider: ' ' };
    const PriceCell = <CombinedPriceCell {...priceCellProps} />

    const details = {
        'NAME': domainName,
        'SELLER': shortSeller,
        'RENEWAL DATE': (new Date(expirationDate)).toDateString(),
        'PRICE': PriceCell
    }

    const handleBuyDomain = async () => {
        // const web3 = new Web3('http://localhost:8545')
        if (web3 && account) {
            // TODO: Approve tx
            // const cost = web3.utils.toWei('1.5');
            const tokenId = web3.utils.sha3('bob')
            const rifTokenAddress = '0x9049aA058DE0291C65AFCDC3Aa23aa8C4Ff19C7C';
            const rnsAddress = '0xC33d5CceaCC9AAfcB1e65A94c164DB4F65Db46EE';
            const marketPlaceAddress = '0x1cb54CACf012D5708093DEFf3E9dDAe5e97CC9FA';
            const Contract = c => ContractWrapper(c, web3, account);

            const marketPlaceContract = await Contract(ERC721SimplePlacements).at(marketPlaceAddress)
            const rifContract = await Contract(ERC677).at(rifTokenAddress)
            const rnsContract = await Contract(ERC721).at(rnsAddress)

            const ownerOfBob = await rnsContract.ownerOf(tokenId)
            console.log('ownerOfBob:', ownerOfBob)

            const balanceOfAccount = await rnsContract.balanceOf(account)
            console.log('balanceOfAccount:', balanceOfAccount)

            const tokenPlacement = await marketPlaceContract.placement(tokenId);
            const tokenAddress = tokenPlacement[0]
            const price = tokenPlacement[1]
            console.log('token price:', price);
            // console.log(`I ${balanceOfAccount >= price ? 'do' : "don't"}have enough $$`)

            console.log('Token is RIF:', tokenAddress === rifTokenAddress)

            const transferReceipt = await rifContract.transferAndCall(marketPlaceAddress, price, tokenId)
            console.log('transferReceipt:', transferReceipt)
        };

        // const c = await (erc20 as any).methods.approve((simplePlacements as any)._address, cost);
        dispatch({
            type: MARKET_ACTIONS.SELECT_ITEM,
            payload: {
                ...corder,
                isProcessing: true
            }
        })
        // setTimeout(() => {
        //     history.replace(ROUTES.DONE.DOMAIN_OFFERS)
        // }, 5000)
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
                {!isProcessing &&
                    <CardActions className={classes.footer}>
                        <p >Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>
                        <Button color='primary' variant='contained'
                            rounded shadow onClick={handleBuyDomain}>Buy domain</Button>
                    </CardActions>
                }
            </Card>
            {!!corder && corder.isProcessing && <TransactionInProgressPanel text='Listing the domain!' progMsg='The waiting period is required to securely buy your domain. Please do not close this tab until the process has finished.' />}
        </CheckoutPageTemplate >
    );
};

export default DomainOffersCheckoutPage;