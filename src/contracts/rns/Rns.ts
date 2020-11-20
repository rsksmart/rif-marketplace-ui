import ERC721 from '@rsksmart/erc721/ERC721Data.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'

import { rnsAddress } from '../config'
import { TransactionOptions } from '../interfaces'
import ContractBase from '../wrappers/contract-base'

export type RnsContractErrorId = 'contract-rns-approve' | 'contract-rns-unapprove' | 'contract-rns-getApproved' | 'contract-rns-notApproved'

class RNSContract extends ContractBase {
  public static getInstance(web3: Web3): RNSContract {
    if (!RNSContract.instance) {
      RNSContract.instance = new RNSContract(
        web3,
        new web3.eth.Contract(ERC721.abi as AbiItem[], rnsAddress),
        'rns-contract',
      )
    }
    return RNSContract.instance
  }

  private static instance: RNSContract

  // approve: Token transfer approval
  public approve(
    contractAddress: string,
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const approveTx = this.methods.approve(
      contractAddress, tokenId,
    )
    return this._send(approveTx, txOptions)
  }

  // unapprove: Token transfer unapproval
  public unapprove(
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const contractAddress = '0x0000000000000000000000000000000000000000'
    return this.approve(contractAddress, tokenId, txOptions)
  }

  public getApproved = (tokenId: string, txOptions: TransactionOptions): Promise<Array<string>> => {
    const { from } = txOptions
    return this.methods.getApproved(tokenId).call({ from })
  }
}

export default RNSContract
