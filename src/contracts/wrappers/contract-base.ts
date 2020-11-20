import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'

import Logger from 'utils/Logger'
import { TxOptions } from 'contracts/interfaces'
import withWaitForReceipt from 'contracts/utils'

const logger = Logger.getInstance()

export class ContractBase {
  protected readonly name?: string

  protected readonly contract: Contract

  protected readonly web3: Web3

  constructor(web3: Web3, contact: Contract, name?: string) {
    this.name = name
    this.contract = contact
    this.web3 = web3
  }

  public get methods(): Record<string, Function> {
    return this.contract.methods
  }

  protected async _processOptions(
    tx: any,
    txOptions: TxOptions,
  ): Promise<TxOptions> {
    const { value, from, gasMultiplier } = txOptions
    let { gasPrice, gas } = txOptions

    if (!gasPrice) {
      gasPrice = await this.web3.eth.getGasPrice()
        .catch((error: Error) => {
          logger.error(`(${this.name}): error getting gas price, error:`, error)
          throw error
        })
    }

    if (!gas) {
      gas = Math.ceil((await tx.estimateGas({
        from,
        gasPrice,
        value,
      })) * (gasMultiplier ?? 1))
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

  protected async _call(
    tx: any,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const {
      from,
      value,
      gas,
      gasPrice,
    } = await this._processOptions(tx, txOptions)

    return tx.call({
      from, gas, gasPrice, value,
    })
  }
}

export default ContractBase
