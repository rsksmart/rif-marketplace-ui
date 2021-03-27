import React, {
  FC, useCallback, useContext, useState,
} from 'react'
import { Web3Store } from '@rsksmart/rif-ui'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App'
import { UIError } from 'models/UIMessage'
import Logger from 'utils/Logger'
import Web3 from 'web3'
import { StakingContract, StorageContract } from 'contracts/storage'
import {
  Props as StakingContextProps,
} from 'context/Services/staking/interfaces'
import RoundBtn from 'components/atoms/RoundBtn'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { SupportedTokenSymbol } from 'models/Token'
import { StorageGlobalContext, StorageGlobalContextProps } from 'context/Services/storage'
import useConfirmations from 'hooks/useConfirmations'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import StakingTemplate from 'components/organisms/staking/StakingTemplate'
import { Context } from 'context/Services/staking/Context'
import { withStakingContext } from 'context/Services/staking'

const logger = Logger.getInstance()

const stakeInProgressMsg = 'Staking your funds'
const unstakeInProgressMsg = 'Unstaking your funds'

const Staking: FC = () => {
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
    useConfirmations(['STORAGE_STAKE', 'STORAGE_UNSTAKE']).length,
  )

  const [txInProgressMessage, setTxInProgressMessage] = useState('')
  const [txCompleteMsg, setTxCompleteMsg] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  const isEnabled = Boolean(account && isWhitelistedProvider)

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
            contractAction: 'STORAGE_STAKE',
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
      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.unstake(
        amount, { token: currency, from: account },
      )

      if (receipt && receipt.status) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'STORAGE_UNSTAKE',
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

  const canWithdraw = async (): Promise<boolean> => {
    if (!web3 || !account) return false
    const storageContract = StorageContract.getInstance(web3 as Web3)
    const hasUtilizedCapacity = await storageContract.hasUtilizedCapacity(
      account as string, { from: account },
    )
    return !hasUtilizedCapacity
  }

  return (
    <>
      <StakingTemplate
        checkCanWithdraw={canWithdraw}
        isEnabled={isEnabled}
        isProcessing={isAwaitingConfirmations}
        stakedBalances={stakes}
        totalStakedUSD={totalStakedUSD}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        cantWithdrawMessage={
          `You cannot withdraw funds because all your contracts are running.
          Please wait until your contract finish`
        }
        bringToFront
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
    </>
  )
}

export default withStakingContext(Staking, 'storage/v0/stakes')
