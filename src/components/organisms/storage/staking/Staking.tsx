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
import DepositModal from './DepositModal'

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
      // web3
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

  const [expanded, setExpanded] = useState(true)
  const [stakeTotal, setStakeTotal] = useState(0)
  const [depositOpened, setDepositOpened] = useState(false)

  // TODO: encapsulate into context
  const stakeApi = apis?.['storage/v0/stakes'] as StakesService
  stakeApi.connect(errorReporterFactory(appDispatch))

  // TODO: add multicurrency support
  // TODO: encapsulate into context
  const fetchStakeTotal = async () => {
    const [stakeRBTC] = await stakeApi.fetch({ account: account as string, token: zeroAddress })
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

  const onDepositHandler = () => {
    // TODO: send tx to deposit
    logger.debug('Send transaction to deposit')
   }

  // TODO: consider using withAccount HOC to wrap this action
  // so it's only expanded if an account is provided
  const handleExpandClick = () => setExpanded((exp) => !exp)

  return (
    <>
      <div className={classes.root}>
        <Grow in={expanded}>
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
              <Button rounded variant="outlined">
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
        onDeposit={onDepositHandler}
        open={depositOpened}
        onClose={() => setDepositOpened(false)}
      />
    </>
  )
}

export default Staking
