import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import Logger from '../utils/Logger'
import {
  SupportedTokens, Token, TOKENS, TOKENS_TYPES, TransactionOptions, TxOptions,
} from './interfaces'
import withWaitForReceipt from './utils'

const logger = Logger.getInstance()

export class ContractBase {
  protected readonly contract: Contract

  private readonly web3: Web3

  constructor(web3: Web3, abi: AbiItem[], address: string) {
    this.contract = new web3.eth.Contract(abi, address)
    this.web3 = web3
  }

  protected async _processOptions(
    tx: any,
    txOptions: TxOptions,
  ): Promise<TxOptions> {
    const { value, from, gasMultiplayer } = txOptions
    let { gasPrice, gas } = txOptions

    if (!gasPrice) {
      gasPrice = await this.web3.eth.getGasPrice()
        .catch((error: Error) => {
          logger.error('error getting gas price, error:', error)
          throw error
        })
    }

    if (!gas) {
      gas = Math.ceil((await tx.estimateGas({
        from,
        gasPrice,
        value,
      })) * (gasMultiplayer ?? 1))
    }

    return {
      ...txOptions,
      gasPrice,
      gas,
    }
  }

  protected async _send(
    tx: any,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const {
      from,
      value,
      gas,
      gasPrice,
    } = await this._processOptions(tx, txOptions)

    return tx.send(
      {
        from,
        gas,
        value,
        gasPrice,
      },
      withWaitForReceipt(this.web3),
    )
  }
}

export class ContractWithTokens extends ContractBase {
  public readonly name?: string

  private readonly supportedTokens: Token[]

  private _defaultToken: SupportedTokens

  constructor(
    web3: Web3,
    abi: AbiItem[],
    address: string,
    supportedTokens: Token[],
    name?: string,
  ) {
    super(web3, abi, address)
    this.supportedTokens = supportedTokens
    this.name = name
    // Set default token
    this._defaultToken = this._isCurrencySupported(TOKENS.RBTC)
      ? TOKENS.RBTC
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
    currency: SupportedTokens,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const { value, from, gasPrice } = txOptions
    const { tokenContract, type: tokenType } = this._getToken(currency)

    switch (tokenType) {
      case TOKENS_TYPES.ERC20:
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

    const tokenToUse = token || this.defaultToken

    if (!this._isCurrencySupported(tokenToUse)) {
      throw new Error(`Token ${tokenToUse} is not supported by ${this.name} contract`)
    }

    // Need approve tx
    if (tokenToUse !== TOKENS.RBTC) {
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
        value: tokenToUse === TOKENS.RBTC ? value : 0, // If use native token(RBTC) send as usual
        gasPrice,
      },
    )
  }
}
