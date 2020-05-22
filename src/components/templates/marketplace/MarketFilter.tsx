import {
  Grid, createStyles, makeStyles, Theme,
} from '@material-ui/core'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import {
  colors, SwitchTabs, Typography, Web3Store,
} from '@rsksmart/rif-ui'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import LoginModal from '../../atoms/LoginModal'

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

  const {
    state: { account },
  } = useContext(Web3Store)

  // TODO: fix this code. `isSwitching` watches for changes on the account
  // so we can wait until the account gets updated to switch the tab
  const [isSwitching, setIsSwitching] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)
  const history = useHistory()
  const txType = currentListing?.txType >= 1 ? 1 : 0

  const handleCloseModal = () => {
    setModalOpened(false)
    setIsSwitching(false)
  }

  const switchTxType = () => {
    setIsSwitching(false)
    dispatch({
      type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
      payload: {
        txType: txType === TxType.BUY ? TxType.SELL : TxType.BUY,
      },
    })
    history.replace(txType === TxType.BUY ? ROUTES.DOMAINS.SELL : ROUTES.DOMAINS.BUY)
  }

  const handleSwitchChange = (): void => {
    if (txType === TxType.BUY && !account) {
      setIsSwitching(true)
      setModalOpened(true)
    } else {
      switchTxType()
    }
  }

  // TODO: to be removed when finding a better solution
  useEffect(() => {
    if (account && isSwitching) {
      switchTxType()
    }
  }, [account, isSwitching, switchTxType])

  return (
    <>
      <LoginModal open={modalOpened} handleClose={handleCloseModal} />
      <div className={classes.filter}>
        <Grid className={classes.formHeading} container>
          <Grid item xs={6}>
            <Typography weight="lightBold" variant="h6" color="primary">Domains</Typography>
          </Grid>
          <Grid className={classes.switchContainer} item xs={6}>
            <SwitchTabs label1="Buy" label2="Sell" value={txType} onChange={handleSwitchChange} />
          </Grid>
        </Grid>
        {children}
      </div>
    </>
  )
}

export default MarketFilter
