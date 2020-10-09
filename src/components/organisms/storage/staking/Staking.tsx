import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import Fab from '@material-ui/core/Fab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import {
  Box, Grid, Grow, Typography,
} from '@material-ui/core'
import { Button, colors, Web3Store } from '@rsksmart/rif-ui'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import { StakesService } from 'api/rif-marketplace-cache/storage/stakes'
import { zeroAddress } from 'context/Services/storage/interfaces'
import Logger from 'utils/Logger'
import Web3 from 'web3'
import StakingContract from 'contracts/Staking'
import StorageContract from 'contracts/storage/contract'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    border: `${colors.primary} 1px solid`,
    maxWidth: '700px',
    alignItems: 'center',
    borderRadius: '50px 0px 0px 50px',
    paddingRight: '40px',
  },
  infoColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  stakingIcon: {
    height: '80px',
    minWidth: '80px',
    marginLeft: '-40px',
  },
}))

const Staking: FC<{}> = () => {
  const classes = useStyles()

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)

  const {
    state: {
      apis,
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const [isExpanded, setIsExpanded] = useState(true)
  const [stakeTotal, setStakeTotal] = useState(0)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [withdrawOpened, setWithdrawOpened] = useState(false)

  // TODO: encapsulate into context
  const stakeApi = apis?.['storage/v0/stakes'] as StakesService
  stakeApi.connect(errorReporterFactory(appDispatch))

  // TODO: add multicurrency support
  // TODO: encapsulate into context
  // TODO: subscribe to events so we can update this value automatically
  const fetchStakeTotal = async () => {
    const [stakeRBTC] = await stakeApi.fetch({
      account: account as string, token: zeroAddress,
    })
    setStakeTotal(stakeRBTC?.total || 0)
  }

  // TODO: encapsulate into context
  // un component will mount, fetch the stake total
  useEffect(() => {
    fetchStakeTotal().catch((error) => {
      reportError(new UIError(
        {
          error,
          id: 'service-fetch',
          text: 'There was an error fetching the current balance',
        },
      ))
      logger.error(`Fetch Stake total error: ${error.message}`)
    })
  })

  const onDepositHandler = async (amount: number, token: string) => {
    //  users won't reach this point without web3 instance wouldn;'t reach
    if (!web3) return
    const stakeContract = StakingContract.getInstance(web3 as Web3)
    await stakeContract.stake(amount, token, { from: account })
    await fetchStakeTotal()
    setDepositOpened(false)
  }

  const handleWithdraw = async (amount: number, token: string) => {
    const stakeContract = StakingContract.getInstance(web3 as Web3)
    logger.debug(await stakeContract.unstake(amount, token, { from: account }))
    await fetchStakeTotal()
    setWithdrawOpened(false)
  }

  const handleOpenWithdraw = async () => {
    if (!web3) return
    const storageContract = StorageContract.getInstance(web3 as Web3)
    // Check if we can make unstake
    const hasUtilizedCapacity = await storageContract.hasUtilizedCapacity(account as string, { from: account })
    setCanWithdraw(Boolean(hasUtilizedCapacity))
    setWithdrawOpened(true)
  }

  // TODO: consider using withAccount HOC to wrap this action
  // so it's only expanded if an account is provided
  const handleExpandClick = () => setIsExpanded((exp) => !exp)

  return (
    <>
      <div className={classes.root}>
        <Grow in={isExpanded}>
          <Grid
            container
            className={classes.infoContainer}
          >
            <Grid
              item
              xs={4}
              className={classes.infoColumn}
            >
              <Typography component="div" color="secondary">
                <Box fontWeight="fontWeightRegular">
                  BALANCE
                </Box>
              </Typography>
              <Typography color="primary" variant="h6">
                {stakeTotal}
                {' '}
                RIF
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.infoColumn}
            >
              <Button
                onClick={() => setDepositOpened(true)}
                color="primary"
                rounded
                variant="outlined"
              >
                Add funds
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.infoColumn}
            >
              <Button
                onClick={handleOpenWithdraw}
                rounded
                variant="outlined"
              >
                Withdraw funds
              </Button>
            </Grid>
          </Grid>
        </Grow>
        <Fab
          className={classes.stakingIcon}
          color="primary"
          aria-label="staking"
          onClick={handleExpandClick}
        >
          <AddIcon />
        </Fab>
      </div>
      <DepositModal
        currentBalance={`${stakeTotal} RIF`}
        onDeposit={onDepositHandler}
        open={depositOpened}
        onClose={() => setDepositOpened(false)}
      />
      <WithdrawModal
        canWithdraw={canWithdraw}
        onClose={() => setWithdrawOpened(false)}
        open={withdrawOpened}
        onWithdraw={handleWithdraw}
        currentBalance={stakeTotal}
      />
    </>
  )
}

export default Staking
