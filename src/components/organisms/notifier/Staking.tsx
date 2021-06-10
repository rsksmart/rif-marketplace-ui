import React, { FC, useContext, useState } from 'react'
import { SupportedTokenSymbol } from 'models/Token'
import NotifierStakingContract from 'contracts/notifier/Staking'
import { Web3Store } from '@rsksmart/rif-ui'
import Web3 from 'web3'
import RoundBtn from 'components/atoms/RoundBtn'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import useErrorReporter from 'hooks/useErrorReporter'
import Big from 'big.js'
import { ConfirmationsContext } from 'context/Confirmations'
import useConfirmations from 'hooks/useConfirmations'
import { StakingContextProps, withStakingContext } from 'context/Services/staking'
import { Context } from 'context/Services/staking/Context'
import StakingTemplate from '../staking/StakingTemplate'

type Props = {
  isEnabled: boolean
}

const stakeInProgressMsg = 'Staking your funds'
const stakeCompletedMsg = 'Your funds have been staked!'
const unstakeInProgressMsg = 'Unstaking your funds'
const unstakeCompletedMsg = 'Your funds have been unstaked!'

const Staking: FC<Props> = ({ isEnabled }) => {
  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)

  const reportError = useErrorReporter()

  const {
    state: {
      stakes,
      totalStakedUSD,
    },
  } = useContext<StakingContextProps>(Context)

  const [txInProgressMessage, setTxInProgressMessage] = useState('')
  const [txCompleteMsg, setTxCompleteMsg] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  const hasPendingConfs = Boolean(useConfirmations(
    ['NOTIFIER_STAKE', 'NOTIFIER_UNSTAKE'],
  ).length)

  const canWithdraw = async (): Promise<boolean> => {
    // TODO: add specific validation logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  }

  const handleDeposit = async (
    amount: number, currency: SupportedTokenSymbol,
  ): Promise<void> => {
    try {
      setTxInProgressMessage(stakeInProgressMsg)
      setProcessingTx(true)
      setTxCompleteMsg(stakeCompletedMsg)
      const stakingContract = NotifierStakingContract.getInstance(web3 as Web3)
      const receipt = await stakingContract.stake(Big(amount), {
        token: currency,
        from: account,
      })

      if (receipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'NOTIFIER_STAKE',
            txHash: receipt.transactionHash,
          },
        })
      }
    } catch (error) {
      const { customMessage } = error
      reportError({
        error,
        id: 'contract-notifier-staking',
        text: customMessage || 'Could not stake funds.',
      })
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
      setTxCompleteMsg(unstakeCompletedMsg)
      const stakeContract = NotifierStakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.unstake(
        Big(amount), { token: currency, from: account },
      )

      if (receipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'NOTIFIER_UNSTAKE',
            txHash: receipt.transactionHash,
          },
        })
      }
    } catch (error) {
      const { customMessage } = error
      reportError({
        error,
        id: 'contract-notifier-staking',
        text: customMessage || 'Could not withdraw your funds.',
      })
    } finally {
      setProcessingTx(false)
    }
  }

  return (
    <>
      <StakingTemplate
        checkCanWithdraw={canWithdraw}
        isEnabled={isEnabled}
        isProcessing={hasPendingConfs}
        stakedBalances={stakes}
        totalStakedUSD={totalStakedUSD}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
      <ProgressOverlay
        title={txInProgressMessage}
        doneMsg={txCompleteMsg}
        inProgress={processingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            onClick={(): void => setTxOperationDone(false)}
          >
            Close
          </RoundBtn>,
        ]}
      />
    </>
  )
}

export default withStakingContext(Staking, 'notifier/v0/stakes')
