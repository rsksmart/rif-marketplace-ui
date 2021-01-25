import { SupportedTokenSymbol, SYSTEM_SUPPORTED_SYMBOL } from 'models/Token'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'

import {
  ERC20Contract,
  SupportedToken,
  TOKEN_TYPES,
  TransactionOptions,
  TxOptions,
} from '../interfaces'
import ContractBase from './contract-base'

export class ContractWithTokens extends ContractBase {
  private readonly supportedTokens: SupportedToken[]

  private _defaultToken: SupportedTokenSymbol

  constructor(
    web3: Web3,
    contract: Contract,
    supportedTokens: SupportedToken[],
    name?: string,
  ) {
    super(web3, contract, name)
    this.supportedTokens = supportedTokens
    // Set default token
    this._defaultToken = this._isCurrencySupported(SYSTEM_SUPPORTED_SYMBOL.rbtc)
      ? SYSTEM_SUPPORTED_SYMBOL.rbtc
      : this.supportedTokens[0].symbol
  }

  get defaultToken(): SupportedTokenSymbol {
    return this._defaultToken
  }

  set defaultToken(token: SupportedTokenSymbol) {
    this._defaultToken = token
  }

  private _isCurrencySupported(currency: SupportedTokenSymbol): boolean {
    return this.supportedTokens.some(({ symbol }) => currency === symbol)
  }

  private _approveTokenTransfer(
    token: SupportedToken,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const { value, from, gasPrice } = txOptions
    const { tokenContract, type: tokenType } = token

    switch (tokenType) {
      case TOKEN_TYPES.ERC20:
        return (tokenContract.getInstance(this.web3) as ERC20Contract).approve(
          this.contract.options.address, value as number, { from, gasPrice },
        )
      default:
        throw new Error(`Unknown token contract interface ${tokenType}`)
    }
  }

  public getToken(tokenName?: SupportedTokenSymbol): SupportedToken {
    const tokenObject = this.supportedTokens.find(
      ({ symbol }) => symbol === (tokenName || this.defaultToken),
    )

    if (!tokenObject) {
      throw new Error(`Token ${tokenName} is not supported by ${this.name} contract`)
    }
    return tokenObject
  }

  async send(tx: any, txOptions: TxOptions): Promise<TransactionReceipt> {
    const { from, value } = txOptions
    const tokenToUse = this.getToken(txOptions.token)

    if (!this._isCurrencySupported(tokenToUse.symbol)) {
      throw new Error(`Token ${tokenToUse} is not supported by ${this.name} contract`)
    }

    const isNativeToken = tokenToUse.type === TOKEN_TYPES.NATIVE

    // Need token transaction
    if (!isNativeToken && txOptions.value) {
      const approveReceipt = await this._approveTokenTransfer(
        tokenToUse, { from, value },
      )

      if (txOptions.onApprove) {
        await txOptions.onApprove(approveReceipt)
      }
    }

    const {
      gas,
      gasPrice,
    } = await this._processOptions(tx, txOptions)

    return this._send(
      tx,
      {
        from,
        gas,
        value: isNativeToken ? value : 0, // If use native token(RBTC) send as usual
        gasPrice,
      },
    )
  }
}

export default ContractWithTokens
