import React, {
  FC, useCallback, useContext, useState,
} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box, Grow, Typography,
} from '@material-ui/core'
import { colors, Web3Store } from '@rsksmart/rif-ui'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App'
import { UIError } from 'models/UIMessage'
import Logger from 'utils/Logger'
import Web3 from 'web3'
import { StakingContract, StorageContract } from 'contracts/storage'
import {
  Props as StakingContextProps,
} from 'context/Services/storage/staking/interfaces'
import withStakingContext, { Context }
  from 'context/Services/storage/staking/Context'
import StakingFab from 'components/molecules/staking/StakingFab'
import RoundBtn from 'components/atoms/RoundBtn'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { SupportedTokenSymbol } from 'models/Token'
import { StorageGlobalContext, StorageGlobalContextProps } from 'context/Services/storage'
import useConfirmations from 'hooks/useConfirmations'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import DepositModal from 'components/organisms/staking/DepositModal'
import WithdrawModal from 'components/organisms/staking/WithdrawModal'
import StakingCard from 'components/organisms/staking/StakingCard'

const logger = Logger.getInstance()

const stakingIconSize = 10

const useStyles = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    position: 'relative',
  },
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    right: 0,
    position: 'absolute',
    zIndex: 99,
  },
  cardWrapper: {
    maxWidth: '550px',
    width: '100%',
  },
  infoContainer: {
    border: `${colors.primary} 1px solid`,
    alignItems: 'center',
    borderRadius: '50px 0px 0px 50px',
    paddingRight: theme.spacing(stakingIconSize / 2),
    backgroundColor: colors.white,
    whiteSpace: 'nowrap',
    height: theme.spacing(stakingIconSize),
  },
  stakingIcon: {
    height: theme.spacing(stakingIconSize),
    minWidth: theme.spacing(stakingIconSize),
    marginLeft: -theme.spacing(stakingIconSize / 2),
  },
  fabTitle: {
    position: 'absolute',
    top: '-25px',
    right: '15px',
  },
}))

const stakeInProgressMsg = 'Staking your funds'
const unstakeInProgressMsg = 'Unstaking your funds'

const Staking: FC = () => {
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
  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const {
    state: {
      stakes,
      totalStakedUSD,
    },
  } = useContext<StakingContextProps>(Context)
  const {
    state: { isWhitelistedProvider },
  } = useContext<StorageGlobalContextProps>(StorageGlobalContext)

  const isAwaitingConfirmations = Boolean(
    useConfirmations(['STAKING_STAKE', 'STAKING_UNSTAKE']).length,
  )

  const [isExpanded, setIsExpanded] = useState(false)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [withdrawOpened, setWithdrawOpened] = useState(false)
  const [txInProgressMessage, setTxInProgressMessage] = useState('')
  const [txCompleteMsg, setTxCompleteMsg] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  const isEnabled = account && isWhitelistedProvider

  const handleTxCompletedClose = (): void => {
    setProcessingTx(false)
    setTxOperationDone(false)
  }

  const handleDeposit = async (
    amount: number, currency: SupportedTokenSymbol,
  ): Promise<void> => {
    try {
      setTxInProgressMessage(stakeInProgressMsg)
      setProcessingTx(true)
      setTxCompleteMsg('Your funds have been staked!')
      setDepositOpened(false)

      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.stake(
        amount,
        {
          token: currency,
          from: account,
          ...parseFloat(totalStakedUSD) > 0
            ? {}
            : { gasMultiplier: 1.8 },
        },
      )

      if (receipt && receipt.status) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'STAKING_STAKE',
            txHash: receipt.transactionHash,
          },
        })
      }
    } catch (error) {
      logger.error('error depositing funds', error)
      const { customMessage } = error
      reportError(new UIError({
        error,
        id: 'contract-storage-staking',
        text: customMessage || 'Could not stake funds.',
      }))
    } finally {
      setProcessingTx(false)
    }
  }

  const handleWithdraw = async (
    amount: number, currency: SupportedTokenSymbol,
  ): Promise<void> => {
    try {
      setTxInProgressMessage(unstakeInProgressMsg)
      setProcessingTx(true)
      setTxCompleteMsg('Your funds have been unstaked!')
      setWithdrawOpened(false)
      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.unstake(
        amount, { token: currency, from: account },
      )

      if (receipt && receipt.status) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'STAKING_UNSTAKE',
            txHash: receipt.transactionHash,
          },
        })
      }
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

  const handleOpenWithdraw = async (): Promise<void> => {
    if (!web3 || !account) return
    const storageContract = StorageContract.getInstance(web3 as Web3)
    const hasUtilizedCapacity = await storageContract.hasUtilizedCapacity(
      account as string, { from: account },
    )
    setCanWithdraw(Boolean(!hasUtilizedCapacity))
    setWithdrawOpened(true)
  }

  const handleExpandClick = (): void => setIsExpanded((exp) => !exp)

  return (
    <div className={classes.wrapper}>
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
          <div className={classes.cardWrapper}>
            <StakingCard
              className={classes.infoContainer}
              onAddFundsClicked={(): void => setDepositOpened(true)}
              onWithdrawClicked={handleOpenWithdraw}
              totalStakedUSD={totalStakedUSD || '0.00'}
              isAwaitingConfirmations={isAwaitingConfirmations}
            />
          </div>
        </Grow>
        <StakingFab
          disabled={!isEnabled}
          className={classes.stakingIcon}
          onClick={handleExpandClick}
        />
      </div>
      <DepositModal
        totalStakedUSD={totalStakedUSD}
        stakes={stakes}
        onDeposit={handleDeposit}
        open={depositOpened}
        onClose={(): void => setDepositOpened(false)}
      />
      <WithdrawModal
        canWithdraw={canWithdraw}
        onClose={(): void => setWithdrawOpened(false)}
        open={withdrawOpened}
        onWithdraw={handleWithdraw}
        totalStakedUSD={totalStakedUSD}
        stakes={stakes}
      />
      <ProgressOverlay
        title={txInProgressMessage}
        doneMsg={txCompleteMsg}
        inProgress={processingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            onClick={handleTxCompletedClose}
          >
            Close
          </RoundBtn>,
        ]}

      />
    </div>
  )
}

export default withStakingContext(Staking)
