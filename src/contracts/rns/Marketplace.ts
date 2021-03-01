import RNSSimplePlacementsV1 from '../abi/nfts/RNSSimplePlacementsV1.json'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'

import { marketPlaceAddress } from '../config'
import { TransactionOptions } from '../interfaces'
import ContractBase from '../wrappers/contract-base'

export type MarketplaceContractErrorId = 'contract-marketplace-place' | 'contract-marketplace-unplace' | 'contract-marketplace-getPlacement'

class MarketplaceContract extends ContractBase {
  public static gasMultiplier = 1.1

  public static getInstance (web3: Web3): MarketplaceContract {
    if (!MarketplaceContract.instance) {
      MarketplaceContract.instance = new MarketplaceContract(
        web3,
        new web3.eth.Contract(
          RNSSimplePlacementsV1.abi as AbiItem[],
          marketPlaceAddress,
        ),
        'marketplace-contract',
      )
    }
    return MarketplaceContract.instance
  }

  private static instance: MarketplaceContract

  // Place: Proxy function for placement transaction
  public async place (
    tokenId: string,
    tokenAddress: string,
    price: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const placeTx = this.methods.place(
      tokenId,
      tokenAddress,
      this.web3.utils.toWei(price),
    )

    return await this._send(
      placeTx,
      {
        gasMultiplier: MarketplaceContract.gasMultiplier,
        ...txOptions,
      },
    )
  }

  // Unplace: Proxy function for unplacement transaction
  public async unplace (
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const unplaceTx = this.methods.unplace(tokenId)
    return await this._send(
      unplaceTx,
      {
        gasMultiplier: MarketplaceContract.gasMultiplier,
        ...txOptions,
      },
    )
  }

  public async getPlacement (
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<string[]> {
    const { from } = txOptions
    return await this.methods.placement(tokenId).call({ from })
  }

  public async buy (
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const buyTx = this.methods.buy(tokenId)
    return await this._send(buyTx, txOptions)
  }
}

export default MarketplaceContract
