import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Button, colors, UnitsInput, validatedNumber, Web3Store,
  ShortenTextTooltip,
  shortenString,
} from '@rsksmart/rif-ui'
import ItemWUnit from 'components/atoms/ItemWUnit'
import RifAddress from 'components/molecules/RifAddress'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import {
  Marketplace as MarketplaceContract,
  Rns as RNSContract,
} from 'contracts/rns'
import React, {
  FC, useContext, useEffect, useState, useCallback,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import MarketContext from 'context/Market'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'
import Logger from 'utils/Logger'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import { LoadingPayload } from 'context/App/appActions'
import { marketPlaceAddress } from 'contracts/config'
import { shortChecksumAddress } from 'utils/stringUtils'
import { getSupportedTokenByName } from 'utils/tokenUtils'
import { SupportedTokenSymbol, BaseToken } from 'models/Token'
import { ConfirmationsContext } from 'context/Confirmations'
import Web3 from 'web3'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'

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

    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifySelf: 'center',
  },
  contentDetails: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
  },
  contentTitle: {
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  footer: {
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  footerCaptions: {
    marginBottom: theme.spacing(1),
  },
  setPrice: {
    border: 'solid 0.1px black',
    maxWidth: '5em',
  },
  detailKey: {
    border: 'none',
  },
  detailValue: {
    border: 'none',
  },
}))

