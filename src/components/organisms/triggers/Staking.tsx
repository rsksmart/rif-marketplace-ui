import React, { FC } from 'react'
import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import StakingTemplate from '../staking/StakingTemplate'

const Staking: FC = () => {
  const isEnabled = true
  const isProcessing = false
  const stakedBalances = {} as StakedBalances
  const totalStakedUSD = ''

  const canWithdraw = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return false
  }

  const handleDeposit = (): Promise<void> => Promise.resolve()
  const handleWithdraw = (): Promise<void> => Promise.resolve()

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
    </>
  )
}

export default Staking
