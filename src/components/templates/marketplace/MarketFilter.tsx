import {
  Grid, createStyles, makeStyles, Theme,
} from '@material-ui/core'
import React, {
  FC, useContext,
} from 'react'
import { useHistory } from 'react-router-dom'
import {
  colors, SwitchTabs, Typography,
} from '@rsksmart/rif-ui'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import WithAccount from '../../hoc/WithAccount'

const useStyles = makeStyles((theme: Theme) => createStyles({
  filter: {
    background: colors.white,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    flex: '1 1 auto',
    padding: theme.spacing(3, 3, 0, 3),
    [theme.breakpoints.down('sm')]: {
      maxHeight: '100%',
    },
    [theme.breakpoints.up('md')]: {
      height: '100%',
      minHeight: theme.spacing(60),
    },
  },
  formHeading: {
    paddingBottom: theme.spacing(2),
  },
  switchContainer: {
    alignSelf: 'center',
    display: 'flex',
    width: '100%',
  },
}))

const MarketFilter: FC = ({ children }) => {
  const classes = useStyles()
  const {
    state: {
      currentListing,
    },
    dispatch,
  } = useContext(MarketStore)

  const history = useHistory()
  const txType = currentListing?.txType >= 1 ? 1 : 0

  const switchTxType = () => {
    dispatch({
      type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
      payload: {
        txType: txType === TxType.BUY ? TxType.SELL : TxType.BUY,
      },
    })
    history.replace(txType === TxType.BUY ? ROUTES.DOMAINS.SELL : ROUTES.DOMAINS.BUY)
  }

  const SwitchTabsComponent = (props) => (<SwitchTabs label1="Buy" label2="Sell" value={txType} {...props} />)
  const SwitchWithAccount = () => WithAccount({ WrappedComponent: SwitchTabsComponent, onChange: switchTxType })

  return (
    <>
      <div className={classes.filter}>
        <Grid className={classes.formHeading} container>
          <Grid item xs={6}>
            <Typography weight="lightBold" variant="h6" color="primary">Domains</Typography>
          </Grid>
          <Grid className={classes.switchContainer} item xs={6}>
            <SwitchWithAccount />
          </Grid>
        </Grid>
        {children}
      </div>
    </>
  )
}

export default MarketFilter
