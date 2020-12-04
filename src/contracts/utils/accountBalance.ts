import {
  SupportedTokens, SUPPORTED_TOKENS,
} from 'contracts/interfaces'
import getToken from 'utils/tokenUtils'
import Web3 from 'web3'

const getBalance = (
  web3: Web3,
  account: string,
  tokenName: SupportedTokens,
): Promise<string> => {
  const tokenObject = getToken(tokenName)

  if (tokenObject.token === SUPPORTED_TOKENS.rbtc) { // native token
    return web3.eth.getBalance(account)
  }

  const { tokenContract } = tokenObject
  return tokenContract.getInstance(web3)
    .methods.balanceOf(account).call()
}

export default getBalance
