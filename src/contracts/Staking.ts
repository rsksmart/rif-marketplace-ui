import Staking from '@rsksmart/rif-marketplace-storage/build/contracts/Staking.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import Logger from 'utils/Logger'
import { zeroAddress } from 'context/Services/storage/interfaces'
import { convertToWeiString } from 'utils/parsers'
import waitForReceipt, { TransactionOptions } from './utils'
import { stakingAddress } from './config'

const logger = Logger.getInstance()
export type StorageStakingContractErrorId = 'contract-storage-staking'

const ZERO_BYTES = '0x0000000000000000000000000000000000000000000000000000000000000000'

class StakingContract {
  public static getInstance(web3: Web3): StakingContract {
    if (!StakingContract.instance) {
      StakingContract.instance = new StakingContract(web3)
    }
    return StakingContract.instance
  }

  private static instance: StakingContract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(
      Staking.abi as AbiItem[],
      stakingAddress,
    )
    this.web3 = web3
  }

  public stake = async (
    amount: string | number,
    token: string = zeroAddress, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    if (amount < 0) {
      throw new Error('amount should greater then 0')
    }

    const gasPrice = await this.web3.eth.getGasPrice().catch((error: Error) => {
      logger.error('error getting gas price, error:', error)
      throw error
    })

    const amountWei = convertToWeiString(amount)

    const stakeTask = this.contract.methods.stake(
      amountWei,
      token,
      ZERO_BYTES,
    )
    const estimatedGas = await stakeTask.estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.3)

    return stakeTask.send(
      {
        from,
        gas,
        gasPrice,
        value: amountWei,
      },
      (err, txHash) => {
        if (err) return Promise.reject(err)
        return waitForReceipt(txHash, this.web3)
      },
    )
  }

  public unstake = async (
    amount: string | number,
    token: string = zeroAddress, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    if (amount < 0) {
      throw new Error('amount should greater then 0')
    }

    const gasPrice = await this.web3.eth.getGasPrice().catch((error: Error) => {
      logger.error('error getting gas price, error:', error)
      throw error
    })

    const amountWei = convertToWeiString(amount)

    const unstakeTask = this.contract.methods.unstake(amountWei, token, ZERO_BYTES)
    const estimatedGas = await unstakeTask.estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.3)

    return unstakeTask.send({ from, gas, gasPrice }, (err, txHash) => {
      if (err) return Promise.reject(err)
      return waitForReceipt(txHash, this.web3)
    })
  }

  public totalStakedFor = (
    account: string,
    token: string = zeroAddress, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    return this.contract.methods.totalStakedFor(account, token).call({ from })
  }

  // FIXME: what is this function for?
  public totalStaked = (
    token: string = zeroAddress, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    return this.contract.methods.totalStaked(token).call({ from })
  }
}

export default StakingContract
