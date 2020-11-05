import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'

import { rifTokenAddress } from '../../config'
import withWaitForReceipt, { TransactionOptions } from '../../utils'

export type RifContractErrorId = 'contract-rif-getBalanceOf' | 'contract-rif-transferAndCall'

class RifERC20Contract {
  public static getInstance(web3: Web3): RifERC20Contract {
    if (!RifERC20Contract.instance) {
      RifERC20Contract.instance = new RifERC20Contract(web3)
    }
    return RifERC20Contract.instance
  }

  private static instance: RifERC20Contract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(ERC20.abi as AbiItem[], rifTokenAddress)
    this.web3 = web3
  }

  public getBalanceOf = (account: string, txOptions: TransactionOptions): Promise<number> => {
    const { from } = txOptions
    const balance = this.contract.methods.balanceOf(account).call({ from })
    return balance
  }

  public approve = async (contractAddress: string, amount: string, txOptions: TransactionOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Payment transaction
    const { from, gasPrice } = txOptions
    const estimatedGas = await this.contract.methods.approve(contractAddress, amount).estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Transfer and Call transaction
    return new Promise<TransactionReceipt>(
      () => this.contract.methods.approve(
        contractAddress, amount,
      ).send(
        { from, gas, gasPrice },
        withWaitForReceipt(this.web3),
      ),
    )
  }
}

export default RifERC20Contract
