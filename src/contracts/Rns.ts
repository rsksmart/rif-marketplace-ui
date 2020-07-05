import ERC721 from '@rsksmart/erc721/ERC721Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import contractAdds from 'ui-config.json'
import waitForReceipt from './utils'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const rnsAddress = contractAdds[network].rnsDotRskOwner.toLowerCase()

class RNSContract {
  public static getInstance(web3: Web3): RNSContract {
    if (!RNSContract.instance) {
      RNSContract.instance = new RNSContract(web3)
    }
    return RNSContract.instance
  }

  private static instance: RNSContract

  private contract: Contract

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(ERC721.abi as AbiItem[], rnsAddress)
  }

  // approve: Token transfer approval
  public approve = async (contractAddress, tokenId, web3: Web3, txOptions): Promise<TransactionReceipt> => {
    const approveReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.approve(contractAddress, tokenId).send({ from: txOptions.from, gas: 100000, gasPrice: txOptions.gasPrice },
        async (err, txHash) => {
          if (err) return reject(err)
          try {
            const receipt = await waitForReceipt(txHash, web3)
            return resolve(receipt)
          } catch (e) {
            return reject(new Error(e))
          }
        })
    })
    return approveReceipt
  }
}

export default RNSContract
