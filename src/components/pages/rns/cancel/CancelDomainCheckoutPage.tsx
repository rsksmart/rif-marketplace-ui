import {
  Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, Table, TableBody, TableCell, TableRow, Theme,
} from '@material-ui/core'
import {
  Button, colors, shortenString, Typography, Web3Store,
} from '@rsksmart/rif-ui'
import AddressItem from 'components/molecules/AddressItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import DomainNameItem from 'components/molecules/DomainNameItem'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketplaceContract from 'contracts/Marketplace'
import RNSContract from 'contracts/Rns'
import React, {
  useContext, useEffect, useState, useCallback,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { AddTxPayload } from 'context/Blockchain/blockchainActions'
import BlockchainContext from 'context/Blockchain/BlockchainContext'
import MarketContext from 'context/Market/MarketContext'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'
import Logger from 'utils/Logger'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import { LoadingPayload } from 'context/App/appActions'

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
  } = useContext(MarketContext)
  const {
    state: {
      order,
    }, dispatch,
  } = useContext(RnsDomainsContext)
  const classes = useStyles()
  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const { dispatch: bcDispatch } = useContext(BlockchainContext)
  const [isPendingConfirm, setIsPendingConfirm] = useState(false)

  const { dispatch: appDispatch } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])

  useEffect(() => {
    if (isPendingConfirm && order && !order.isProcessing) {
      // Post-confirmations handle
      const { item: { domainName } } = order
      history.replace(ROUTES.DOMAINS.SELL.CANCEL.DONE, { domainName })
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

  const displayName = name
    ? <DomainNameItem value={name} />
    : <AddressItem pretext="Unknown RNS:" value={tokenId} />

  const details = {
    NAME: displayName,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: PriceCell,
  }

  const handleSubmit = async () => {
    if (web3 && account) {
      dispatch({
        type: 'SET_PROGRESS',
        payload: {
          isProcessing: true,
          id: 'contract',
        },
      })
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Executing cancel...',
        } as LoadingPayload,
      } as any)

      try {
        const rnsContract = RNSContract.getInstance(web3)
        const marketPlaceContract = MarketplaceContract.getInstance(web3)

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()
          .catch((error: Error) => {
            throw new UIError({
              error,
              id: 'web3-getGasPrice',
              text: 'Could not retreive gas price from the blockchain.',
            })
          })

        // Send unapproval transaction
        const unapproveReceipt = await rnsContract.unapprove(tokenId, { from: account, gasPrice })
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-rns-unapprove',
              text: `Could not unapprove domain ${name}.`,
            })
          })
        logger.info('unapproveReceipt:', unapproveReceipt)

        // Send Unplacement transaction
        const unplaceReceipt = await marketPlaceContract.unplace(tokenId, { from: account, gasPrice })
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-marketplace-unplace',
              text: `Could not unplace domain ${name}.`,
            })
          })
        logger.info('unplaceReceipt:', unplaceReceipt)

        bcDispatch({
          type: 'SET_TX_HASH',
          payload: {
            txHash: unplaceReceipt.transactionHash,
          } as AddTxPayload,
        })
        setIsPendingConfirm(true)
      } catch (e) {
        reportError(e)

        dispatch({
          type: 'SET_PROGRESS',
          payload: {
            isProcessing: false,
          },
        })
      } finally {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'contract',
          } as LoadingPayload,
        } as any)
      }
    }
  }

  const onProcessingComplete = () => {
    dispatch({
      type: 'SET_PROGRESS',
      payload: {
        isProcessing: false,
      },
    })
  }

  const cancelingNameTitle = name
    ? shortenString(name, 30, 25)
    : shortenString(tokenId)

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
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Canceling ${cancelingNameTitle}`} />
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
      {isProcessing && <TransactionInProgressPanel {...{ isPendingConfirm, onProcessingComplete }} text="Canceling the domain!" progMsg="The waiting period is required to securely cancel your domain listing. Please do not close this tab until the process has finished" />}
    </CheckoutPageTemplate>
  )
}

export default CancelDomainCheckoutPage
