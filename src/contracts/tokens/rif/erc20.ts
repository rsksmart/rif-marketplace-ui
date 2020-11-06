import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'

import ERC20 from '../../abi/ERC20.json'
import { rifTokenAddress } from '../../config'
import ContractBase from '../../wrappers/contract-base'
import { ERC20ContractI, TransactionOptions } from '../../interfaces'

export type RifERC20ContractErrorId = 'contract-rif-getBalanceOf' | 'contract-rif-transferAndCall'

export class RifERC20Contract extends ContractBase implements ERC20ContractI {
  public static getInstance(web3: Web3): RifERC20Contract {
    if (!RifERC20Contract.instance) {
      RifERC20Contract.instance = new RifERC20Contract(web3)
    }
    return RifERC20Contract.instance
  }

  private static instance: RifERC20Contract

  private constructor(web3: Web3) {
    const { abi: ERC20Abi } = ERC20 as { abi: AbiItem[] }
    super(web3, ERC20Abi, rifTokenAddress)
  }

  public getBalanceOf(
    account: string,
    txOptions: TransactionOptions,
  ): Promise<number> {
    const { from } = txOptions
    return this.contract.methods.balanceOf(account).call({ from })
  }

  public approve(
    contractAddress: string,
    amount: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    return this._send(
      this.contract.methods.approve(contractAddress, amount),
      { ...txOptions, gasMultiplier: 1.1 },
    )
  }
}

export default RifERC20Contract
