import { PaymentWrapper } from 'contracts/wrappers/payment-wrapper'
import Web3 from 'web3'

export type RBTCWrapperErrorId = 'rbtc-getBalanceOf'

export class RBTCWrapper implements PaymentWrapper {
  private _web3!: Web3

  public static gasMultiplier = 1.1

  public static getInstance(web3: Web3): RBTCWrapper {
    if (!RBTCWrapper.instance) {
      RBTCWrapper.instance = new RBTCWrapper(web3)
    }
    return RBTCWrapper.instance
  }

  private static instance: RBTCWrapper

  private constructor(web3: Web3) {
    this._web3 = web3
  }

  public getBalanceOf = (
    account: string,
  ): Promise<string | number> => this._web3.eth.getBalance(account)
}

export default RBTCWrapper
