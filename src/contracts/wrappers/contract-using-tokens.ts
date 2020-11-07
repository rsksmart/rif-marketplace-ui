import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'

import {
  SUPPORTED_TOKENS,
  SupportedTokens,
  Token,
  TOKEN_TYPES,
  TransactionOptions,
  TxOptions,
} from '../interfaces'
import ContractBase from './contract-base'

export class ContractWithTokens extends ContractBase {
  public readonly name?: string

  private readonly supportedTokens: Token[]

  private _defaultToken: SupportedTokens

  constructor(
    web3: Web3,
    contract: Contract,
    supportedTokens: Token[],
    name?: string,
  ) {
    super(web3, contract)
    this.supportedTokens = supportedTokens
    this.name = name
    // Set default token
    this._defaultToken = this._isCurrencySupported(SUPPORTED_TOKENS.RBTC)
      ? SUPPORTED_TOKENS.RBTC
      : this.supportedTokens[0].token
  }

  get defaultToken(): SupportedTokens {
    return this._defaultToken
  }

  set defaultToken(token: SupportedTokens) {
    this._defaultToken = token
  }

  private _isCurrencySupported(currency: SupportedTokens): boolean {
    return !!this.supportedTokens.find(({ token }) => currency === token)
  }

  private _getToken(tokenName: SupportedTokens): Token {
    const tokenObject = this.supportedTokens.find(
      ({ token }) => token === tokenName,
    )

    if (!tokenObject) {
      throw new Error(`Token ${tokenName} is not supported by ${this.name} contract`)
    }
    return tokenObject
  }

  private _approveTokenTransfer(
    token: Token,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const { value, from, gasPrice } = txOptions
    const { tokenContract, type: tokenType } = token

    switch (tokenType) {
      case TOKEN_TYPES.ERC20:
        return tokenContract.approve(
          this.contract.options.address, value as number, { from, gasPrice },
        )
      default:
        throw new Error(`Unknown token contract interface ${tokenType}`)
    }
  }

  async send(tx: any, txOptions: TxOptions): Promise<TransactionReceipt> {
    const {
      from,
      gas,
      value,
      gasPrice,
      token,
      onApprove,
    } = await this._processOptions(tx, txOptions)

    const tokenToUse = this._getToken(token || this.defaultToken)

    if (!this._isCurrencySupported(tokenToUse.token)) {
      throw new Error(`Token ${tokenToUse} is not supported by ${this.name} contract`)
    }

    // Need token transaction
    if (tokenToUse.type !== TOKEN_TYPES.NATIVE) {
      const approveReceipt = await this._approveTokenTransfer(
        tokenToUse, { from, gasPrice, value },
      )

      if (onApprove) {
        await onApprove(approveReceipt)
      }
    }

    return this._send(
      tx,
      {
        from,
        gas,
        value: tokenToUse.type === TOKEN_TYPES.NATIVE ? value : 0, // If use native token(RBTC) send as usual
        gasPrice,
      },
    )
  }
}

export default ContractWithTokens
