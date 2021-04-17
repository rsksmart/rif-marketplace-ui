import NotificationsManager from '@rsksmart/rif-marketplace-notifications/build/contracts/NotificationsManager.json'
import { notifierAddress, notifierSupportedTokens } from 'contracts/config'
import { SupportedToken, TxOptions } from 'contracts/interfaces'
import ContractWithTokens from 'contracts/wrappers/contract-using-tokens'
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
          NotificationsManager.abi as AbiItem[],
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

  public isWhitelistedToken = (
    { tokenAddress }: SupportedToken,
    txOptions: TxOptions,
  ): Promise<boolean> => this._call(
    this.methods.isWhitelistedToken(tokenAddress),
    txOptions,
  )
}

export default NotifierContract
