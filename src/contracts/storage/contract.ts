import StorageManager
  from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem, asciiToHex } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import Logger from 'utils/Logger'
import { ZERO_ADDRESS } from 'constants/strings'
import { convertToWeiString } from 'utils/parsers'
import { encodeHash, prefixArray } from './utils'
import withWaitForReceipt, { TransactionOptions } from '../utils'
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
      sizeMB: string
      billingPeriod: number
      token: string
      amount: string
    },
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const {
      fileHash, provider, sizeMB, billingPeriod, amount,
    } = details
    const { from } = txOptions
    const dataReference = encodeHash(fileHash)

    const newAgreementTask = this.contract.methods.newAgreement(
      dataReference,
      provider,
      sizeMB,
      billingPeriod,
      ZERO_ADDRESS,
      0,
      [],
      [],
      ZERO_ADDRESS,
    )

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const gas = await newAgreementTask.estimateGas({
      from,
      gasPrice,
      value: amount,
    })
    return newAgreementTask.send(
      {
        from,
        gas,
        gasPrice,
        value: amount,
      },
      withWaitForReceipt(this.web3),
    )
  }

  public depositFunds = async (
    {
      amount, dataReference, provider, token,
    }: {
      amount: string
      dataReference: string
      provider: string
      token: string
    },
    { from }: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const newTask = this.contract.methods.depositFunds(
      token,
      amount,
      [asciiToHex(dataReference)],
      provider,
    )

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error while getting gas price:', error)
        throw error
      })
    const gas = await newTask.estimateGas({
      from,
      gasPrice,
    })

    return newTask.send({
      from,
      gas,
      gasPrice,
    },
    withWaitForReceipt(this.web3))
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
    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
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
      },
      withWaitForReceipt(this.web3),
    )
  }

  public terminateOffer = async (
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const estimatedGas = await this.contract.methods
      .terminateOffer()
      .estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    return this.contract.methods
      .terminateOffer()
      .send(
        { from, gas, gasPrice },
        withWaitForReceipt(this.web3),
      )
  }

  public hasUtilizedCapacity = async (
    account: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const { from } = txOptions

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const gas = await this.web3.eth.estimateGas({
      from,
      gasPrice,
    })

    return this.contract.methods
      .hasUtilizedCapacity(account)
      .call({ from, gas, gasPrice })
  }

  public withdrawFunds = async (
    {
      dataReference,
      provider,
      tokens,
      amounts,
    }: {
      dataReference: string
      provider: string
      tokens: string[]
      amounts: string[]
    },
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const encodedDataReference = asciiToHex(dataReference)
    const { from } = txOptions

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const weiAmounts = amounts.map(convertToWeiString)
    const withdrawFundsTask = await this.contract.methods
      .withdrawFunds([encodedDataReference], provider, tokens, weiAmounts)

    const estimatedGas = await withdrawFundsTask.estimateGas({ from, gasPrice })
      .catch((error: Error) => {
        logger.error('error estimating gas, error:', error)
        throw error
      })

    const gas = Math.floor(estimatedGas * 1.1)

    return withdrawFundsTask.send(
      {
        from,
        gas,
        gasPrice,
      },
      withWaitForReceipt(this.web3),
    )
  }

  public payoutFunds = async (
    {
      creatorOfAgreement,
      dataReferences = [],
      token = ZERO_ADDRESS,
    }: {
      creatorOfAgreement: string
      dataReferences: string[]
      token: string
    },
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> => {
    const encodedDataReferences = dataReferences.map(asciiToHex)
    const { from } = txOptions

    const gasPrice = await this.web3.eth.getGasPrice()
      .catch((error: Error) => {
        logger.error('error getting gas price, error:', error)
        throw error
      })

    const payoutFundsTask = await this.contract.methods
      .payoutFunds([encodedDataReferences], [creatorOfAgreement], token, from)

    const estimatedGas = await payoutFundsTask.estimateGas({ from, gasPrice })
      .catch((error: Error) => {
        logger.error('error estimating gas, error:', error)
        throw error
      })

    const gas = Math.floor(estimatedGas * 1.1)

    return payoutFundsTask.send(
      {
        from,
        gas,
        gasPrice,
      },
      withWaitForReceipt(this.web3),
    )
  }
}

export default StorageContract
