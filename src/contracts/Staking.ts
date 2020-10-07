import Staking from '@rsksmart/rif-marketplace-storage/build/contracts/Staking.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import Logger from 'utils/Logger'
import waitForReceipt, { TransactionOptions } from './utils'
import { stakingAddress } from './config'

const logger = Logger.getInstance()

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ZERO_BYTES = '0x0000000000000000000000000000000000000000000000000000000000000000'
const isNativeToken = (token: string) => token === ZERO_ADDRESS

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
    // data: string = ZERO_BYTES,
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

    const gas = await this.web3.eth.estimateGas({ from, gasPrice })

    return this.contract.methods
      .stake(isNativeToken(token) ? 0 : amount, token, ZERO_BYTES)
      .send(
        {
          from,
          gas,
          gasPrice,
          value: isNativeToken(token) ? amount : 0,
        },
        (err, txHash) => {
          if (err) return Promise.reject(err)
          return waitForReceipt(txHash, this.web3)
        },
      )
  }

  public unstake = async (
    amount: string | number,
    token: string = ZERO_ADDRESS, // native token
    // data: string = ZERO_BYTES,
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

    const gas = await this.web3.eth.estimateGas({ from, gasPrice })

    return this.contract.methods
      .unstake(amount, token, ZERO_BYTES)
      .send({ from, gas, gasPrice }, (err, txHash) => {
        if (err) return Promise.reject(err)
        return waitForReceipt(txHash, this.web3)
      })
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
