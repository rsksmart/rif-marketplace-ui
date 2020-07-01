import React, { FC, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, Table, TableBody, TableCell, TableRow, Theme } from '@material-ui/core'
import { Button, colors, shortenAddress, Typography, Web3Store } from '@rsksmart/rif-ui'
import Login from 'components/atoms/Login'
import AddressItem from 'components/molecules/AddressItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import getMarketplaceContract from 'contracts/Marketplace'
import getRifContract from 'contracts/Rif'
import ROUTES from 'routes'
import { BLOCKCHAIN_ACTIONS } from 'store/Blockchain/blockchainActions'
import BlockchainStore from 'store/Blockchain/BlockchainStore'
import MarketStore from 'store/Market/MarketStore'
import RnsOffersStore from 'store/Market/rns/OffersStore'
import contractAdds from 'ui-config.json'
import Logger from 'utils/Logger'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const marketPlaceAddress = contractAdds[network].marketplace.toLowerCase()

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
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    }
  } = useContext(MarketStore)

  const { state: {
    order
  }, dispatch } = useContext(RnsOffersStore)
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
        const rifContract = getRifContract(web3)
        const marketPlaceContract = getMarketplaceContract(web3)
        try {
          const myBalance = await rifContract.methods.balanceOf(account).call({ from: account })
          const tokenPlacement = await marketPlaceContract.methods.placement(tokenId).call({ from: account })
          const price = tokenPlacement[1]

          setHasFunds(new web3.utils.BN(myBalance).gte(new web3.utils.BN(price)))
          setIsFundsConfirmed(true)
        } catch (e) {
          logger.error('Could not complete transaction:', e)
        }
      }
      checkFunds()
    }
  }, [web3, account, tokenId, isFundsConfirmed])

  useEffect(() => {
    if (!order) {
      // Redirect from direct navigation
      history.replace(ROUTES.LANDING)
    }
  }, [order, isPendingConfirm, history])

  useEffect(() => {
    if (isPendingConfirm && order && !order.isProcessing) {
      // Post-confirmations handle
      const { item: { domainName } } = order
      history.replace(ROUTES.DOMAINS.DONE.BUY, { domainName })
      dispatch({
        type: 'CLEAR_ORDER'
      } as any)
    }
  }, [order, isPendingConfirm, history, dispatch])

  if (!order) return null

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

  const details = {
    NAME: domainName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
    SELLER: <AddressItem value={ownerAddress} />,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: PriceCell,
  }

  const handleBuyDomain = async () => {
    if (web3 && account) {
      dispatch({
        type: "SET_PROGRESS",
        payload: {
          isProcessing: true,
        },
      })

      try {
        const rifContract = getRifContract(web3)
        const marketPlaceContract = getMarketplaceContract(web3)

        const tokenPlacement = await marketPlaceContract.methods.placement(tokenId).call({ from: account })
        const tokenPrice = tokenPlacement[1]

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()

        // Get gas limit for Payment transaction
        const estimatedGas = await rifContract.methods.transferAndCall(marketPlaceAddress, tokenPrice, tokenId).estimateGas({ from: account, gasPrice })
        const gas = Math.floor(estimatedGas * 1.1)

        // Payment transaction
        const transferReceipt = await rifContract.methods.transferAndCall(marketPlaceAddress, tokenPrice, tokenId).send({ from: account, gas, gasPrice })
        logger.info('transferReceipt:', transferReceipt)

        if (!transferReceipt) {
          throw Error('Something unexpected happened. No receipt received from the place transaction.')
        }

        bcDispatch({
          type: BLOCKCHAIN_ACTIONS.SET_TX_HASH,
          payload: {
            txHash: transferReceipt.transactionHash,
          } as any,
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
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Buying ${domainName || shortenAddress(tokenId)}`} />
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
      {!!isProcessing && <TransactionInProgressPanel {...{ isPendingConfirm, dispatch }} text="Buying the domain!" progMsg="The waiting period is required to securely buy your domain. Please do not close this tab until the process has finished." />}
    </CheckoutPageTemplate>
  )
}

export default DomainOffersCheckoutPage
