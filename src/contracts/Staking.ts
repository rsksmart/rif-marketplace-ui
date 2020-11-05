import Staking from '@rsksmart/rif-marketplace-storage/build/contracts/Staking.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import Logger from 'utils/Logger'
import { convertToWeiString } from 'utils/parsers'
import { ZERO_ADDRESS } from 'constants/strings'
import { TransactionOptions } from './interfaces'
import withWaitForReceipt from './utils'
import { stakingAddress } from './config'

const logger = Logger.getInstance()
export type StorageStakingContractErrorId = 'contract-storage-staking'

const zeroBytes = '0x'.padEnd(64, '0')
const extraGasPercentage = 1.3

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
    token: string = ZERO_ADDRESS, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    if (amount < 0) {
      throw new Error('amount should greater then 0')
    }

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const amountWei = convertToWeiString(amount)

    const stakeTask = this.contract.methods.stake(amountWei, token, zeroBytes)
    const estimatedGas = await stakeTask.estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * extraGasPercentage)

    return stakeTask.send(
      {
        from,
        gas,
        gasPrice,
        value: amountWei,
      },
      withWaitForReceipt(this.web3),
    )
  }

  public unstake = async (
    amount: string | number,
    token: string = ZERO_ADDRESS, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    if (amount < 0) {
      throw new Error('amount should greater then 0')
    }

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const amountWei = convertToWeiString(amount)

    const unstakeTask = this.contract.methods.unstake(
      amountWei,
      token,
      zeroBytes,
    )
    const estimatedGas = await unstakeTask.estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * extraGasPercentage)

    return unstakeTask.send({ from, gas, gasPrice }, withWaitForReceipt(this.web3))
  }

  public totalStakedFor = (
    account: string,
    token: string = ZERO_ADDRESS, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    return this.contract.methods.totalStakedFor(account, token).call({ from })
  }

  public totalStaked = (
    token: string = ZERO_ADDRESS, // native token
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    return this.contract.methods.totalStaked(token).call({ from })
  }
}

export default StakingContract
