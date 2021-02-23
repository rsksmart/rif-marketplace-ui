import ERC677 from '@rsksmart/erc677/ERC677Data.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'

import { rifTokenAddress } from 'contracts/config'
import ContractBase from 'contracts/wrappers/contract-base'
import { TransactionOptions } from 'contracts/interfaces'
import { PaymentWrapper } from 'contracts/wrappers/payment-wrapper'

export type RifERC677ContractErrorId = 'contract-rif-getBalanceOf' | 'contract-rif-transferAndCall'

export class RifERC677Contract extends ContractBase implements PaymentWrapper {
  public static gasMultiplier = 1.1

  public static getInstance (web3: Web3): RifERC677Contract {
    if (!RifERC677Contract.instance) {
      RifERC677Contract.instance = new RifERC677Contract(web3)
    }
    return RifERC677Contract.instance
  }

  private static instance: RifERC677Contract

  private constructor (web3: Web3) {
    super(web3, new web3.eth.Contract(ERC677.abi as AbiItem[], rifTokenAddress), 'rif-erc677-contract')
  }

  public async getBalanceOf (
    account: string,
    txOptions: TransactionOptions,
  ): Promise<string | number> {
    const { from } = txOptions
    return await this.contract.methods.balanceOf(account).call({ from })
  }

  // Tramsfer And Call
  public async transferAndCall (
    contractAddress: string,
    tokenPrice: string,
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    return await this._send(
      this.contract.methods.transferAndCall(
        contractAddress, tokenPrice, tokenId,
      ),
      {
        gasMultiplier: RifERC677Contract.gasMultiplier,
        ...txOptions,
      },
    )
  }
}

export default RifERC677Contract
