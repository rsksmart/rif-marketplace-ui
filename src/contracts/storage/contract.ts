import StorageManager from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import Logger from 'utils/Logger'
import { zeroAddress } from 'context/Services/storage/interfaces'
import { encodeHash, prefixArray } from './utils'
import waitForReceipt, { TransactionOptions } from '../utils'
import { storageAddress } from '../config'

const logger = Logger.getInstance()

export type StorageContractErrorId = 'contract-storage'

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

  public newAgreement = async (
    details: {
      fileHash: string
      provider: string
      size: string
      billingPeriod: number
      token: string
      amount: string
    },
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const {
      fileHash,
      provider,
      size,
      billingPeriod,
      amount,
    } = details
    const { from } = txOptions
    const dataReference = encodeHash(fileHash)

    const newAgreementTask = this.contract.methods
      .newAgreement(
        dataReference,
        provider,
        size,
        billingPeriod,
        zeroAddress,
        0,
        [],
        [],
        zeroAddress,
      )

    const gasPrice = await this.web3.eth.getGasPrice().catch((error: Error) => {
      logger.error('error getting gas price, error:', error)
      throw error
    })

    const gas = await newAgreementTask.estimateGas({
      from,
      gasPrice,
      value: amount,
    })
    const txHash = await newAgreementTask.send({
      from, gas, gasPrice, value: amount,
    }, (err, response) => {
      if (err) return Promise.reject(err)
      return waitForReceipt(response, this.web3)
    })

    return txHash
  }

  public setOffer = async (
    capacityMB: string,
    billingPeriods: number[][],
    billingRbtcWeiPrices: string[][],
    tokens: string[],
    peerId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    const encodedPeerId = encodeHash(peerId).map((el) => el.replace('0x', ''))
    const prefixedMsg = prefixArray(encodedPeerId, '01', 64).map(
      (el) => `0x${el}`,
    )

    const gasPrice = await this.web3.eth.getGasPrice().catch((error: Error) => {
      logger.error('error getting gas price, error:', error)
      throw error
    })

    const setOffer = await this.contract.methods.setOffer(
      capacityMB,
      billingPeriods,
      billingRbtcWeiPrices,
      tokens,
      prefixedMsg,
    )

    return setOffer.send(
      {
        from,
        gas: Math.floor((await setOffer.estimateGas({ from, gasPrice })) * 1.1),
        gasPrice,
      }, (err: Error, txHash: string) => {
        if (err) return Promise.reject(err)
        return waitForReceipt(txHash, this.web3)
      },
    )
  }

  public terminateOffer = async (
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    const gasPrice = await this.web3.eth.getGasPrice().catch((error: Error) => {
      logger.error('error getting gas price, error:', error)
      throw error
    })

    const estimatedGas = await this.contract.methods
      .terminateOffer()
      .estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    return this.contract.methods
      .terminateOffer()
      .send({ from, gas, gasPrice },
        (err: Error, txHash: string) => {
          if (err) return Promise.reject(err)
          return waitForReceipt(txHash, this.web3)
        })
  }
}

export default StorageContract
