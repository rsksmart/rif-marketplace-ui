import React, { useContext, useEffect, useState } from 'react'
import {
  Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, Table, TableBody, TableCell, TableRow, Theme,
} from '@material-ui/core'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import { useHistory } from 'react-router-dom'
import {
  Button, colors, shortenAddress, Typography, Web3Store,
} from '@rsksmart/rif-ui'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import Logger from 'utils/Logger'
import AddressItem from 'components/molecules/AddressItem'
import getMarketplaceContract from 'contracts/Marketplace'
import getRnsContract from 'contracts/Rns'
import BlockchainStore from 'store/Blockchain/BlockchainStore'
import { BLOCKCHAIN_ACTIONS } from 'store/Blockchain/blockchainActions'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    width: 491,
    height: 'fit-content',
    padding: theme.spacing(10),
    paddingTop: theme.spacing(5.5),
    paddingBottom: theme.spacing(8.5),

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
    textAlign: 'center',
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
}))

const CancelDomainCheckoutPage = () => {
  const history = useHistory()
  const {
    state: {
      currentOrder,
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const classes = useStyles()
  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const { dispatch: bcDispatch } = useContext(BlockchainStore)
  const [isPendingConfirm, setIsPendingConfirm] = useState(false)

  useEffect(() => {
    if (!currentOrder) {
      // Redirect from direct navigation
      history.replace(ROUTES.LANDING)
    } else if (isPendingConfirm && !currentOrder.isProcessing) {
      // Post-confirmations handle
      history.replace(ROUTES.DOMAINS.DONE.CANCEL)
    }
  }, [currentOrder, isPendingConfirm, history])

  if (!currentOrder) return null

  const {
    item: {
      name,
      expirationDate,
      tokenId,
      offer,
    },
    isProcessing,
  } = currentOrder

  const currency = crypto[offer.paymentToken]

  const priceCellProps = {
    price: offer.price,
    priceFiat: (currency.rate * offer.price).toString(),
    currency: currency.displayName,
    currencyFiat: currentFiat.displayName,
    divider: ' ',
  }
  const PriceCell = <CombinedPriceCell {...priceCellProps} />

  const details = {
    NAME: name || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: PriceCell,
  }

  const handleSubmit = async () => {
    if (web3 && account) {
      dispatch({
        type: MARKET_ACTIONS.SET_PROG_STATUS,
        payload: {
          isProcessing: true,
        },
      })

      try {
        const rnsContract = getRnsContract(web3)
        const marketPlaceContract = getMarketplaceContract(web3)

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()

        // Send unapproval transaction
        const unapproveReceipt = await rnsContract.methods.approve('0x0000000000000000000000000000000000000000', tokenId).send({ from: account, gasPrice })
        logger.info('unapproveReceipt:', unapproveReceipt)

        // Get gas limit for unplacement transaction
        const estimatedGas = await marketPlaceContract.methods.unplace(tokenId).estimateGas({ from: account, gasPrice })
        const gas = Math.floor(estimatedGas * 1.1)

        // Send unplacement transaction
        const receipt = await marketPlaceContract.methods.unplace(tokenId).send({ from: account, gas, gasPrice })
        logger.info('unplace receipt:', receipt)

        if (!receipt) {
          throw Error('Something unexpected happened. No receipt received from the place transaction.')
        }

        bcDispatch({
          type: BLOCKCHAIN_ACTIONS.SET_TX_HASH,
          payload: {
            txHash: receipt.transactionHash,
          } as any,
        })
        setIsPendingConfirm(true)
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
      className="domains-checkout-page"
      backButtonProps={{
        backTo: 'domains',
      }}
    >
      <Card
        className={classes.card}
      >
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Canceling ${name || shortenAddress(tokenId)}`} />
        <CardContent>
          <Typography className={classes.contentTitle} variant="h6" color="secondary">Domain details</Typography>
          <Table className={classes.contentDetails}>
            <TableBody>
              {Object.keys(details).map((key) => (
                <TableRow key={key}>
                  <TableCell className={classes.detailKey}>{key}</TableCell>
                  <TableCell className={classes.detailValue}>{details[key]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {!isProcessing
          && (
            <CardActions className={classes.footer}>
              <p>Your wallet will open and you will be asked to confirm the transaction for canceling the domain.</p>
              <Button
                color="primary"
                variant="contained"
                rounded
                shadow
                onClick={handleSubmit}
              >
                Cancel domain
              </Button>
            </CardActions>
          )}
      </Card>
      {isProcessing && <TransactionInProgressPanel {...{ isPendingConfirm, dispatch }} text="Canceling the domain!" progMsg="The waiting period is required to securely cancel your domain listing. Please do not close this tab until the process has finished" />}
    </CheckoutPageTemplate>
  )
}

export default CancelDomainCheckoutPage
