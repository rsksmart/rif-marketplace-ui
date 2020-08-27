import { Grid } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Web3Store } from '@rsksmart/rif-ui'
import InfoBar from 'components/molecules/InfoBar'
import MarketFilter from 'components/templates/marketplace/MarketFilter'
import React, {
  Dispatch, FC, useContext, useEffect,
} from 'react'
import AppContext from 'context/App/AppContext'
import { MessagePayload } from 'context/App/appActions'
import Marketplace, { MarketplaceProps } from './marketplace/Marketplace'
import { AppContextProps } from '../../context/App/AppContext'

export interface MarketPageTemplateProps extends MarketplaceProps {
  className?: string
  filterItems: React.ReactNode
  requiresAccount?: boolean
  dispatch: Dispatch<any>
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
  requiresAccount,
  dispatch,
  outdatedCt,
  ...props
}) => {
  const classes = useStyles()
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: {
      loaders,
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)

  const isLoadingFilters = loaders.filters
  const isLoadingItems = loaders.data

  useEffect(() => {
    if (requiresAccount && !account) {
      appDispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'warning',
          text: 'Please, connect your wallet.',
          id: 'wallet',
          // customAction: {
          //   name: 'Connect',
          //   action: () => {
          //     return <Login /> //TODO: dispatch web3dispatch action 'CONNECT' that would trigger the wallet connection modal to open
          //   }
          // }
        } as MessagePayload,
      } as any)
    }
  }, [appDispatch, requiresAccount, account])

  return (
    <Grid container direction="row" className={`${classes.root} ${className}`}>
      <Grid className={classes.filtersContainer} item sm={12} md={3}>
        <MarketFilter isLoading={isLoadingFilters}>{filterItems}</MarketFilter>
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
        <Marketplace isLoading={isLoadingItems} {...props} />
      </Grid>
    </Grid>
  )
}

export default MarketPageTemplate
