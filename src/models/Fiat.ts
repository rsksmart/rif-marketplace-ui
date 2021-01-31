import { BaseCurrency } from './Currency'

export enum SYSTEM_SUPPORTED_FIAT {
  usd = 'usd',
}

export type SupportedFiatSymbol =
  | SYSTEM_SUPPORTED_FIAT.usd

export type BaseFiat = BaseCurrency<SupportedFiatSymbol>

export type TokenRecord<T extends BaseFiat> = Record<SupportedFiatSymbol, T>

export const SUPPORTED_FIAT: TokenRecord<BaseFiat> = {
  usd: {
    symbol: SYSTEM_SUPPORTED_FIAT.usd,
    displayName: 'USD',
  },
}
