import {
  Card, CardActions, CardContent, CardHeader, createStyles, makeStyles, MenuItem, Select, Table, TableBody, TableCell, TableRow, Theme,
} from '@material-ui/core'
import {
  Button, colors, shortenAddress, UnitsInput, Web3Store, validatedNumber,
} from '@rsksmart/rif-ui'
import PriceItem from 'components/atoms/PriceItem'
import AddressItem from 'components/molecules/AddressItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import MarketplaceContract from 'contracts/Marketplace'
import RNSContract from 'contracts/Rns'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { BLOCKCHAIN_ACTIONS } from 'store/Blockchain/blockchainActions'
import BlockchainStore from 'store/Blockchain/BlockchainStore'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import contractAdds from 'ui-config.json'
import Logger from 'utils/Logger'

const logger = Logger.getInstance()

const NETWORK: string = process.env.REACT_APP_NETWORK || 'ganache'
const rifTokenAddress = contractAdds[NETWORK].rif.toLowerCase()
const marketPlaceAddress = contractAdds[NETWORK].marketplace.toLowerCase()

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

  const currencySymbols = Object.keys(crypto)
  const currencyOptions = currencySymbols.map((symbol) => crypto[symbol].displayName)

  const [price, setPrice] = useState('')
  const [priceFiat, setPriceFiat] = useState('')
  const [currency, setCurrency] = useState('0')

  useEffect(() => {
    if (!currentOrder) {
      // Redirect from direct navigation
      history.replace(ROUTES.LANDING)
    } else if (isPendingConfirm && !currentOrder.isProcessing) {
      // Post-confirmations handle
      history.replace(ROUTES.DOMAINS.DONE.SELL)
    }
  }, [currentOrder, isPendingConfirm, history])

  if (!currentOrder) return null

  const {
    item: {
      name,
      expirationDate,
      tokenId,
    },
    isProcessing,
  } = currentOrder

  const handleSubmit = async () => {
    if (web3 && account) {
      dispatch({
        type: MARKET_ACTIONS.SET_PROG_STATUS,
        payload: {
          isProcessing: true,
        },
      })

      try {
        const rnsContract = RNSContract.getInstance(web3)
        const marketPlaceContract = MarketplaceContract.getInstance(web3)

        // Get gas price
        const gasPrice = await web3.eth.getGasPrice()

        // Send approval transaction
        const approveReceipt = await rnsContract.approve(marketPlaceAddress, tokenId, { from: account, gasPrice })
        logger.info('approveReceipt:', approveReceipt)

        // Send Placement transaction
        const placeReceipt = await marketPlaceContract.place(tokenId, rifTokenAddress, price, { from: account, gasPrice })

        if (!placeReceipt) {
          throw Error('Something unexpected happened. No receipt received from the place transaction.')
        }

        bcDispatch({
          type: BLOCKCHAIN_ACTIONS.SET_TX_HASH,
          payload: {
            txHash: placeReceipt.transactionHash,
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
        <CardHeader titleTypographyProps={{ variant: 'h5', color: 'primary' }} title={`Listing ${name || shortenAddress(tokenId)}`} />
        <CardContent>
          <div className={classes.contentDetails}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.detailKey}>NAME</TableCell>
                  <TableCell className={classes.detailValue}>{name || <AddressItem pretext="Unknown RNS:" value={tokenId} />}</TableCell>
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
      {isProcessing && <TransactionInProgressPanel {...{ isPendingConfirm }} text="Listing the domain!" progMsg="The waiting period is required to securely list your domain. Please do not close this tab until the process has finished" />}
    </CheckoutPageTemplate>
  )
}

export default DomainsCheckoutPage
