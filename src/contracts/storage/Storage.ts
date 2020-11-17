import StorageManager from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem, asciiToHex } from 'web3-utils'

import { storageAddress, StorageSupportedTokens } from '../config'
import {
  SUPPORTED_TOKENS, SupportedTokens, TxOptions,
} from '../interfaces'
import { getTokens } from '../utils'
import ContractWithTokens from '../wrappers/contract-using-tokens'
import { encodeHash, prefixArray } from './utils'

export type StorageContractErrorId = 'contract-storage'

class StorageContract extends ContractWithTokens {
  public static getInstance(web3: Web3): StorageContract {
    if (!StorageContract.instance) {
      StorageContract.instance = new StorageContract(
        web3,
        new web3.eth.Contract(
              StorageManager.abi as AbiItem[],
              storageAddress,
        ),
        getTokens(StorageSupportedTokens),
        'contract-storage',
      )
    }
    return StorageContract.instance
  }

  private static instance: StorageContract

  public newAgreement(
    details: {
        fileHash: string
        provider: string
        sizeMB: string
        billingPeriod: number
        amount: string
      },
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const {
      fileHash, provider, sizeMB, billingPeriod, amount,
    } = details
    const dataReference = encodeHash(fileHash)
    const { tokenAddress } = this.getToken(txOptions.token)

    const newAgreementTx = this.contract.methods.newAgreement(
      dataReference,
      provider,
      sizeMB,
      billingPeriod,
      tokenAddress,
      amount,
      [],
      [],
      tokenAddress,
    )

    return this.send(
      newAgreementTx,
      { ...txOptions, value: amount },
    )
  }

  public depositFunds(
    {
      amount, dataReference, provider,
    }: {
        amount: string
        dataReference: string
        provider: string
      },
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const { tokenAddress } = this.getToken(txOptions.token)
    const depositTx = this.contract.methods.depositFunds(
      tokenAddress,
      amount,
      [asciiToHex(dataReference)],
      provider,
    )

    return this.send(
      depositTx,
      { ...txOptions, value: amount },
    )
  }

  public async setOffer(
    capacityMB: string,
    billingPeriods: number[][],
    billingRbtcWeiPrices: string[][],
    tokens: SupportedTokens[],
    peerId: string,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const encodedPeerId = encodeHash(peerId).map((el) => el.replace('0x', ''))
    const prefixedMsg = prefixArray(encodedPeerId, '01', 64).map(
      (el) => `0x${el}`,
    )
    const tokensAddresses = tokens.map((t) => this.getToken(t).tokenAddress)

    const setOfferTx = await this.contract.methods.setOffer(
      capacityMB,
      billingPeriods,
      billingRbtcWeiPrices,
      tokensAddresses,
      prefixedMsg,
    )

    return this.send(
      setOfferTx,
      { ...txOptions, gasMultiplier: 1.1, token: SUPPORTED_TOKENS.RBTC }, // Can be used only with native token
    )
  }

  public terminateOffer(
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    return this.send(
      this.contract.methods.terminateOffer(),
      { ...txOptions, token: SUPPORTED_TOKENS.RBTC }, // Can be used only with native token
    )
  }

  public hasUtilizedCapacity(
    account: string,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    return this._call(
      this.contract.methods.hasUtilizedCapacity(account),
      txOptions,
    )
  }
}

export default StorageContract
