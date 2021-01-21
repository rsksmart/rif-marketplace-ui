import ERC721 from '@rsksmart/erc721/ERC721Data.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { TransactionReceipt } from 'web3-eth'

import { Marketplace as MarketplaceContract } from 'contracts/rns'
import { Contract } from 'web3-eth-contract'
import { SupportedTokens } from 'models/Token'
import { RifERC677Contract } from 'contracts/tokens/rif'
import { UIError } from 'models/UIMessage'
import { parseToBigDecimal } from 'utils/parsers'
import { PaymentWrapper } from 'contracts/wrappers/payment-wrapper'
import { rnsAddress } from '../config'
import { TransactionOptions } from '../interfaces'
import ContractBase from '../wrappers/contract-base'
import RBTCWrapper from '../tokens/rbtc/rbtcWrapper'

export type RnsContractErrorId = 'contract-rns-approve' | 'contract-rns-unapprove' | 'contract-rns-getApproved' | 'contract-rns-notApproved' | 'contract-rns-place' | 'contract-rns-buy'

const throwUnsupportedError = (paymentTokenSymbol: string): false => {
  throw new UIError({
    error: new Error('Payment Contract Error'),
    id: 'contract-rns-place',
    text: `Token ${paymentTokenSymbol} is not supported. Check SupportedTokens.`,
  })
}

class RNSContract extends ContractBase {
  private _paymentTokenSymbol!: SupportedTokens

  private _marketPlaceContract!: MarketplaceContract

  constructor(web3: Web3, contact: Contract, paymentTokenSymbol: SupportedTokens, name?: string) {
    super(web3, contact, name)
    this._paymentTokenSymbol = paymentTokenSymbol
    this._marketPlaceContract = MarketplaceContract.getInstance(web3)
  }

  public static getInstance(web3: Web3, paymentTokenSymbol: SupportedTokens): RNSContract {
    if (!RNSContract.instance) {
      RNSContract.instance = new RNSContract(
        web3,
        new web3.eth.Contract(ERC721.abi as AbiItem[], rnsAddress),
        paymentTokenSymbol,
        'rns-contract',
      )
    }

    return RNSContract.instance
  }

  private static instance: RNSContract

  public async getPriceString(tokenId, account): Promise<string> {
    const tokenPlacement = await this._marketPlaceContract.getPlacement(tokenId, { from: account })

    return Promise.resolve(tokenPlacement[1])
  }

  public async checkFunds(tokenId, account, domainName): Promise<boolean> {
    const { utils: { toBN } } = this.web3
    let paymentWrapper: PaymentWrapper
    switch (this._paymentTokenSymbol) {
      case 'rif': {
        paymentWrapper = RifERC677Contract.getInstance(this.web3)
        break
      }
      case 'rbtc': {
        paymentWrapper = RBTCWrapper.getInstance(this.web3)
        break
      }
      default:
        return throwUnsupportedError(this._paymentTokenSymbol)
    }

    const myBalance = await paymentWrapper.getBalanceOf(account, { from: account })
      .catch((error) => {
        throw new UIError({
          error,
          id: 'contract-rif-getBalanceOf',
          text: 'Could not get funds balance from contract.',
        })
      })

    const price = await this.getPriceString(tokenId, account)
      .catch((error) => {
        throw new UIError({
          error,
          id: 'contract-marketplace-getPlacement',
          text: `Could not retrieve placement for ${domainName} from contract.`,
        })
      })

    return toBN(myBalance).gte(toBN(price))
  }

  public async buy(
    contractAddress: string,
    tokenPrice: string,
    domainName: string,
    tokenId: string,
    txOptions: TransactionOptions,
  ): Promise<TransactionReceipt> {
    switch (this._paymentTokenSymbol) {
      case 'rif': {
        const tokenApproval = await this.getApproved(tokenId, txOptions)
          .catch((error) => {
            throw new UIError({
              error,
              id: 'contract-rns-getApproved',
              text: `Could not retrieve approval for ${domainName} from contract.`,
            })
          })

        // Check if domain is approved
        const isApproved = tokenApproval.toString().toLowerCase() === contractAddress

        if (!isApproved) {
          throw new UIError({
            error: new Error('Domain not approved to transfer.'),
            id: 'contract-rns-notApproved',
            text: `Domain ${domainName} not approved to transfer.`,
          })
        }

        // Get gas price
        const gasPrice = await this.web3.eth.getGasPrice()

        // Send Transfer and call transaction

        return RifERC677Contract.getInstance(this.web3).transferAndCall(
          contractAddress,
          tokenPrice,
          tokenId,
          { gasPrice, ...txOptions },
        )
          // marketPlaceAddress, tokenPrice, tokenId, { from: account, gasPrice })
          .catch((error) => {
            const adjustedPrice = parseToBigDecimal(tokenPrice, 18).toString()
            throw new UIError({
              error,
              id: 'contract-rif-transferAndCall',
              text: `Transfer of ${adjustedPrice} ${this._paymentTokenSymbol} failed. Check your funds and try again.`,
            })
          })
      }
      case 'rbtc':
        return this._marketPlaceContract.buy(tokenId, { ...txOptions, value: tokenPrice })
      default:
        throwUnsupportedError(this._paymentTokenSymbol)
        return {} as TransactionReceipt
    }
  }

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
