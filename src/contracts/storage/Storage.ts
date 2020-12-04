import StorageManager from '@rsksmart/rif-marketplace-storage/build/contracts/StorageManager.json'
import { convertToWeiString } from 'utils/parsers'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'

import { storageAddress, storageSupportedTokens } from 'contracts/config'
import { SUPPORTED_TOKENS, SupportedTokens, TxOptions } from 'contracts/interfaces'
import { getTokens } from 'utils/tokenUtils'
import ContractWithTokens from 'contracts/wrappers/contract-using-tokens'
import { encodeHash, prefixArray } from './utils'

export type StorageContractErrorId = 'contract-storage'

class StorageContract extends ContractWithTokens {
  public static gasMultiplier = 1.1

  public static getInstance(web3: Web3): StorageContract {
    if (!StorageContract.instance) {
      StorageContract.instance = new StorageContract(
        web3,
        new web3.eth.Contract(
              StorageManager.abi as AbiItem[],
              storageAddress,
        ),
        getTokens(storageSupportedTokens),
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

    const newAgreementTx = this.methods.newAgreement(
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
      {
        ...txOptions,
        value: amount,
      },
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
    const encodedDataReference = encodeHash(dataReference)

    const depositTx = this.methods.depositFunds(
      tokenAddress,
      amount,
      encodedDataReference,
      provider,
    )

    return this.send(
      depositTx,
      {
        ...txOptions,
        value: amount,
      },
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

    const setOfferTx = await this.methods.setOffer(
      capacityMB,
      billingPeriods,
      billingRbtcWeiPrices,
      tokensAddresses,
      prefixedMsg,
    )

    return this.send(
      setOfferTx,
      {
        gasMultiplier: StorageContract.gasMultiplier,
        ...txOptions,
        token: SUPPORTED_TOKENS.rbtc, // Can be used only with native token
      },
    )
  }

  public withdrawFunds(
    {
      dataReference,
      provider,
      tokens,
      amounts,
    }: {
        dataReference: string
        provider: string
        tokens: SupportedTokens[]
        amounts: string[]
      },
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const encodedDataReference = encodeHash(dataReference)
    const tokensAddresses = tokens.map((t: SupportedTokens) => this.getToken(t).tokenAddress)
    const weiAmounts = amounts.map(convertToWeiString)
    const withdrawFundsTx = this.methods
      .withdrawFunds(encodedDataReference, provider, tokensAddresses, weiAmounts)

    return this.send(
      withdrawFundsTx,
      {
        gasMultiplier: StorageContract.gasMultiplier,
        ...txOptions,
        token: SUPPORTED_TOKENS.rbtc, // Native token only
      },
    )
  }

  public payoutFunds(
    {
      creatorOfAgreement,
      dataReferences = [],
      token,
    }: {
        creatorOfAgreement: string
        dataReferences: string[]
        token: SupportedTokens
      },
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const { from } = txOptions
    const encodedDataReferences = dataReferences.map(encodeHash)
    const { tokenAddress } = this.getToken(token)

    const payoutFundsTx = this.contract.methods
      .payoutFunds(
        encodedDataReferences,
        [creatorOfAgreement],
        tokenAddress,
        from,
      )

    return this.send(
      payoutFundsTx,
      {
        gasMultiplier: StorageContract.gasMultiplier,
        ...txOptions,
        token: SUPPORTED_TOKENS.rbtc, // Native token only
      },
    )
  }

  /**
   * Static calls
   */

  public terminateOffer(
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    return this.send(
      this.methods.terminateOffer(),
      {
        ...txOptions,
        token: SUPPORTED_TOKENS.rbtc, // Can be used only with native token
      },
    )
  }

  public hasUtilizedCapacity(
    account: string,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    return this._call(
      this.methods.hasUtilizedCapacity(account),
      txOptions,
    )
  }

  public isWhitelistedProvider(
    account: string,
    txOptions: TxOptions = {},
  ): Promise<TransactionReceipt> {
    return this._call(
      this.methods.isWhitelistedProvider(account),
      {
        ...txOptions,
        from: account,
      },
    )
  }
}

export default StorageContract
