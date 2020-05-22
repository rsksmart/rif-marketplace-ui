import React, { FC, useContext, useEffect } from 'react'
import MarketFilter from 'components/templates/marketplace/MarketFilter'
import Marketplace, { TableHeaders } from 'components/templates/marketplace/Marketplace'
import { MarketItemType } from 'models/Market'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { Web3Store } from '@rsksmart/rif-ui'
import MarketStore from 'store/Market/MarketStore'
import { fetchExchangeRatesFor, tokenDisplayNames } from 'api/rif-marketplace-cache/exchangeRateController'
import { MARKET_ACTIONS } from 'store/Market/marketActions'

export interface MarketPageTemplateProps {
  className: string
  filterItems: React.ReactNode
  headers: TableHeaders
  itemCollection: MarketItemType[]
  accountRequired?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  resultsContainer: {
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(3),
    },
  },
  filtersContainer: {
    width: '100%',
  },
}))

const MarketPageTemplate: FC<MarketPageTemplateProps> = ({
  className,
  filterItems,
  itemCollection,
  headers,
  accountRequired,
}) => {
  const classes = useStyles()
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: {
      exchangeRates: {
        currentFiat: { symbol: fiatSymbol },
        crypto: {
          rif,
        },
      },
    },
    dispatch,
  } = useContext(MarketStore)

  const { rate: rifXr, displayName } = rif
  useEffect(() => {
    if (!rifXr) {
      fetchExchangeRatesFor(fiatSymbol)
        .then((rates: { [fiatSymbol: string]: number }[]) => {
          const payload = Object.keys(rates).reduce((acc, i) => {
            const symbol = rates[i].token

            if (symbol === 'rif') { // FIXME: This is here only temporary as atm we don't want to support more than RIF.
              acc[symbol] = {
                rate: rates[i][fiatSymbol],
                displayName: tokenDisplayNames[symbol],
              }
            }
            return acc
          }, {})
          dispatch({
            type: MARKET_ACTIONS.SET_EXCHANGE_RATE,
            payload,
          })
        })
    }
  }, [fiatSymbol, rifXr, displayName, dispatch])

  return (
    <Grid container direction="row" className={`${classes.root} ${className}`}>
      {accountRequired && !account && <p>Please sign in to your wallet</p>}
      {(!accountRequired || account)
        && (
          <>
            <Grid className={classes.filtersContainer} item sm={12} md={3}>
              <MarketFilter>{filterItems}</MarketFilter>
            </Grid>
            <Grid className={classes.resultsContainer} item sm={12} md={9}>
              <Marketplace items={itemCollection} headers={headers} />
            </Grid>
          </>
        )}
    </Grid>
  )
}

export default MarketPageTemplate
