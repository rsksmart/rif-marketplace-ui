import StorageManager from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import Logger from 'utils/Logger'
import waitForReceipt, { TransactionOptions } from './utils'
import { storageAddress } from './config'

const logger = Logger.getInstance()

export type StorageContractErrorId = 'contract-storage-set-offer'

class StorageContract {
  public static getInstance(web3: Web3): StorageContract {
    if (!StorageContract.instance) {
      StorageContract.instance = new StorageContract(web3)
    }
    return StorageContract.instance
  }

  private static instance: StorageContract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(
      StorageManager.abi as AbiItem[],
      storageAddress,
    )
    this.web3 = web3
  }

  public setOffer = async (
    bytesCapacity: number,
    billingPeriods: number[],
    billingRbtcWeiPrices: string[],
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    const gasPrice = await this.web3.eth.getGasPrice().catch((error: Error) => {
      logger.error('error getting gas price, error:', error)
      throw error
    })

    // TODO: check how much gas we need to send
    const gas = 100000
    const message = []

    return this.contract.methods
      .setOffer(bytesCapacity, billingPeriods, billingRbtcWeiPrices, message)
      .send({ from, gas, gasPrice }, (err, txHash) => {
        if (err) throw err
        return waitForReceipt(txHash, this.web3)
      })
  }
}

export default StorageContract
