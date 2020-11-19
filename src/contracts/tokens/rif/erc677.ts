import ERC677 from '@rsksmart/erc677/ERC677Data.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'

import { rifTokenAddress } from 'contracts/config'
import ContractBase from 'contracts/wrappers/contract-base'
import { TransactionOptions } from 'contracts/interfaces'

export type RifERC677ContractErrorId = 'contract-rif-getBalanceOf' | 'contract-rif-transferAndCall'

export class RifERC677Contract extends ContractBase {
  public static gasMultiplier = 1.1

  public static getInstance(web3: Web3): RifERC677Contract {
    if (!RifERC677Contract.instance) {
      RifERC677Contract.instance = new RifERC677Contract(web3)
    }
    return RifERC677Contract.instance
  }

  private static instance: RifERC677Contract

  private constructor(web3: Web3) {
    super(web3, new web3.eth.Contract(ERC677.abi as AbiItem[], rifTokenAddress))
  }

  public getBalanceOf(
    account: string,
    txOptions: TransactionOptions,
  ): Promise<number> {
    const { from } = txOptions
    return this.contract.methods.balanceOf(account).call({ from })
  }

  // Tramsfer And Call
  public transferAndCall(
    contractAddress: string,
    tokenPrice: string,
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    return this._send(
      this.contract.methods.transferAndCall(
        contractAddress, tokenPrice, tokenId,
      ),
      {
        ...txOptions,
        gasMultiplier: RifERC677Contract.gasMultiplier,
      },
    )
  }
}

export default RifERC677Contract
