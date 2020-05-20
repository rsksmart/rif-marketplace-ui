import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import ERC721 from '@rsksmart/erc721/ERC721Data.json'
import ERC721SimplePlacements from '@rsksmart/rif-marketplace-nfts/ERC721SimplePlacementsABI.json'
import PriceItem from 'components/atoms/PriceItem'
import CombinedPriceCell from 'components/molecules/CombinedPriceCell'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import CheckoutPageTemplate from 'components/templates/CheckoutPageTemplate'
import { useHistory } from 'react-router-dom'
import {
  Button, Card, CardActions, CardContent, CardHeader, colors, MenuItem, Select, Table, TableBody, TableCell, TableRow, UnitsInput, Web3Store, shortenAddress,
} from '@rsksmart/rif-ui'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import ContractWrapper from 'utils/blockchain.utils'
import Web3 from 'web3'
import contractAdds from 'ui-config.json'
import Logger from 'utils/Logger'
import AddressItem from 'components/molecules/AddressItem'


const logger = Logger.getInstance()

const NETWORK: string = process.env.REACT_APP_NETWORK || 'ganache'
const rifTokenAddress = contractAdds[NETWORK].rif.toLowerCase()
const rnsAddress = contractAdds[NETWORK].rnsDotRskOwner.toLowerCase()
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
  const Contract = (contract) => ContractWrapper(contract, (web3 as Web3), (account as string))

  const currencySymbols = Object.keys(crypto)
  const currenyOptions = currencySymbols.map((symbol) => crypto[symbol].displayName)

  const [price, setPrice] = useState('')
  const [priceFiat, setPriceFiat] = useState('')
  const [currency, setCurrency] = useState('0')

  useEffect(() => {
    if (!currentOrder) {
      history.replace(ROUTES.LANDING)
    }
  }, [currentOrder, history])

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
        type: MARKET_ACTIONS.SELECT_ITEM,
        payload: {
          ...currentOrder,
          isProcessing: true,
        },
      })
      const rnsContract = await Contract(ERC721).at(rnsAddress)
      const marketPlaceContract = await Contract({ abi: ERC721SimplePlacements }).at(marketPlaceAddress)

      try {
        const approveReceipt = await rnsContract.approve(marketPlaceAddress, tokenId)
        logger.info('approveReciept:', approveReceipt)

        const receipt = await marketPlaceContract.place(tokenId, rifTokenAddress, web3.utils.toWei(price))
        logger.info('place receipt:', receipt)

        dispatch({
          type: MARKET_ACTIONS.SELECT_ITEM,
          payload: {
            ...currentOrder,
            isProcessing: false,
          },
        })
        history.replace(ROUTES.DOMAINS.DONE.SELL)
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

  const handlePriceChange = (event) => {
    const { target: { value: newValue } } = event
    const newValueInt = parseFloat(newValue)

    if (newValueInt || newValue === '') {
      setPrice(newValue)

      if (newValue) {
        const currencySymbol = currencySymbols[parseInt(currency, 10)]
        const newValueInFiat = newValueInt * crypto[currencySymbol].rate
        setPriceFiat(newValueInFiat.toFixed(4).toString())
      } else {
        setPriceFiat('')
      }
    }
  }

  const handleSetCurrency = ({ target: { value } }) => {
    setCurrency(value)
    const newCurrencySymbol = currencySymbols[parseInt(value, 10)]
    setPriceFiat((parseInt(price, 10) * crypto[newCurrencySymbol].rate).toString())
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
                          currency: currenyOptions[parseInt(currency, 10)],
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
                          disabled={currenyOptions.length <= 1}
                        >
                          {currenyOptions.map((option, i) => <MenuItem key={option} value={i}>{option}</MenuItem>)}
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.detailKey}>SET PRICE</TableCell>
                      <TableCell className={`${classes.detailValue} ${classes.setPrice}`}>
                        <UnitsInput
                          handleOnChange={handlePriceChange}
                          handleOnBlur={() => { }} // eslint-disable-line @typescript-eslint/no-empty-function
                          // FIXME: make callback optional in rif-ui
                          units={currenyOptions[parseInt(currency, 10)]}
                          value={price}
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
              >
                List domain
              </Button>
            </CardActions>
          )}
      </Card>
      {isProcessing && <TransactionInProgressPanel text="Listing the domain!" progMsg="The waiting period is required to securely list your domain. Please do not close this tab until the process has finished" />}
    </CheckoutPageTemplate>
  )
}

export default DomainsCheckoutPage