const DomainsCheckoutPage: FC = () => {
  const history = useHistory()

  const {
    state: {
      order,
    }, dispatch,
  } = useContext(RnsDomainsContext)

  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)
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
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)
  const [price, setPrice] = useState('')
  const [priceFiat, setPriceFiat] = useState('')
  const [currency, setCurrency] = useState('0')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  useEffect(() => (): void => {
    dispatch({
      type: 'CLEAR_ORDER',
    })
  }, [dispatch])

  if (!order) {
    history.replace(ROUTES.LANDING)
    return null
  }

  const currencySymbols = Object.keys(crypto)
  const currencyOptions = currencySymbols.map(
    (symbol) => crypto[symbol].displayName,
  )

  const {
    item: {
      name,
      expirationDate,
      tokenId,
    },
  } = order

  const handleSubmit = async (): Promise<void> => {
    const currencySymbol = currencySymbols[Number(currency)] as SupportedTokenSymbol
    const rnsContract = RNSContract.getInstance(web3 as Web3, currencySymbol)
    const marketPlaceContract = MarketplaceContract.getInstance(web3 as Web3)
    try {
      // Get gas price
      const gasPrice = await (web3 as Web3).eth.getGasPrice()
        .catch((error: Error) => {
          throw new UIError({
            error,
            id: 'web3-getGasPrice',
            text: 'Could not retreive gas price from the blockchain.',
          })
        })

      setProcessingTx(true)
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Approving domain placement...',
        } as LoadingPayload,
      })

      // Send approval transaction
      const approveReceipt = await rnsContract.approve(
        marketPlaceAddress, tokenId, { from: account, gasPrice },
      )
        .catch((error) => {
          throw new UIError({
            error,
            id: 'contract-rns-approve',
            text: `Could not approve domain ${name}.`,
          })
        })
      logger.info('approveReceipt:', approveReceipt)

      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Placing domain...',
        } as LoadingPayload,
      } as any)

      const { tokenAddress }: BaseToken = getSupportedTokenByName(currencySymbol)

      // Send Placement transaction
      const placeReceipt = await marketPlaceContract.place(
        tokenId,
        tokenAddress,
        price,
        { from: account, gasPrice },
      ).catch((error) => {
        throw new UIError({
          error,
          id: 'contract-marketplace-place',
          text: `Could not place domain ${name}.`,
        })
      })
      logger.info('placeReceipt:', placeReceipt)

      if (placeReceipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'RNS_PLACE',
            txHash: placeReceipt.transactionHash,
            contractActionData: { tokenId },
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
        } as LoadingPayload,
      } as any)
      setProcessingTx(false)
    }
  }

  const handlePriceChange = ({ target: { value } }): void => {
    // validatedNumber function gives us the closest value within limits
    const newPrice = validatedNumber(value)
    setPrice(newPrice.toString())

    if (newPrice) {
      const currencySymbol = currencySymbols[parseInt(currency, 10)]
      const newValueInFiat = newPrice * crypto[currencySymbol].rate
      setPriceFiat(newValueInFiat.toFixed(4).toString())
    } else {
      setPriceFiat('')
    }
  }

  const handleOnPriceBlur = (): void => {
    // removes 0s on the left
    const priceNumber = Number(price)
    setPrice(priceNumber.toString())
  }

  const handleSetCurrency = ({ target: { value } }): void => {
    setCurrency(value)
    const newCurrencySymbol = currencySymbols[parseInt(value, 10)]
    setPriceFiat((parseInt(price, 10) * crypto[newCurrencySymbol].rate).toString())
  }

  const submitDisabled = (): boolean => Number(price) <= 0

  const displayName = name
    ? <ShortenTextTooltip value={name} maxLength={30} />
    : <RifAddress pretext="Unknown RNS:" value={tokenId} />

  const listingNameTitle = name
    ? shortenString(name, 30, 25)
    : shortChecksumAddress(tokenId)

  return (
    <CheckoutPageTemplate
      isProcessing={order.isProcessing}
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
          title={`Listing ${listingNameTitle}`}
        />
        <CardContent>
          <div className={classes.contentDetails}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.detailKey}>NAME</TableCell>
                  <TableCell className={classes.detailValue}>
                    {displayName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.detailKey}>
                    RENEWAL DATE
                  </TableCell>
                  <TableCell className={classes.detailValue}>
                    {expirationDate && expirationDate.toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.detailKey}>CURRENCY</TableCell>
                  <TableCell
                    className={`${classes.detailValue} ${classes.setPrice}`}
                  >
                    <Select
                      labelId="currency-select"
                      id="currency-select"
                      value={currency}
                      onChange={handleSetCurrency}
                      disabled={currencyOptions.length <= 1}
                    >
                      {currencyOptions.map((option, i) => (
                        <MenuItem key={option} value={i}>{option}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.detailKey}>
                    SET PRICE
                  </TableCell>
                  <TableCell
                    className={`${classes.detailValue} ${classes.setPrice}`}
                  >
                    <UnitsInput
                      handleOnChange={handlePriceChange}
                      handleOnBlur={handleOnPriceBlur}
                      units={currencyOptions[parseInt(currency, 10)]}
                      value={price}
                      error={Number(price) <= 0}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.detailKey}>USD PRICE</TableCell>
                  <TableCell className={classes.detailValue}>
                    <ItemWUnit
                      type="normalGrey"
                      value={priceFiat}
                      unit={currentFiat.displayName}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardActions className={classes.footer}>
          <Typography>
            {'Your wallet will open and you will be asked to confirm '}
            <Box
              display="inline"
              fontWeight="fontWeightMedium"
              color={`${colors.primary}`}
            >
              two transactions
            </Box>
            {' to list the domain.'}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            rounded
            shadow
            onClick={handleSubmit}
            disabled={submitDisabled()}
          >
            List domain
          </Button>
        </CardActions>
      </Card>
      <ProgressOverlay
        title="Listing the domain!"
        doneMsg="Your domain has been listed!"
        inProgress={processingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            key="go_to_my_domains"
            onClick={
              (): void => history.push(ROUTES.RNS.SELL.BASE, { refresh: true })
            }
          >
            View my domains
          </RoundBtn>,
          <RoundBtn
            key="go_to_list"
            onClick={
              (): void => history.push(ROUTES.RNS.BUY.BASE, { refresh: true })
            }
          >
            View domain listing
          </RoundBtn>,
        ]}

      />
    </CheckoutPageTemplate>
  )
}

export default DomainsCheckoutPage
