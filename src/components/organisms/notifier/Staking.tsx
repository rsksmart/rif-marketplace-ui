import React, { FC, useContext, useState } from 'react'
import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import { SupportedTokenSymbol } from 'models/Token'
import NotifierStakingContract from 'contracts/notifier/Staking'
import { Web3Store } from '@rsksmart/rif-ui'
import Web3 from 'web3'
import RoundBtn from 'components/atoms/RoundBtn'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import useErrorReporter from 'hooks/useErrorReporter'
import Big from 'big.js'
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

  const reportError = useErrorReporter()

  const [txInProgressMessage, setTxInProgressMessage] = useState('')
  const [txCompleteMsg, setTxCompleteMsg] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

  // TODO: add real data
  const isProcessing = false
  const stakedBalances = {} as StakedBalances
  const totalStakedUSD = ''

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
        // TODO: send confirmation track request
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
        // TODO: add confirmations tracking
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
        isProcessing={isProcessing}
        stakedBalances={stakedBalances}
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

export default Staking
