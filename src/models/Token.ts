import { ZERO_ADDRESS } from 'constants/strings'
import { rifTokenAddress } from 'contracts/config'
import { BaseCurrency } from './Currency'

// - juarj
// create issue:
//   get SYSTEM_SUPPORTED_SYMBOL from: [config?, ?]
export enum SYSTEM_SUPPORTED_SYMBOL {
  rif = 'rif',
  rbtc = 'rbtc'
}
export type SupportedTokenSymbol =
    | SYSTEM_SUPPORTED_SYMBOL.rif
    | SYSTEM_SUPPORTED_SYMBOL.rbtc

export type BaseToken = BaseCurrency<SupportedTokenSymbol> & {
  tokenAddress: string
}

export type TokenRecord<T extends BaseToken> = Record<SupportedTokenSymbol, T>

export const SYSTEM_TOKENS: TokenRecord<BaseToken> = {
  [SYSTEM_SUPPORTED_SYMBOL.rbtc]: {
    symbol: SYSTEM_SUPPORTED_SYMBOL.rbtc,
    displayName: 'R-BTC',
    tokenAddress: ZERO_ADDRESS,
  },
  [SYSTEM_SUPPORTED_SYMBOL.rif]: {
    symbol: SYSTEM_SUPPORTED_SYMBOL.rif,
    displayName: 'RIF',
    tokenAddress: rifTokenAddress,
  },
}
