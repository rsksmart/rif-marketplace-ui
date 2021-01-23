import { ZERO_ADDRESS } from 'constants/strings'
import { rifTokenAddress } from 'contracts/config'

export enum SYSTEM_SUPPORTED_TOKENS { // juraj - Rename to SYSTEM_SUPPORTED_SYMBOLS
  rif = 'rif',
  rbtc = 'rbtc'
}
export type SupportedTokens =
    | SYSTEM_SUPPORTED_TOKENS.rif
    | SYSTEM_SUPPORTED_TOKENS.rbtc

export type Token = {
  symbol: SupportedTokens
  displayName: string
  tokenAddress: string
}

export type TokenRecord<T extends Token> = Record<SupportedTokens, T>

export const SYSTEM_TOKENS: TokenRecord<Token> = {
  [SYSTEM_SUPPORTED_TOKENS.rbtc]: {
    symbol: SYSTEM_SUPPORTED_TOKENS.rbtc,
    displayName: 'R-BTC',
    tokenAddress: ZERO_ADDRESS,
  },
  [SYSTEM_SUPPORTED_TOKENS.rif]: {
    symbol: SYSTEM_SUPPORTED_TOKENS.rif,
    displayName: 'RIF',
    tokenAddress: rifTokenAddress,
  },
}
