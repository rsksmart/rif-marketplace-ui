import {
  Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, MenuItem, Select, Table, TableBody, TableCell, TableRow, Theme,
} from '@material-ui/core'
import {
  Button, colors, shortenString, UnitsInput, validatedNumber, Web3Store,
} from '@rsksmart/rif-ui'
import PriceItem from 'components/atoms/PriceItem'
import AddressItem from 'components/molecules/AddressItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import DomainNameItem from 'components/molecules/DomainNameItem'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketplaceContract from 'contracts/Marketplace'
import RNSContract from 'contracts/Rns'
import React, {
  FC, useContext, useEffect, useState, useCallback,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { AddTxPayload } from 'store/Blockchain/blockchainActions'
import BlockchainStore from 'store/Blockchain/BlockchainStore'
import MarketStore from 'store/Market/MarketStore'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'
import Logger from 'utils/Logger'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { UIError } from 'models/UIMessage'
import { LoadingPayload } from 'store/App/appActions'
import { rifTokenAddress, marketPlaceAddress } from 'contracts/config'

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

const DomainsCheckoutPage: FC<{}> = () => {
  const history = useHistory()

  const {
    state: {
      order,
    }, dispatch,
  } = useContext(RnsDomainsStore)

  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
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
  const { dispatch: appDispatch } = useContext<AppStoreProps>(AppStore)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const currencySymbols = Object.keys(crypto)
  const currencyOptions = currencySymbols.map((symbol) => crypto[symbol].displayName)

  const [price, setPrice] = useState('')
  const [priceFiat, setPriceFiat] = useState('')
  const [currency, setCurrency] = useState('0')

  useEffect(() => {
    if (isPendingConfirm && order && !order.isProcessing) {
      // Post-confirmations handle
      const { item: { name } } = order
      history.replace(ROUTES.RNS.SELL.DONE, { domainName: name })
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
    },
    isProcessing,
  } = order

  const handleSubmit = async () => {
    if (web3 && account) {
      dispatch({
        type: 'SET_PROGRESS',
        payload: {
          isProcessing: true,
          id: 'contract',
        },
      })
      const rnsContract = RNSContract.getInstance(web3)
      const marketPlaceContract = MarketplaceContract.getInstance(web3)
      try {
        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()
          .catch((error: Error) => {
            throw new UIError({
              error,
              id: 'web3-getGasPrice',
              text: 'Could not retreive gas price from the blockchain.',
            })
          })

        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: 'Approving domain placement...',
          } as LoadingPayload,
        } as any)

        // Send approval transaction
        const approveReceipt = await rnsContract.approve(marketPlaceAddress, tokenId, { from: account, gasPrice })
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
        // Send Placement transaction
        const placeReceipt = await marketPlaceContract.place(tokenId, rifTokenAddress, price, { from: account, gasPrice })
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-marketplace-place',
              text: `Could not place domain ${name}.`,
            })
          })
        logger.info('placeReceipt:', placeReceipt)

        bcDispatch({
          type: 'SET_TX_HASH',
          payload: {
            txHash: placeReceipt.transactionHash,
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

  const handlePriceChange = ({ target: { value } }) => {
    // validatedNumber function gives as the closest value within limits
    const newValue = validatedNumber(value)
    setPrice(newValue)
    // we convert to number after setting the newValue because we need to allow '0.' and Number('0.') is 0
    const priceNumber = Number(newValue)

    if (priceNumber) {
      const currencySymbol = currencySymbols[parseInt(currency, 10)]
      const newValueInFiat = newValue * crypto[currencySymbol].rate
      setPriceFiat(newValueInFiat.toFixed(4).toString())
    } else {
      setPriceFiat('')
    }
  }

  const handleOnPriceBlur = () => {
    // removes 0s on the left
    const priceNumber = Number(price)
    setPrice(priceNumber.toString())
  }

  const handleSetCurrency = ({ target: { value } }) => {
    setCurrency(value)
    const newCurrencySymbol = currencySymbols[parseInt(value, 10)]
    setPriceFiat((parseInt(price, 10) * crypto[newCurrencySymbol].rate).toString())
  }

  const submitDisabled = () => Number(price) <= 0

  const displayName = name
    ? <DomainNameItem value={name} />
    : <AddressItem pretext="Unknown RNS:" value={tokenId} />

  const listingNameTitle = name
    ? shortenString(name, 30, 25)
    : shortenString(tokenId)

  const onProcessingComplete = () => {
    dispatch({
      type: 'SET_PROGRESS',
      payload: {
        isProcessing: false,
      },
    })
  }

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
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Listing ${listingNameTitle}`} />
        <CardContent>
          <div className={classes.contentDetails}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.detailKey}>NAME</TableCell>
                  <TableCell className={classes.detailValue}>{displayName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.detailKey}>RENEWAL DATE</TableCell>
                  <TableCell className={classes.detailValue}>
                    {expirationDate && expirationDate.toLocaleDateString()}
                  </TableCell>
                </TableRow>
                {isProcessing
                  && (
                    <TableRow>
                      <TableCell className={classes.detailKey}>PRICE</TableCell>
                      <TableCell className={classes.detailValue}>
                        <CombinedPriceCell {...{
                          price: `${price}`,
                          priceFiat: `${priceFiat}`,
                          currency: currencyOptions[parseInt(currency, 10)],
                          currencyFiat: currentFiat.displayName,
                          divider: ' ',
                        }}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                {!isProcessing && (
                  <>
                    <TableRow>
                      <TableCell className={classes.detailKey}>CURRENCY</TableCell>
                      <TableCell className={`${classes.detailValue} ${classes.setPrice}`}>
                        <Select
                          labelId="currency-select"
                          id="currency-select"
                          value={currency}
                          onChange={handleSetCurrency}
                          disabled={currencyOptions.length <= 1}
                        >
                          {currencyOptions.map((option, i) => <MenuItem key={option} value={i}>{option}</MenuItem>)}
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.detailKey}>SET PRICE</TableCell>
                      <TableCell className={`${classes.detailValue} ${classes.setPrice}`}>
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
                        <PriceItem type="fiat" price={`${priceFiat}`} currency={currentFiat.displayName} />
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>

          </div>
        </CardContent>
        {!isProcessing
          && (
            <CardActions className={classes.footer}>
              <p>Your wallet will open and you will be asked to confirm the transaction for listing the domain.</p>
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
          )}
      </Card>
      {isProcessing && <TransactionInProgressPanel {...{ isPendingConfirm, onProcessingComplete }} text="Listing the domain!" progMsg="The waiting period is required to securely list your domain. Please do not close this tab until the process has finished" />}
    </CheckoutPageTemplate>
  )
}

export default DomainsCheckoutPage
