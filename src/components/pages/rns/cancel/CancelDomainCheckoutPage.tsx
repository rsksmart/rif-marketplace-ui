import {
  Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, Table, TableBody, TableCell, TableRow, Theme,
} from '@material-ui/core'
import {
  Button, colors, shortenAddress, Typography, Web3Store,
} from '@rsksmart/rif-ui'
import AddressItem from 'components/molecules/AddressItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketplaceContract from 'contracts/Marketplace'
import RNSContract from 'contracts/Rns'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import BlockchainStore from 'store/Blockchain/BlockchainStore'
import MarketStore from 'store/Market/MarketStore'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'
import Logger from 'utils/Logger'
import { AddTxPayload } from 'store/Blockchain/blockchainActions'

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
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketStore)
  const {
    state: {
      order,
    }, dispatch,
  } = useContext(RnsDomainsStore)
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
    if (isPendingConfirm && order && !order.isProcessing) {
      // Post-confirmations handle
      const { item: { domainName } } = order
      history.replace(ROUTES.DOMAINS.DONE.CANCEL, { domainName })
      dispatch({
        type: 'CLEAR_ORDER',
      } as never)
    }
  }, [order, isPendingConfirm, history, dispatch])

  if (!order) {
    history.replace(ROUTES.LANDING)
    return null
  }

  const {
    item: {
      name,
      expirationDate,
      tokenId,
      offer,
    },
    isProcessing,
  } = order

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
        type: 'SET_PROGRESS',
        payload: {
          isProcessing: true,
        },
      })

      try {
        const rnsContract = RNSContract.getInstance(web3)
        const marketPlaceContract = MarketplaceContract.getInstance(web3)

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()

        // Send unapproval transaction
        const unapproveReceipt = await rnsContract.unapprove(tokenId, { from: account, gasPrice })
        logger.info('unapproveReceipt:', unapproveReceipt)

        // Send Unplacement transaction
        const unplaceReceipt = await marketPlaceContract.unplace(tokenId, { from: account, gasPrice })

        if (!unplaceReceipt) {
          throw Error('Something unexpected happened. No receipt received from the unplace transaction.')
        }

        bcDispatch({
          type: 'SET_TX_HASH',
          payload: {
            txHash: unplaceReceipt.transactionHash,
          } as AddTxPayload,
        })
        setIsPendingConfirm(true)
      } catch (e) {
        logger.error('Could not complete transaction:', e)
        history.replace(ROUTES.DOMAINS.SELL)
        dispatch({
          type: 'SET_ORDER',
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
