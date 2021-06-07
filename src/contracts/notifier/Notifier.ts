import NotifierManager from '@rsksmart/rif-marketplace-notifier/build/contracts/NotifierManager.json'
import Big from 'big.js'
import { notifierAddress, notifierSupportedTokens } from 'contracts/config'
import { SupportedToken, TxOptions } from 'contracts/interfaces'
import ContractWithTokens from 'contracts/wrappers/contract-using-tokens'
import { BaseToken } from 'models/Token'
import { convertToWeiString } from 'utils/parsers'
import { getTokensFromConfigTokens } from 'utils/tokenUtils'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'

export type NotifierContractErrorId = 'contract-notifier'

class NotifierContract extends ContractWithTokens {
  public static gasMultiplier = 1.1

  public static getInstance(web3: Web3): NotifierContract {
    if (!NotifierContract.instance) {
      NotifierContract.instance = new NotifierContract(
        web3,
        new web3.eth.Contract(
          NotifierManager.abi as AbiItem[],
          notifierAddress,
        ),
        getTokensFromConfigTokens(notifierSupportedTokens),
        'contract-notifier',
      )
    }
    return NotifierContract.instance
  }

  private static instance: NotifierContract

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

  public async registerProvider(
    url: string,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const registerProviderTx = await this.methods.registerProvider(url)

    return this.send(
      registerProviderTx,
      {
        gasMultiplier: NotifierContract.gasMultiplier,
        ...txOptions,
      },
    )
  }

  public async withdrawFunds(
    hash: string,
    { tokenAddress }: BaseToken,
    amount: Big,
    from: string,
    txOptions: TxOptions = {},
  ): Promise<TransactionReceipt> {
    if (!hash) throw Error('Subscription hash not defined.')

    return this.send(
      await this.methods.withdrawFunds(
        hash, tokenAddress, convertToWeiString(amount),
      ),
      {
        gasMultiplier: NotifierContract.gasMultiplier,
        from,
        ...txOptions,
      },
    )
  }

  public isWhitelistedToken = (
    { tokenAddress }: SupportedToken,
    txOptions: TxOptions,
  ): Promise<boolean> => this._call(
    this.methods.isWhitelistedToken(tokenAddress),
    txOptions,
  )

  public createSubscription = (
    data: {
      subscriptionHash: string
      providerAddress: string
      signature: string
      amount: Big
      token: SupportedToken
    },
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> => {
    const {
      providerAddress,
      subscriptionHash,
      signature,
      amount,
      token: { tokenAddress },
    } = data
    const weiAmount = convertToWeiString(amount)
    const createSubsTx = this.contract.methods.createSubscription(
      providerAddress,
      subscriptionHash,
      signature,
      tokenAddress,
      weiAmount,
    )
    return this.send(createSubsTx, {
      gasMultiplier: NotifierContract.gasMultiplier,
      ...txOptions,
      value: weiAmount,
    })
  }
}

export default NotifierContract
