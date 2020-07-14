import { Grid } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Web3Store } from '@rsksmart/rif-ui'
import InfoBar from 'components/molecules/InfoBar'
import MarketFilter from 'components/templates/marketplace/MarketFilter'
import { MarketItem } from 'models/Market'
import React, { Dispatch, FC, useContext } from 'react'
import { RnsAction } from 'store/Market/rns/rnsActions'
import Marketplace, { TableHeaders } from './marketplace/Marketplace'

export interface MarketPageTemplateProps {
  className?: string
  filterItems: React.ReactNode
  headers: TableHeaders
  itemCollection: MarketItem[]
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
  dispatch,
  outdatedCt,
}) => {
  const classes = useStyles()
  const {
    state: { account },
  } = useContext(Web3Store)

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
                      type: 'REFRESH',
                      payload: { refresh: true },
                    } as any)
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
