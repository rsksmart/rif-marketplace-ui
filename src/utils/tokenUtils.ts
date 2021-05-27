import Big from 'big.js'
import { addressTokenRecord } from 'contracts/config'
import { SupportedToken, SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { TokenXR } from 'models/Market'
import { SupportedTokenSymbol, BaseToken } from 'models/Token'
import { SYSTEM_TOKENS } from '../models/Token'

export const getSupportedTokenByName = (tokenName: SupportedTokenSymbol): SupportedToken => {
  const tokenObject: SupportedToken = SUPPORTED_TOKEN_RECORDS[tokenName]

  if (!tokenObject) {
    throw new Error(`Could not find Contract for given token "${tokenName}".`)
  }
  return tokenObject
}

export const getTokensFromConfigTokens = (
  configTokenNames: SupportedTokenSymbol[],
): SupportedToken[] => configTokenNames.map(getSupportedTokenByName)

export const getTokenByString = (
  paymentToken: string,
): SupportedToken => getSupportedTokenByName(paymentToken.toLowerCase() as SupportedTokenSymbol)

export const getTokenByAddress = (tokenAddress: string): BaseToken => {
  const symbol = addressTokenRecord[
    tokenAddress.toLowerCase()
  ] as SupportedTokenSymbol

  if (!symbol) {
    throw new Error(`Token address "${tokenAddress}" is not found in supported tokens in the system.`)
  }
  return getSupportedTokenByName(symbol)
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

export const getFiatPrice = (price: Big, token?: TokenXR) => price.mul(token?.rate || 0).toFixed(2)
