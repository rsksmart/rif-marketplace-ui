import React, {
  FC, useCallback, useContext, useState,
} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box, Grid, Grow, Typography,
} from '@material-ui/core'
import { Button, colors, Web3Store } from '@rsksmart/rif-ui'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import Logger from 'utils/Logger'
import Web3 from 'web3'
import StakingContract from 'contracts/Staking'
import StorageContract from 'contracts/storage/contract'
import { Props as StakingContextProps } from 'context/Services/storage/staking/interfaces'
import StakingBalance from 'components/molecules/storage/StakingBalance'
import StakingFab from 'components/molecules/storage/StakingFab'
import withStakingContext, { StakingContext } from 'context/Services/storage/staking/Context'
import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import { TokenAddressees } from 'context/Market/storage/interfaces'
import { JobDoneBox } from 'components/molecules'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import GridRow from 'components/atoms/GridRow'
import GridItem from 'components/atoms/GridItem'
import RoundBtn from 'components/atoms/RoundBtn'
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
  fabTitle: {
    position: 'absolute',
    top: '-20px',
    right: '20px',
  },
  progressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    width: '100vw',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
}))

const stakeInProgressMsg = 'Staking your funds'
const unstakeInProgressMsg = 'Unstaking your funds'

const Staking: FC<{}> = () => {
  const classes = useStyles()

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)

  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const {
    state: {
      // totalStaked,
      totalStakedUSD,
      isAwaiting,
    },
    dispatch,
  } = useContext<StakingContextProps>(StakingContext)

  const [isExpanded, setIsExpanded] = useState(false)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [withdrawOpened, setWithdrawOpened] = useState(false)
  const [txInProgressMessage, setTxInProgressMessage] = useState('')
  const [txCompleteMsg, setTxCompleteMsg] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [showTxInProgress, setShowTxInProgress] = useState(false)

  const handleTxCompletedClose = () => {
    setShowTxInProgress(false)
    setProcessingTx(false)
    setTxOperationDone(false)
  }

  const handleDeposit = async (amount: number, currency: SupportedTokens) => {
    //  users won't reach this point without a web3 instance
    if (!web3) return
    try {
      setTxInProgressMessage(stakeInProgressMsg)
      setProcessingTx(true)
      setShowTxInProgress(true)
      setTxCompleteMsg('Your funds have been staked!')
      setDepositOpened(false)

      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.stake(amount, TokenAddressees[currency], { from: account })

      if (receipt) {
        setTxOperationDone(true)
      }
      dispatch({
        type: 'SET_IS_AWAITING',
        payload: { isAwaiting: true },
      })
    } catch (error) {
      logger.error('error depositing funds', error)
      reportError(new UIError({
        error,
        id: 'contract-storage-staking',
        text: 'Could not stake funds.',
      }))
    } finally {
      setProcessingTx(false)
    }
  }

  const handleWithdraw = async (amount: number, currency: SupportedTokens) => {
    //  users won't reach this point without a web3 instance
    if (!web3) return
    try {
      setTxInProgressMessage(unstakeInProgressMsg)
      setProcessingTx(true)
      setShowTxInProgress(true)
      setTxCompleteMsg('Your funds have been unstaked!')
      setWithdrawOpened(false)
      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.unstake(amount, TokenAddressees[currency], { from: account })

      if (receipt) {
        setTxOperationDone(true)
      }
      // TODO: remove when events are attached
      dispatch({
        type: 'SET_NEEDS_REFRESH',
        payload: { needsRefresh: true },
      })
    } catch (error) {
      logger.error('error withdrawing funds', error)
      reportError(new UIError({
        error,
        id: 'contract-storage-staking',
        text: 'Could not withdraw your funds.',
      }))
    } finally {
      setProcessingTx(false)
    }
  }

  const handleOpenWithdraw = async () => {
    if (!web3) return
    const storageContract = StorageContract.getInstance(web3 as Web3)
    const hasUtilizedCapacity = await storageContract.hasUtilizedCapacity(account as string, { from: account })
    setCanWithdraw(Boolean(hasUtilizedCapacity))
    setWithdrawOpened(true)
  }

  // TODO: consider using withAccount HOC to wrap this action
  // so it's only expanded if an account is provided
  const handleExpandClick = () => setIsExpanded((exp) => !exp)

  const renderProgressOverlay = (): JSX.Element | null => {
    if (showTxInProgress && (processingTx || txOperationDone)) {
      return (
        <div className={classes.progressContainer}>
          {
            processingTx && (
              <TransactionInProgressPanel
                text={txInProgressMessage}
                progMsg="The waiting period is required to securely complete your action.
              Please do not close this tab until the process has finished."
              />
            )
          }
          {
            txOperationDone && (
              <TxCompletePageTemplate>
                <JobDoneBox text={txCompleteMsg} />
                <GridRow justify="center">
                  <GridItem>
                    <RoundBtn
                      onClick={handleTxCompletedClose}
                    >
                      Close
                    </RoundBtn>
                  </GridItem>
                </GridRow>
              </TxCompletePageTemplate>
            )
          }
        </div>
      )
    }
    return null
  }

  return (
    <>
      <div className={classes.root}>
        <Typography
          className={classes.fabTitle}
          component="div"
          color="primary"
        >
          <Box fontWeight="fontWeightRegular">
            Staking
          </Box>
        </Typography>
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
              <StakingBalance
                isLoading={isAwaiting}
                totalStaked={isAwaiting ? '' : totalStakedUSD}
                units={isAwaiting ? '-' : 'USD'}
              />
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
        <StakingFab className={classes.stakingIcon} onClick={handleExpandClick} />
      </div>
      {/* TODO: current balance should be a Record<SupportedTokens, string> */}
      <DepositModal
        currentBalance={`${totalStakedUSD} USD`}
        onDeposit={handleDeposit}
        open={depositOpened}
        onClose={() => setDepositOpened(false)}
      />
      {/* TODO: current balance should be a Record<SupportedTokens, string> */}
      <WithdrawModal
        canWithdraw={canWithdraw}
        onClose={() => setWithdrawOpened(false)}
        open={withdrawOpened}
        onWithdraw={handleWithdraw}
        currentBalance={Number(totalStakedUSD)}
      />
      {renderProgressOverlay()}
    </>
  )
}

export default withStakingContext(Staking)
