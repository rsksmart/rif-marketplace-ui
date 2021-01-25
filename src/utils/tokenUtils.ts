import { addressTokenRecord } from 'contracts/config'
import { SupportedToken, NFT_RECORDS } from 'contracts/interfaces'
import { SupportedTokenSymbol, BaseToken } from 'models/Token'
import { SYSTEM_TOKENS } from '../models/Token'

export const getNFTokenByName = (tokenName: SupportedTokenSymbol): SupportedToken => {
  const tokenObject: SupportedToken = NFT_RECORDS[tokenName]

  if (!tokenObject) {
    throw new Error(`Could not find Contract for given token "${tokenName}".`)
  }
  return tokenObject
}

export const getTokensFromConfigTokens = (
  configTokenNames: SupportedTokenSymbol[],
): SupportedToken[] => configTokenNames.map(getNFTokenByName)

export const getTokenByString = (
  paymentToken: string,
): SupportedToken => getNFTokenByName(paymentToken.toLowerCase() as SupportedTokenSymbol)

export const getTokenByAddress = (tokenAddress: string): BaseToken => {
  const symbol = addressTokenRecord[
    tokenAddress.toLowerCase()
  ] as SupportedTokenSymbol

  if (!symbol) {
    throw new Error(`Token address "${tokenAddress}" is not found in supported tokens in the system.`)
  }
  return getNFTokenByName(symbol)
}

export const getSysTokenByName = (
  tokenName: SupportedTokenSymbol | string,
): BaseToken => {
  const tokenObject: SupportedToken = SYSTEM_TOKENS[tokenName]

  if (!tokenObject) {
    throw new Error(`Token "${tokenName}" not supported by the system.`)
  }
  return tokenObject
}
