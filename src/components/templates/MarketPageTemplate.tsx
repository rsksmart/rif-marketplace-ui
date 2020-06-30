import { Grid } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Web3Store } from '@rsksmart/rif-ui'
import { fetchExchangeRatesFor, tokenDisplayNames } from 'api/rif-marketplace-cache/exchangeRateController'
import InfoBar from 'components/molecules/InfoBar'
import MarketFilter from 'components/templates/marketplace/MarketFilter'
import React, { FC, useContext, useEffect, Dispatch } from 'react'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import { MarketItemType } from 'models/Market'
import Marketplace, { TableHeaders } from './marketplace/Marketplace'
import { RnsAction } from 'store/Market/rns/rnsActions'

export interface MarketPageTemplateProps {
  className?: string
  filterItems: React.ReactNode
  headers: TableHeaders
  itemCollection: MarketItemType[]
  accountRequired?: boolean
  dispatch: Dispatch<RnsAction>
  outdatedCt: number
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
  className = '',
  filterItems,
  itemCollection,
  headers,
  accountRequired,
  outdatedCt
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
      txType
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
              <InfoBar
                isVisible={!!outdatedCt}
                text={`${outdatedCt} item(s) in this listing had been updated. Please,`}
                buttonText="refresh"
                type="info"
                button={{
                  onClick: () => {
                    dispatch({
                      type: 'CLEAR_REFRESH'
                    })
                  },
                }}
              />
              <Marketplace items={itemCollection} headers={headers} />
            </Grid>
          </>
        )}
    </Grid>
  )
}

export default MarketPageTemplate
