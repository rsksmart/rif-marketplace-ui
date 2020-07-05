import ERC677 from '@rsksmart/erc677/ERC677Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import contractAdds from 'ui-config.json'
import waitForReceipt from './utils'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const rifTokenAddress = contractAdds[network].rif.toLowerCase()

class RIFContract {
  public static getInstance(web3: Web3): RIFContract {
    if (!RIFContract.instance) {
      RIFContract.instance = new RIFContract(web3)
    }
    return RIFContract.instance
  }

  private static instance: RIFContract

  private contract: Contract

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(ERC677.abi as AbiItem[], rifTokenAddress)
  }

  public getBalanceOf = async (account, txOptions): Promise<number> => {
    const balance = await this.contract.methods.balanceOf(account).call({ from: txOptions.from })
    return balance
  }

  // Tramsfer And Call
  public transferAndCall = async (contractAddress, tokenPrice, tokenId, web3: Web3, txOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Payment transaction
    const estimatedGas = await this.contract.methods.transferAndCall(contractAddress, tokenPrice, tokenId).estimateGas({ from: txOptions.from, gasPrice: txOptions.gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Transfer and Call transaction
    const transferReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.transferAndCall(contractAddress, tokenPrice, tokenId).send({ from: txOptions.from, gas, gasPrice: txOptions.gasPrice },
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
    return transferReceipt
  }
}

export default RIFContract
