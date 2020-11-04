import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import Logger from '../utils/Logger'
import { rifTokenAddress } from './config'
import waitForReceipt, { TransactionOptions } from './utils'

const logger = Logger.getInstance()

enum TOKENS {
  RIF = 'rif'
}

type SupportedTokens = TOKENS.RIF

type TxOptions = TransactionOptions & {
  gasMultiplayer?: number
  sendUsingToken?: SupportedTokens
  onApprove?: (receipt: TransactionReceipt) => void
}

export default class ContractNative {
  protected readonly contract: Contract

  private readonly web3: Web3

  constructor(web3: Web3, abi: AbiItem[], address: string) {
    this.contract = new web3.eth.Contract(abi, address)
    this.web3 = web3
  }

  async processOptions(
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

  async send(
    tx: any,
    txOptions: TxOptions,
  ): Promise<TransactionReceipt> {
    const {
      from,
      value,
      gas,
      gasPrice,
    } = await this.processOptions(tx, txOptions)

    return tx.send({
      from,
      gas,
      value,
      gasPrice,
    }, (err, response) => {
      if (err) return Promise.reject(err)
      return waitForReceipt(response, this.web3)
    })
  }
}

export class ContractTokensAndNative extends ContractNative {
  private readonly ERC20Token: Contract

  constructor(web3: Web3, abi: AbiItem[], address: string) {
    super(web3, abi, address)
    this.ERC20Token = new web3.eth.Contract(ERC20.abi as AbiItem[], rifTokenAddress)
    // this.SomeOtherTokenContract = new web3.eth.Contract(...)
  }

  approveCall(
    amount: number | string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const { from, gasPrice } = txOptions
    return this.ERC20Token.methods
      .approve(this.contract.options.address, amount)
      .send({ from, gasPrice })
  }

  async send(tx: any, txOptions: TxOptions): Promise<TransactionReceipt> {
    const {
      from,
      gas,
      value,
      gasPrice,
      sendUsingToken,
      onApprove,
    } = await this.processOptions(tx, { ...txOptions })

    // Approve call if use token contract
    switch (sendUsingToken) {
      case TOKENS.RIF:
        // eslint-disable-next-line no-case-declarations
        const approveReceipt = await this.approveCall(
            value as number,
            { from, gasPrice },
        )

        if (onApprove) {
          await onApprove(approveReceipt)
        }
        break
      default:
        break
    }

    return super.send(
      tx,
      {
        from,
        gas,
        value: sendUsingToken ? 0 : value,
        gasPrice,
      },
    )
  }
}
