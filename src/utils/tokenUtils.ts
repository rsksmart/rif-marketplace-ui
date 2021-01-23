import { addressTokenRecord } from 'contracts/config'
import { NFT, NFT_RECORDS } from 'contracts/interfaces'
import { SupportedTokens, Token } from 'models/Token'
import { SYSTEM_TOKENS } from '../models/Token'

export const getNFTokenByName = (tokenName: SupportedTokens): NFT => {
  const tokenObject: NFT = NFT_RECORDS[tokenName]

  if (!tokenObject) {
    throw new Error(`Could not find Contract for given token "${tokenName}".`)
  }
  return tokenObject
}

export const getTokensFromConfigTokens = (
  configTokenNames: SupportedTokens[],
): NFT[] => configTokenNames.map(getNFTokenByName)

export const getTokenByString = (
  paymentToken: string,
): NFT => getNFTokenByName(paymentToken.toLowerCase() as SupportedTokens)

export const getTokenByAddress = (tokenAddress: string): Token => {
  const symbol = addressTokenRecord[
    tokenAddress.toLowerCase()
  ] as SupportedTokens

  if (!symbol) {
    throw new Error(`Token address "${tokenAddress}" is not found in supported tokens in the system.`)
  }
  return getNFTokenByName(symbol)
}

export const getSysTokenByName = (
  tokenName: SupportedTokens | string,
): Token => {
  const tokenObject: NFT = SYSTEM_TOKENS[tokenName]

  if (!tokenObject) {
    throw new Error(`Token "${tokenName}" not supported by the system.`)
  }
  return tokenObject
}
