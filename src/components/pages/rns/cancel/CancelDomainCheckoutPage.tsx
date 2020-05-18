import React, { useContext, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import ERC721 from '@rsksmart/erc721/ERC721Data.json';
import ERC721SimplePlacements from '@rsksmart/rif-marketplace-nfts/ERC721SimplePlacementsABI.json';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel';
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, colors, Table, TableBody, TableCell, TableRow, Typography, Web3Store } from '@rsksmart/rif-ui';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore from 'store/Market/MarketStore';
import { ContractWrapper } from 'utils/blockchain.utils';
import Web3 from 'web3';
import contractAdds from 'ui-config.json';
import Logger from 'utils/Logger';
import AddressItem from 'components/molecules/AddressItem';
import { shortenAddress } from "@rsksmart/rif-ui";
const logger = Logger.getInstance();

const NETWORK: string = process.env.REACT_APP_NETWORK || 'ganache';
const rnsAddress = contractAdds[NETWORK].rnsDotRskOwner.toLowerCase();
const marketPlaceAddress = contractAdds[NETWORK].marketplace.toLowerCase();

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

const CancelDomainCheckoutPage = () => {
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
  const classes = useStyles();
  const {
    state: {
      account,
      web3
    }
  } = useContext(Web3Store);
  const Contract = (contract) => ContractWrapper(contract, (web3 as Web3), (account as string));

  // Redirect direct link
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
      tokenId,
      offer
    },
    isProcessing
  } = currentOrder;

  const currency = crypto[offer.paymentToken];

  const priceCellProps = {
      price: offer.price,
      priceFiat: (currency.rate * offer.price).toString(),
      currency: currency.displayName,
      currencyFiat: currentFiat.displayName,
      divider: ' '
  };
  const PriceCell = <CombinedPriceCell {...priceCellProps} />

  const details = {
    'NAME': name || <AddressItem pretext='Unknown RNS:' value={tokenId} />,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    'PRICE': PriceCell
}


  const handleSubmit = async () => {
    if (web3 && account) {
      dispatch({
        type: MARKET_ACTIONS.SELECT_ITEM,
        payload: {
          ...currentOrder,
          isProcessing: true,
        }
      })
      const rnsContract = await Contract(ERC721).at(rnsAddress)
      const marketPlaceContract = await Contract({ abi: ERC721SimplePlacements }).at(marketPlaceAddress)

      try {
      
        //Unapprove token
        const unapproveReceipt = await rnsContract.approve("0x0000000000000000000000000000000000000000", tokenId)
        logger.info('unapproveReciept:', unapproveReceipt);


        const receipt = await marketPlaceContract.unplace(tokenId)
        logger.info('unplace receipt:', receipt);

        dispatch({
          type: MARKET_ACTIONS.SELECT_ITEM,
          payload: {
            ...currentOrder,
            isProcessing: false,
          }
        })
        history.replace(ROUTES.DOMAINS.DONE.CANCEL)
      } catch (e) {
        logger.error('Could not complete transaction:', e)
        history.replace(ROUTES.DOMAINS.SELL)
        dispatch({
          type: MARKET_ACTIONS.SELECT_ITEM,
          payload: undefined,
        })
      }
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
          <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Canceling ${name || shortenAddress(tokenId)}`} />
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
            <p>Your wallet will open and you will be asked to confirm the transaction for canceling the domain.</p>
            <Button color='primary' variant='contained'
              rounded shadow onClick={handleSubmit}>Cancel domain</Button>
          </CardActions>
        }
      </Card>
      {isProcessing && <TransactionInProgressPanel text='Canceling the domain!' progMsg='The waiting period is required to securely cancel your domain listing. Please do not close this tab until the process has finished' />}
    </CheckoutPageTemplate >
  );
};

export default CancelDomainCheckoutPage;
