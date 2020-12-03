import {
  SupportedTokens, SUPPORTED_TOKENS, Token, TOKENS,
} from 'contracts/interfaces'
import Web3 from 'web3'

export class AccountBalance {
  private readonly web3: Web3

  private static instance: AccountBalance

  constructor(web3: Web3) {
    this.web3 = web3
  }

  public static getInstance(web3: Web3): AccountBalance {
    if (!this.instance) {
      this.instance = new AccountBalance(web3)
    }
    return this.instance
  }

  private _getToken = (tokenName: SupportedTokens): Token => {
    const tokenObject = TOKENS[tokenName]

    if (!tokenObject) {
      throw new Error(`Token ${tokenName} is not supported.`)
    }
    return tokenObject
  }

  public getBalance(
    account: string,
    tokenName: SupportedTokens,
  ): Promise<string> {
    const tokenObject = this._getToken(tokenName)

    if (tokenObject.token === SUPPORTED_TOKENS.rbtc) { // native token
      return this.web3.eth.getBalance(account)
    }

    const { tokenContract } = tokenObject
    return tokenContract.getInstance(this.web3)
      .methods.balanceOf(account).call()
  }
}

export default AccountBalance
