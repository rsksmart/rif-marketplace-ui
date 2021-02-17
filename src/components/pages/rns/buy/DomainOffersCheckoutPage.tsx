import RifAddress from 'components/molecules/RifAddress'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import { Rns as RNSContract } from 'contracts/rns'
import { UIError } from 'models/UIMessage'
import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import AppContext, { errorReporterFactory } from 'context/App'
import MarketContext from 'context/Market'
import RnsOffersContext from 'context/Services/rns/OffersContext'
import Logger from 'utils/Logger'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {
  Button, colors, Web3Store,
  ShortenTextTooltip,
  shortenString,
} from '@rsksmart/rif-ui'
import { marketPlaceAddress } from 'contracts/config'
import { shortChecksumAddress } from 'utils/stringUtils'
import { ConfirmationsContext } from 'context/Confirmations'
import Web3 from 'web3'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'
import networkConfig from 'config'
import WithLoginCard from 'components/hoc/WithLoginCard'
import NotEnoughFunds from 'components/atoms/NotEnoughFunds'

const { rnsManagerUrl } = networkConfig

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
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

const DomainOffersCheckoutPage: FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const { dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )

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
    },
  } = useContext(RnsOffersContext)
  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const {
    dispatch: confirmationsDispatch,
  } = useContext(ConfirmationsContext)

  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [hasFunds, setHasFunds] = useState(false)
  const [isFundsConfirmed, setIsFundsConfirmed] = useState(false)
  const domainName = order?.item?.domainName

  // check funds
  useEffect(() => {
    if (!isFundsConfirmed && order) {
      const {
        item: {
          paymentToken: { symbol: tokenSymbol },
          tokenId: tokenAddr,
        },
      } = order
      const { symbol } = crypto[tokenSymbol]
      const checkFunds = async (): Promise<void> => {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: 'Checking funds...',
          },
        })

        const rnsContract = RNSContract.getInstance(web3 as Web3, symbol)

        const hasSufficientFunds = await rnsContract.checkFunds(
          tokenAddr, account, domainName,
        )

        setHasFunds(hasSufficientFunds)
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
  }, [
    web3,
    account,
    isFundsConfirmed,
    reportError,
    domainName, appDispatch, crypto, order,
  ])

  if (!order?.item) {
    history.replace(ROUTES.RNS.BUY.LISTING)
    return null
  }

  const { tokenId } = order.item
  const {
    item: {
      ownerAddress,
      expirationDate,
      price,
      paymentToken: { symbol },
    },
  } = order
  const isOwnDomain = account?.toLowerCase() === ownerAddress.toLowerCase()
  const currency = crypto[symbol]
  const displayName = domainName
    ? <ShortenTextTooltip value={domainName} maxLength={30} />
    : <RifAddress pretext="Unknown RNS:" value={tokenId} />
  const details = {
    NAME: displayName,
    SELLER: <RifAddress value={ownerAddress} />,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: (
      <CombinedPriceCell
        price={price.toString()}
        priceFiat={price.mul(currency.rate).toString()}
        currency={currency.displayName}
        currencyFiat={currentFiat.displayName}
      />
    ),
  }

  const handleBuyDomain = async (): Promise<void> => {
    try {
      setProcessingTx(true)
      const rnsContract = RNSContract.getInstance(
        web3 as Web3, currency.symbol,
      )
      // GET PLACEMENT PRICE FROM CONTRACT
      const tokenPrice = await rnsContract.getPriceString(tokenId, account)
        .catch((error) => {
          throw new UIError({
            error,
            id: 'contract-marketplace-getPlacement',
            text: `Could not retrieve placement for ${domainName} from contract.`,
          })
        })

      const transferReceipt = await rnsContract.buy(
        marketPlaceAddress, tokenPrice, domainName as string,
        tokenId, { from: account },
      ).catch((error) => {
        throw new UIError({
          error,
          id: 'contract-rns-buy',
          text: `Could not buy domain ${domainName} from contract.`,
        })
      })

      logger.info('transferReceipt:', transferReceipt)

      if (transferReceipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'RNS_BUY',
            txHash: transferReceipt.transactionHash,
            contractActionData: { tokenId },
          },
        })
      }
    } catch (e) {
      logger.error(e)
      reportError(e)
    } finally {
      setProcessingTx(false)
    }
  }

  const buyingNameTitle = domainName
    ? shortenString(domainName, 30, 25)
    : shortChecksumAddress(tokenId)

  const renderNotEnoughFunds = (): JSX.Element | undefined => {
    if (isFundsConfirmed && !hasFunds) {
      return (
        <NotEnoughFunds token={currency} />
      )
    }
    return undefined
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
        <CardHeader
          titleTypographyProps={{ variant: 'h5', color: 'primary' }}
          title={`Buying ${buyingNameTitle}`}
        />
        <CardContent>
          <Typography
            className={classes.contentTitle}
            variant="h6"
            color="secondary"
          >
            Domain details
          </Typography>
          <Table className={classes.contentDetails}>
            <TableBody>
              {Object.keys(details).map((key) => (
                <TableRow key={key}>
                  <TableCell className={classes.detailKey}>{key}</TableCell>
                  <TableCell className={classes.detailValue}>
                    {details[key]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {
          renderNotEnoughFunds()
        }
        <CardActions className={classes.footer}>
          {isOwnDomain && <p>You cannot purchase your own offer.</p>}
          {
            !isOwnDomain && hasFunds
            && <p>Your wallet will open and you will be asked to confirm the transaction for buying the domain.</p>
          }
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
      </Card>
      <ProgressOverlay
        title={`Buying the domain ${domainName}!`}
        doneMsg="Your domain has been bought!"
        inProgress={processingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            key="buy_another"
            onClick={(): void => history.push(ROUTES.RNS.BUY.BASE)}
          >
            Buy another domain
          </RoundBtn>,
          <RoundBtn
            key="go_to_rnsManager"
            disabled={!rnsManagerUrl}
            onClick={
              (): void => {
                window.open(
                  `${rnsManagerUrl}?autologin=${domainName}`, '_blank',
                )
              }
            }
          >
            Admin my domain
          </RoundBtn>,
        ]}

      />
    </CheckoutPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: DomainOffersCheckoutPage,
  title: 'Connect your wallet to buy the domain',
  contentText: 'Please, connect your wallet in order to buy a new domain.',
})
