import Staking from '@rsksmart/rif-marketplace-storage/build/contracts/Staking.json'

import { convertToWeiString } from 'utils/parsers'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'
import { stakingAddress, StorageSupportedTokens } from '../config'
import { SUPPORTED_TOKENS, TxOptions } from '../interfaces'
import { getTokens } from '../utils'
import ContractWithTokens from '../wrappers/contract-using-tokens'

export type StorageStakingContractErrorId = 'contract-storage-staking'

const zeroBytes = '0x'.padEnd(64, '0')
const extraGasPercentage = 1.3

class StakingContract extends ContractWithTokens {
  public static getInstance(web3: Web3): StakingContract {
    if (!StakingContract.instance) {
      StakingContract.instance = new StakingContract(
        web3,
        new web3.eth.Contract(
          Staking.abi as AbiItem[],
          stakingAddress,
        ),
        getTokens(StorageSupportedTokens),
        'contract-storage-staking',
      )
    }
    return StakingContract.instance
  }

  private static instance: StakingContract

  public stake(
    amount: string | number,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    if (amount < 0) {
      throw new Error('amount should greater then 0')
    }

    const { tokenAddress } = this.getToken(txOptions.token)
    const amountWei = convertToWeiString(amount)

    const stakeTx = this.contract.methods.stake(
      amountWei,
      tokenAddress,
      zeroBytes,
    )

    return this.send(
      stakeTx,
      { ...txOptions, value: amount, gasMultiplier: extraGasPercentage },
    )
  }

  public unstake(
    amount: string | number,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    if (amount < 0) {
      throw new Error('amount should greater then 0')
    }

    const { tokenAddress } = this.getToken(txOptions.token)
    const amountWei = convertToWeiString(amount)

    const unstakeTx = this.contract.methods.unstake(
      amountWei,
      tokenAddress,
      zeroBytes,
    )
    return this.send(
      unstakeTx,
      { ...txOptions, token: SUPPORTED_TOKENS.rbtc, gasMultiplier: extraGasPercentage }, // Can be used only with native token
    )
  }

  public totalStakedFor(
    account: string,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const { tokenAddress } = this.getToken(txOptions.token)

    return this._call(
      this.contract.methods.totalStakedFor(account, tokenAddress),
      txOptions,
    )
  }

  public totalStaked(
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const { tokenAddress } = this.getToken(txOptions.token)

    return this._call(
      this.contract.methods.totalStaked(tokenAddress),
      txOptions,
    )
  }
}

export default StakingContract
