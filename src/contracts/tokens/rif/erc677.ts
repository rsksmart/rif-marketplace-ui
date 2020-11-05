import ERC677 from '@rsksmart/erc677/ERC677Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import { rifTokenAddress } from '../../config'
import withWaitForReceipt, { TransactionOptions } from '../../utils'

export type RifContractErrorId = 'contract-rif-getBalanceOf' | 'contract-rif-transferAndCall'

class RIFContract {
  public static getInstance(web3: Web3): RIFContract {
    if (!RIFContract.instance) {
      RIFContract.instance = new RIFContract(web3)
    }
    return RIFContract.instance
  }

  private static instance: RIFContract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(ERC677.abi as AbiItem[], rifTokenAddress)
    this.web3 = web3
  }

  public getBalanceOf = (account: string, txOptions: TransactionOptions): Promise<number> => {
    const { from } = txOptions
    const balance = this.contract.methods.balanceOf(account).call({ from })
    return balance
  }

  // Tramsfer And Call
  public transferAndCall = async (contractAddress: string, tokenPrice: string, tokenId: string, txOptions: TransactionOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Payment transaction
    const { from, gasPrice } = txOptions
    const estimatedGas = await this.contract.methods.transferAndCall(contractAddress, tokenPrice, tokenId).estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Transfer and Call transaction
    const transferReceipt = await new Promise<TransactionReceipt>(
      () => this.contract.methods.transferAndCall(
        contractAddress, tokenPrice, tokenId,
      ).send(
        { from, gas, gasPrice },
        withWaitForReceipt(this.web3),
      ),
    )
    return transferReceipt
  }
}

export default RIFContract
