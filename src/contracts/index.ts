import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import Logger from '../utils/Logger'
import RifERC20Contract from './tokens/rif/erc20'
import withWaitForReceipt, { TransactionOptions } from './utils'

const logger = Logger.getInstance()

enum TOKENS {
  RIF = 'rif',
  RBTC = 'rbtc'
}

enum TOKENS_TYPES {
  ERC20 = 'erc20',
  ERC677 = 'erc677'
}

type SupportedTokens = TOKENS.RIF | TOKENS.RBTC
type TokenTypes = TOKENS_TYPES.ERC20 | TOKENS_TYPES.ERC677
type Token = { token: SupportedTokens, type: TokenTypes }

type TxOptions = TransactionOptions & {
  gasMultiplayer?: number
  currency?: SupportedTokens
  onApprove?: (receipt: TransactionReceipt) => void
}

interface TokenContracts {
  [key: string]: ContractBase
}

export default class ContractBase {
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
      gas = (await tx.estimateGas({
        from,
        gasPrice,
        value,
      })) * (gasMultiplayer || 1)
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
  private readonly name?: string

  private readonly supportedTokens: Token[]

  private readonly tokenContracts: TokenContracts

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
    // TODO build this bvased on supportedCurrencies
    this.tokenContracts = {
      [TOKENS.RIF]: RifERC20Contract,
    }
  }

  private _isCurrencySupported(currency: SupportedTokens): boolean {
    return !!this.supportedTokens.find(({ token }) => currency === token)
  }

  private async getToken(tokenName: SupportedTokens): Promise<{ tokenContract: Contract, tokenType: TokenTypes }> {
    const tokenInfo = this.supportedTokens.find(({ token }) => token === tokenName)

    if (!tokenInfo) {
      throw new Error(`Token ${tokenName} is not supported by ${this.name} contract`)
    }
    return { tokenContract: await this.tokenContracts[tokenName].getInstance(), tokenType: tokenInfo.type }
  }

  private async approveToken(currency: SupportedTokens, txOptions: TransactionOptions): Promise<TransactionReceipt> {
    const { value, from, gasPrice } = txOptions
    const { tokenContract, tokenType } = await this.getToken(currency)

    // Approve call
    switch (tokenType) {
      case TOKENS_TYPES.ERC20:
        // eslint-disable-next-line no-case-declarations
        // TODO const erc20Contract = tokenContract as ERC20ContractI
        return tokenContract.approve( // Add base interface for all of the tokens
            value as number,
            { from, gasPrice },
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
      currency,
      onApprove,
    } = await this._processOptions(tx, txOptions)

    const tokenToUse = currency || TOKENS.RBTC

    if (!this._isCurrencySupported(tokenToUse)) {
      throw new Error(`Token ${currency} is not supported by ${this.name} contract`)
    }

    // Need approve tx
    if (tokenToUse !== TOKENS.RBTC) {
      const approveReceipt = await this.approveToken(tokenToUse, { from, gasPrice, value })

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
