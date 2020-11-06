import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import Logger from '../../utils/Logger'

import { TxOptions } from '../interfaces'
import withWaitForReceipt from '../utils'

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

export default ContractBase
