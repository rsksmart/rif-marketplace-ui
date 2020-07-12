import { Grid } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Web3Store } from '@rsksmart/rif-ui'
import InfoBar from 'components/molecules/InfoBar'
import MarketFilter from 'components/templates/marketplace/MarketFilter'
import { MarketItem } from 'models/Market'
import React, {
  Dispatch, FC, useContext, useEffect,
} from 'react'
import { RnsAction } from 'store/Market/rns/rnsActions'
import AppStore from 'store/App/AppStore'
import Marketplace, { TableHeaders } from './marketplace/Marketplace'

export interface MarketPageTemplateProps {
  className?: string
  filterItems: React.ReactNode
  headers: TableHeaders
  itemCollection: MarketItem[]
  requiresAccount?: boolean
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
  requiresAccount,
  dispatch,
  outdatedCt,
}) => {
  const classes = useStyles()
  const {
    state: { account },
  } = useContext(Web3Store)
  const { dispatch: appDispatch } = useContext(AppStore)

  useEffect(() => {
    if (requiresAccount && !account) {
      appDispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'warning',
          text: 'Please, connect your wallet.',
          // customAction: {
          //   name: 'Connect',
          //   action: () => {
          //     return <Login /> //TODO: dispatch web3dispatch action 'CONNECT' that would trigger the wallet connection modal to open
          //   }
          // }
        },
      })
    }
  }, [appDispatch, requiresAccount, account])

  return (
    <Grid container direction="row" className={`${classes.root} ${className}`}>
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
    </Grid>
  )
}

export default MarketPageTemplate
