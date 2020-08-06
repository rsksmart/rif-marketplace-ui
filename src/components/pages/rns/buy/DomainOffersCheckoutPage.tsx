import Login from 'components/atoms/Login'
import AddressItem from 'components/molecules/AddressItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import DomainNameItem from 'components/molecules/DomainNameItem'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketplaceContract from 'contracts/Marketplace'
import RIFContract from 'contracts/Rif'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { LoadingPayload } from 'store/App/appActions'
import AppStore, { errorReporterFactory } from 'store/App/AppStore'
import { AddTxPayload } from 'store/Blockchain/blockchainActions'
import BlockchainStore from 'store/Blockchain/BlockchainStore'
import MarketStore from 'store/Market/MarketStore'
import RnsOffersStore from 'store/Market/rns/OffersStore'
import Logger from 'utils/Logger'

import {
  Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, Table, TableBody,
  TableCell, TableRow, Theme,
} from '@material-ui/core'
import {
  Button, colors, shortenString, Typography, Web3Store,
} from '@rsksmart/rif-ui'

import { parseToBigDecimal } from 'utils/parsers'
import { marketPlaceAddress } from 'contracts/config'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    width: 491,
    height: 'fit-content',
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

const DomainOffersCheckoutPage: FC<{}> = () => {
  const classes = useStyles()
  const history = useHistory()

  const { dispatch: appDispatch } = useContext(AppStore)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])

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
  } = useContext(RnsOffersStore)
  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const { dispatch: bcDispatch } = useContext(BlockchainStore)
  const [isPendingConfirm, setIsPendingConfirm] = useState(false)

  const [hasFunds, setHasFunds] = useState(false)
  const [isFundsConfirmed, setIsFundsConfirmed] = useState(false)
  const tokenId = order?.item?.tokenId
  const domainName = order?.item?.domainName

  // check funds
  useEffect(() => {
    if (account && tokenId && !isFundsConfirmed) {
      const checkFunds = async () => {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: 'Checking funds...',
          } as LoadingPayload,
        })
        const rifContract = RIFContract.getInstance(web3)
        const marketPlaceContract = MarketplaceContract.getInstance(web3)
        const myBalance = await rifContract.getBalanceOf(account, { from: account })
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-rif-getBalanceOf',
              text: 'Could not get funds balance from contract.',
            })
          })

        const tokenPlacement = await marketPlaceContract.getPlacement(tokenId, { from: account })
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-marketplace-getPlacement',
              text: `Could not retrieve placement for ${domainName} from contract.`,
            })
          })

        const price = tokenPlacement[1]
        const { utils: { BN } } = web3

        setHasFunds(new BN(myBalance).gte(new BN(price)))
        setIsFundsConfirmed(true)
      }
      checkFunds()
        .catch((error) => {
          reportError(error)
        })
        .finally(() => {
          appDispatch({
            type: 'SET_IS_LOADING',
            payload: {
              isLoading: false,
              id: 'contract',
            },
          })
        })
    }
  }, [web3, account, tokenId, isFundsConfirmed, reportError, domainName, appDispatch])

  useEffect(() => {
    if (isPendingConfirm && order && !order.isProcessing) {
      // Post-confirmations handle
      history.replace(ROUTES.DOMAINS.DONE.BUY, { domainName: order.item.domainName })
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
      ownerAddress,
      expirationDate,
      price,
      paymentToken,
    },
    isProcessing,
  } = order
  const isOwnDomain = account?.toLowerCase() === ownerAddress.toLowerCase()

  const currency = crypto[paymentToken]

  const priceCellProps = {
    price,
    priceFiat: (currency.rate * price).toString(),
    currency: currency.displayName,
    currencyFiat: currentFiat.displayName,
    divider: ' ',
  }
  const PriceCell = <CombinedPriceCell {...priceCellProps} />

  const displayName = domainName
    ? <DomainNameItem value={domainName} />
    : <AddressItem pretext="Unknown RNS:" value={tokenId} />

  const details = {
    NAME: displayName,
    SELLER: <AddressItem value={ownerAddress} />,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: PriceCell,
  }

  const handleBuyDomain = async () => {
    if (web3 && account) {
      dispatch({
        type: 'SET_PROGRESS',
        payload: {
          isProcessing: true,
        },
      })
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Executing transfer...',
        } as LoadingPayload,
      })

      try {
        const rifContract = RIFContract.getInstance(web3)
        const marketPlaceContract = MarketplaceContract.getInstance(web3)

        const tokenPlacement = await marketPlaceContract.getPlacement(tokenId, { from: account })
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-marketplace-getPlacement',
              text: `Could not retrieve placement for ${domainName} from contract.`,
            })
          })

        const tokenPrice = tokenPlacement[1]

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()

        // Send Transfer and call transaction
        const transferReceipt = await rifContract.transferAndCall(marketPlaceAddress, tokenPrice, tokenId, { from: account, gasPrice })
          .catch((error) => {
            const adjustedPrice = parseToBigDecimal(tokenPrice, 18).toString()
            throw new UIError({
              error,
              id: 'contract-rif-transferAndCall',
              text: `Transfer of ${adjustedPrice} ${currency.displayName} failed. Check your funds and try again.`,
              // customAction: () => {

              // }
            })
          })
        logger.info('transferReceipt:', transferReceipt)

        bcDispatch({
          type: 'SET_TX_HASH',
          payload: {
            txHash: transferReceipt.transactionHash,
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
        })
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

  const buyingNameTitle = domainName
    ? shortenString(domainName, 30, 25)
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
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Buying ${buyingNameTitle}`} />
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
        {account && isFundsConfirmed && !hasFunds && <Typography color="error">You do not have enough RIF.</Typography>}
        {!isProcessing && account
          && (
            <CardActions className={classes.footer}>
              {isOwnDomain && <p>You cannot purchase your own offer.</p>}
              {!isOwnDomain && hasFunds && <p>Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>}
              <Button
                disabled={!hasFunds || isOwnDomain}
                color="primary"
                variant="contained"
                rounded
                shadow
                onClick={handleBuyDomain}
              >
                Buy domain
              </Button>
            </CardActions>
          )}
        {!account && <Login />}
      </Card>
      {!!isProcessing && <TransactionInProgressPanel {...{ isPendingConfirm, onProcessingComplete }} text="Buying the domain!" progMsg="The waiting period is required to securely buy your domain. Please do not close this tab until the process has finished." />}
    </CheckoutPageTemplate>
  )
}

export default DomainOffersCheckoutPage
