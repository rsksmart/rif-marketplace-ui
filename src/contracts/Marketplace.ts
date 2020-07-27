import RNSSimplePlacementsV1 from '@rsksmart/rif-marketplace-nfts/RNSSimplePlacementsV1Data.json'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { marketPlaceAddress } from './config'
import waitForReceipt, { TransactionOptions } from './utils'

export type MarketplaceContractErrorId = 'contract-marketplace-place' | 'contract-marketplace-unplace' | 'contract-marketplace-getPlacement'

class MarketplaceContract {
  public static getInstance(web3: Web3): MarketplaceContract {
    if (!MarketplaceContract.instance) {
      MarketplaceContract.instance = new MarketplaceContract(web3)
    }
    return MarketplaceContract.instance
  }

  private static instance: MarketplaceContract

  private contract: Contract

  private web3: Web3

  private constructor(web3: Web3) {
    this.contract = new web3.eth.Contract(RNSSimplePlacementsV1.abi as AbiItem[], marketPlaceAddress)
    this.web3 = web3
  }

  // Place: Proxy function for placement transaction
  public place = async (tokenId: string, rifTokenAddress: string, price: string, txOptions: TransactionOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Placement
    const { from, gasPrice } = txOptions
    const estimatedGas = await this.contract.methods.place(tokenId, rifTokenAddress, this.web3.utils.toWei(price)).estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Placement Transaction
    const placeReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.place(tokenId, rifTokenAddress, this.web3.utils.toWei(price)).send({ from, gas, gasPrice },
        async (err, txHash) => {
          try {
            if (err) throw err
            const receipt = await waitForReceipt(txHash, this.web3)
            return resolve(receipt)
          } catch (e) {
            return reject(e)
          }
        })
    })
    return placeReceipt
  }

  // Unplace: Proxy function for unplacement transaction
  public unplace = async (tokenId: string, txOptions: TransactionOptions): Promise<TransactionReceipt> => {
    // Get gas limit for Unplacement
    const { from, gasPrice } = txOptions
    const estimatedGas = await this.contract.methods.unplace(tokenId).estimateGas({ from, gasPrice })
    const gas = Math.floor(estimatedGas * 1.1)

    // Unplacement Transaction
    const unplaceReceipt = await new Promise<TransactionReceipt>((resolve, reject) => {
      this.contract.methods.unplace(tokenId).send({ from, gas, gasPrice },
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
    return unplaceReceipt
  }

  public getPlacement = (tokenId: string, txOptions: TransactionOptions): Promise<Array<string>> => {
    const { from } = txOptions
    const placement = this.contract.methods.placement(tokenId).call({ from })
    return placement
  }
}

export default MarketplaceContract
