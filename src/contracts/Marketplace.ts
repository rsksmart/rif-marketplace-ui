import ERC721SimplePlacementsV1 from '@rsksmart/rif-marketplace-nfts/ERC721SimplePlacementsV1Data.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'
import contractAdds from 'ui-config.json'
import waitForReceipt from './utils'

const network: string = process.env.REACT_APP_NETWORK || 'ganache'
const marketPlaceAddress = contractAdds[network].marketplace.toLowerCase()

class MarketplaceContract {
  public static getInstance(web3: Web3): MarketplaceContract {
    if (!MarketplaceContract.instance) {
      MarketplaceContract.instance = new MarketplaceContract(web3)
    }
    return MarketplaceContract.instance
  }

  private static instance: MarketplaceContract

  private contract: Contract

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(ERC721SimplePlacementsV1.abi as AbiItem[], marketPlaceAddress)
  }

  // Place: Proxy function for placement transaction
  public place = async (tokenId, rifTokenAddress, price, web3: Web3, txOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Placement
    const estimatedGas = await this.contract.methods.place(tokenId, rifTokenAddress, web3.utils.toWei(price)).estimateGas({ from: txOptions.from, gasPrice: txOptions.gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Placement Transaction
    const placeReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.place(tokenId, rifTokenAddress, web3.utils.toWei(price)).send({ from: txOptions.from, gas, gasPrice: txOptions.gasPrice },
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
    return placeReceipt
  }

  // Unplace: Proxy function for unplacement transaction
  public unplace = async (tokenId, web3: Web3, txOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Unplacement
    const estimatedGas = await this.contract.methods.unplace(tokenId).estimateGas({ from: txOptions.from, gasPrice: txOptions.gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Unplacement Transaction
    const unplaceReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.unplace(tokenId).send({ from: txOptions.from, gas, gasPrice: txOptions.gasPrice },
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
    return unplaceReceipt
  }

  public getPlacement = async (tokenId, txOptions): Promise<Array<string | number>> => {
    const placement = await this.contract.methods.placement(tokenId).call({ from: txOptions.from })
    return placement
  }
}

export default MarketplaceContract
