import ContractWithTokens from 'contracts/wrappers/contract-using-tokens'
import { getTokensFromConfigTokens } from 'utils/tokenUtils'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import { AbiItem } from 'web3-utils'
import RNSSimplePlacementsV1 from '../abi/nfts/RNSSimplePlacementsV1.json'
import { marketPlaceAddress, rnsSupportedTokens } from '../config'
import {
  SupportedToken, TOKEN_TYPES, TransactionOptions, TxOptions,
} from '../interfaces'

export type MarketplaceContractErrorId = 'contract-marketplace-place' | 'contract-marketplace-unplace' | 'contract-marketplace-getPlacement'

class MarketplaceContract extends ContractWithTokens {
  public static gasMultiplier = 1.3

  public static getInstance(web3: Web3): MarketplaceContract {
    if (!MarketplaceContract.instance) {
      MarketplaceContract.instance = new MarketplaceContract(
        web3,
        new web3.eth.Contract(
            RNSSimplePlacementsV1.abi as AbiItem[],
            marketPlaceAddress,
        ),
        getTokensFromConfigTokens(rnsSupportedTokens),
        'marketplace-contract',
      )
    }
    return MarketplaceContract.instance
  }

  private static instance: MarketplaceContract

  // Place: Proxy function for placement transaction
  public place(
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

    return this._send(
      placeTx,
      {
        gasMultiplier: MarketplaceContract.gasMultiplier,
        ...txOptions,
      },
    )
  }

  // Unplace: Proxy function for unplacement transaction
  public unplace(
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const unplaceTx = this.methods.unplace(tokenId)
    return this._send(
      unplaceTx,
      {
        gasMultiplier: MarketplaceContract.gasMultiplier,
        ...txOptions,
      },
    )
  }

  public getPlacement(
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<Array<string>> {
    const { from } = txOptions
    return this.methods.placement(tokenId).call({ from })
  }

  public buy(
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    const buyTx = this.methods.buy(tokenId)
    return this._send(
      buyTx,
      {
        gasMultiplier: MarketplaceContract.gasMultiplier,
        ...txOptions,
      },
    )
  }

  public isWhitelistedToken = async (
    {
      type,
      tokenAddress,
    }: SupportedToken,
    txOptions: TxOptions,
  ): Promise<boolean> => {
    if (type === TOKEN_TYPES.NATIVE) {
      return this._call<boolean>(
        this.methods.isGasPaymentAllowed(),
        txOptions,
      )
    }

    const wlByType = await this._call<{0: boolean, 1: boolean, 2: boolean}>(
      this.methods.whitelistedPaymentToken(tokenAddress),
      txOptions,
    )

    const wLTokens = {
      [TOKEN_TYPES.ERC20]: wlByType[0],
      [TOKEN_TYPES.ERC677]: wlByType[1],
      [TOKEN_TYPES.ERC777]: wlByType[2],
    }

    return wLTokens[type]
  }
}

export default MarketplaceContract
