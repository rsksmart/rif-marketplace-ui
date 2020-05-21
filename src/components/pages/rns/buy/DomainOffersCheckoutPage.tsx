import {
  CardActions, createStyles, makeStyles, Theme,
} from '@material-ui/core'
import ERC677 from '@rsksmart/erc677/ERC677Data.json'
import ERC721SimplePlacements from '@rsksmart/rif-marketplace-nfts/ERC721SimplePlacementsABI.json'
import Login from 'components/atoms/Login'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button, Card, CardContent, CardHeader, colors, shortenAddress, Table, TableBody, TableCell, TableRow, Typography, Web3Store,
} from '@rsksmart/rif-ui'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import contractAdds from 'ui-config.json'
import Logger from 'utils/Logger'
import AddressItem from 'components/molecules/AddressItem'

const logger = Logger.getInstance()

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const rifTokenAddress = contractAdds[network].rif.toLowerCase()
const marketPlaceAddress = contractAdds[network].marketplace.toLowerCase()


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
  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const classes = useStyles()
  const [hasFunds, setHasFunds] = useState(false)
  const [isFundsConfirmed, setIsFundsConfirmed] = useState(false)

  // check funds
  useEffect(() => {
    if (web3 && account && currentOrder?.item?.tokenId) {
      setIsFundsConfirmed(false)
      const { item: { tokenId } } = currentOrder
      const checkFunds = async () => {
        const rifContract = new web3.eth.Contract(ERC677.abi, rifTokenAddress)
        const marketPlaceContract = new web3.eth.Contract(ERC721SimplePlacements, marketPlaceAddress)

        try {
          const myBalance = await rifContract.methods.balanceOf(account).call({ from: account })
          const tokenPlacement = await marketPlaceContract.methods.placement(tokenId).call({ from: account })
          const price = tokenPlacement[1]

          setHasFunds(myBalance > price)
          setIsFundsConfirmed(true)
        } catch (e) {
          logger.error('Could not complete transaction:', e)
        }
      }
      checkFunds()
    }
  }, [web3, account, currentOrder])

  // redirect direct link
  useEffect(() => {
    if (!currentOrder) {
      history.replace(ROUTES.LANDING)
    }
  }, [currentOrder, history])

  if (!currentOrder) return null

  const { item: { domainName, tokenId } } = currentOrder

  const {
    item: {
      sellerAddress,
      expirationDate,
      price,
      paymentToken,
    },
    isProcessing,
  } = currentOrder
  const isOwnDomain = account?.toLowerCase() === sellerAddress.toLowerCase()

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
    SELLER: <AddressItem value={sellerAddress} />,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: PriceCell,
  }

  const handleBuyDomain = async () => {
    if (web3 && account) {
      dispatch({
        type: MARKET_ACTIONS.SELECT_ITEM,
        payload: {
          ...currentOrder,
          isProcessing: true,
        },
      })

      try {
        const marketPlaceContract = new web3.eth.Contract(ERC721SimplePlacements, marketPlaceAddress)
        const rifContract = new web3.eth.Contract(ERC677.abi, rifTokenAddress)

        const tokenPlacement = await marketPlaceContract.methods.placement(tokenId).call({ from: account })
        const tokenPrice = tokenPlacement[1]

        const transferReceipt = await rifContract.methods.transferAndCall(marketPlaceAddress, tokenPrice, tokenId).send({ from: account })
        logger.info('transferReceipt:', transferReceipt)

        dispatch({
          type: MARKET_ACTIONS.SELECT_ITEM,
          payload: {
            ...currentOrder,
            isProcessing: false,
          },
        })
        history.replace(ROUTES.DOMAINS.DONE.BUY)
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
      {!!isProcessing && <TransactionInProgressPanel text="Buying the domain!" progMsg="The waiting period is required to securely buy your domain. Please do not close this tab until the process has finished." />}
    </CheckoutPageTemplate>
  )
}

export default DomainOffersCheckoutPage
