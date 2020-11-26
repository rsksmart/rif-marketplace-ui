import Staking from '@rsksmart/rif-marketplace-storage/build/contracts/Staking.json'
import { convertToWeiString } from 'utils/parsers'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'

import { ZERO_BYTES } from 'constants/strings'
import { stakingAddress, storageSupportedTokens } from 'contracts/config'
import { SUPPORTED_TOKENS, TxOptions } from 'contracts/interfaces'
import { getTokens } from 'contracts/utils'
import ContractWithTokens from 'contracts/wrappers/contract-using-tokens'

export type StorageStakingContractErrorId = 'contract-storage-staking'

class StakingContract extends ContractWithTokens {
  public static gasMultiplier = 1.3

  public static getInstance(web3: Web3): StakingContract {
    if (!StakingContract.instance) {
      StakingContract.instance = new StakingContract(
        web3,
        new web3.eth.Contract(
          Staking.abi as AbiItem[],
          stakingAddress,
        ),
        getTokens(storageSupportedTokens),
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

    const stakeTx = this.methods.stake(
      amountWei,
      tokenAddress,
      ZERO_BYTES,
    )

    return this.send(
      stakeTx,
      {
        gasMultiplier: StakingContract.gasMultiplier,
        ...txOptions,
        value: amountWei,
      },
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

    const unstakeTx = this.methods.unstake(
      amountWei,
      tokenAddress,
      ZERO_BYTES,
    )
    return this.send(
      unstakeTx,
      {
        gasMultiplier: StakingContract.gasMultiplier,
        ...txOptions,
        token: SUPPORTED_TOKENS.rbtc, // Can be used only with native token
      },
    )
  }

  public totalStakedFor(
    account: string,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const { tokenAddress } = this.getToken(txOptions.token)
    return this._call(
      this.methods.totalStakedFor(account, tokenAddress),
      txOptions,
    )
  }

  public totalStaked(
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const { tokenAddress } = this.getToken(txOptions.token)
    return this._call(
      this.methods.totalStaked(tokenAddress),
      txOptions,
    )
  }
}

export default StakingContract
