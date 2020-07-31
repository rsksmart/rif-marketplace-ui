import StorageManager from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import waitForReceipt, { TransactionOptions } from './utils'
import { storageAddress } from './config'

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
    gbCapacity: number,
    billingDaysPeriods: number[],
    billingRbtcPrices: number[],
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    // TODO: clean code
    const { from, gasPrice } = txOptions
    const bytesCapacity = gbCapacity * 10 ** 9
    const billingPeriodsSeconds = billingDaysPeriods.map(
      (days) => days * 24 * 60 * 60,
    )
    const gas = 100000
    const message = []
    const setOfferReceipt = await new Promise<TransactionReceipt>(
      (resolve, reject) => {
        this.contract.methods
          .setOffer(
            bytesCapacity,
            billingPeriodsSeconds,
            billingRbtcPrices,
            message,
          )
          .send({ from, gas, gasPrice }, async (err, txHash) => {
            if (err) return reject(err)
            try {
              const receipt = await waitForReceipt(txHash, this.web3)
              return resolve(receipt)
            } catch (e) {
              return reject(e)
            }
          })
      },
    )
    return setOfferReceipt
  }
}

export default StorageContract
