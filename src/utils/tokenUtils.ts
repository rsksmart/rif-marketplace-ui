import { SupportedTokens, Token, TOKENS } from 'contracts/interfaces'

export const getToken = (tokenName: SupportedTokens): Token => {
  const tokenObject = TOKENS[tokenName]

  if (!tokenObject) {
    throw new Error(`Token ${tokenName} is not supported.`)
  }
  return tokenObject
}

export const getTokens = (
  supportedTokens: SupportedTokens[],
): Token[] => supportedTokens.map(getToken)

export default getToken
