import ERC721 from '@rsksmart/erc721/ERC721Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import { rnsAddress } from './config'
import waitForReceipt, { TransactionOptions } from './utils'

export type RnsContractErrorId = 'contract-rns-approve' | 'contract-rns-unapprove' | 'contract-rns-getApproved' | 'contract-rns-notApproved'

class RNSContract {
  public static getInstance(web3: Web3): RNSContract {
    if (!RNSContract.instance) {
      RNSContract.instance = new RNSContract(web3)
    }
    return RNSContract.instance
  }

  private static instance: RNSContract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(ERC721.abi as AbiItem[], rnsAddress)
    this.web3 = web3
  }

  // approve: Token transfer approval
  public approve = async (contractAddress: string, tokenId: string, txOptions: TransactionOptions): Promise<TransactionReceipt> => {
    const { from, gasPrice } = txOptions
    const gas = 100000
    const approveReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.approve(contractAddress, tokenId).send({ from, gas, gasPrice },
        async (err, txHash) => {
          if (err) return reject(err)
          try {
            const receipt = await waitForReceipt(txHash, this.web3)
            return resolve(receipt)
          } catch (e) {
            return reject(e)
          }
        })
    })
    return approveReceipt
  }

  // unapprove: Token transfer unapproval
  public unapprove = (tokenId: string, txOptions: TransactionOptions): Promise<TransactionReceipt> => {
    const contractAddress = '0x0000000000000000000000000000000000000000'
    return this.approve(contractAddress, tokenId, txOptions)
  }

  public getApproved = (tokenId: string, txOptions: TransactionOptions): Promise<Array<string>> => {
    const { from } = txOptions
    const approved = this.contract.methods.getApproved(tokenId).call({ from })
    return approved
  }
}

export default RNSContract
