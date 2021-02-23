import {
  makeStyles, Theme,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
  colors, shortenString, Web3Store,
  ShortenTextTooltip,
} from '@rsksmart/rif-ui'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import RifAddress from 'components/molecules/RifAddress'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import {
  Marketplace as MarketplaceContract, Rns as RNSContract,
} from 'contracts/rns'
import React, {
  useContext, useEffect, useState, useCallback, FC,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketContext from 'context/Market'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'
import Logger from 'utils/Logger'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App'
import { UIError } from 'models/UIMessage'
import { shortChecksumAddress } from 'utils/stringUtils'
import Web3 from 'web3'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'
import { ConfirmationsContext } from 'context/Confirmations'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
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

const CancelDomainCheckoutPage: FC = () => {
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
  const { dispatch: appDispatch } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )
  const {
    dispatch: confirmationsDispatch,
  } = useContext(ConfirmationsContext)
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  useEffect(() => (): void => {
    dispatch({
      type: 'CLEAR_ORDER',
    })
  }, [dispatch])

  if (!order?.item.offer) {
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
  } = order

  const currency = crypto[offer.paymentToken.symbol]

  const priceCellProps = {
    price: offer.price.toString(),
    priceFiat: offer.price.mul(currency.rate).toString(),
    currency: currency.displayName,
    currencyFiat: currentFiat.displayName,
    divider: ' ',
  }

  const displayName = name
    ? <ShortenTextTooltip value={name} maxLength={30} />
    : <RifAddress pretext="Unknown RNS:" value={tokenId} />

  const details = {
    NAME: displayName,
    'RENEWAL DATE': expirationDate.toLocaleDateString(),
    PRICE: <CombinedPriceCell {...priceCellProps} />,
  }

  const handleSubmit = async (): Promise<void> => {
    setProcessingTx(true)
    appDispatch({
      type: 'SET_IS_LOADING',
      payload: {
        isLoading: true,
        id: 'contract',
        message: 'Executing cancel...',
      },
    })

    try {
      const rnsContract = RNSContract.getInstance(web3 as Web3, currency.symbol)
      const marketPlaceContract = MarketplaceContract.getInstance(web3 as Web3)

      // Get gas price
      const gasPrice = await (web3 as Web3).eth.getGasPrice()
        .catch((error: Error) => {
          throw new UIError({
            error,
            id: 'web3-getGasPrice',
            text: 'Could not retreive gas price from the blockchain.',
          })
        })

      // Send unapproval transaction
      const unapproveReceipt = await rnsContract.unapprove(
        tokenId, { from: account, gasPrice },
      ).catch((error) => {
        throw new UIError({
          error,
          id: 'contract-rns-unapprove',
          text: `Could not unapprove domain ${name}.`,
        })
      })
      logger.info('unapproveReceipt:', unapproveReceipt)

      // Send Unplacement transaction
      const unplaceReceipt = await marketPlaceContract.unplace(
        tokenId, { from: account, gasPrice },
      ).catch((error) => {
        throw new UIError({
          error,
          id: 'contract-marketplace-unplace',
          text: `Could not unplace domain ${name}.`,
        })
      })
      logger.info('unplaceReceipt:', unplaceReceipt)

      if (unplaceReceipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'RNS_CANCEL',
            txHash: unplaceReceipt.transactionHash,
            contractActionData: { id: tokenId },
          },
        })
      }
    } catch (e) {
      reportError(e)
    } finally {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: false,
          id: 'contract',
        },
      })
      setProcessingTx(false)
    }
  }

  const cancelingNameTitle = name
    ? shortenString(name, 30, 25)
    : shortChecksumAddress(tokenId)

  return (
    <CheckoutPageTemplate
      className="domains-checkout-page"
      backButtonProps={{
        backTo: 'domains',
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          titleTypographyProps={{ variant: 'h5', color: 'primary' }}
          title={`Canceling ${cancelingNameTitle}`}
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
        <CardActions className={classes.footer}>
          <Typography component="div">
            {'Your wallet will open and you will be asked to confirm '}
            <Box
              display="inline"
              fontWeight="fontWeightMedium"
              color={`${colors.primary}`}
            >
              two transactions
            </Box>
            {' to cancel the domain.'}
          </Typography>
          <RoundBtn onClick={handleSubmit}>
            Cancel domain
          </RoundBtn>
        </CardActions>
      </Card>
      <ProgressOverlay
        title="Canceling the domain"
        doneMsg="Your domain has been canceled!"
        inProgress={processingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            key="go_to_my_domains"
            onClick={(): void => history.push(ROUTES.RNS.SELL.BASE)}
          >
            View my domains
          </RoundBtn>,
          <RoundBtn
            key="go_to_list"
            onClick={(): void => history.push(ROUTES.RNS.BUY.BASE)}
          >
            View domain listing
          </RoundBtn>,
        ]}

      />

    </CheckoutPageTemplate>
  )
}

export default CancelDomainCheckoutPage
