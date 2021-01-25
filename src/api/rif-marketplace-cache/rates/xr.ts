import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, APIService, isResultPaginated } from 'api/models/apiService'
import { BaseCurrency, SupportedTokenSymbol } from 'models/Token'
import { getSupportedTokenByName } from 'utils/tokenUtils'
import { Modify } from 'utils/typeUtils'
import client from '../client'

export type XRServiceAddress = 'rates/v0'
export const xrServiceAddress: XRServiceAddress = 'rates/v0'

// - juraj
// move to Model?
export enum SYSTEM_SUPPORTED_FIAT {
  usd = 'usd',
  // (fiatMulC): Enable for fiat multicurrency
  // eur = 'eur',
  // ars = 'ars',
  // cny = 'cny',
  // krw = 'krw',
  // jpy = 'jpy',
}

// - juarj
// Abstract fiat + crypto type to extract 'btc' from SupportedFiatSymbol, SupportedTokenSymbol
// export type SupportedFiatSymbol = [
//   | SYSTEM_SUPPORTED_FIAT.usd
// (fiatMulC): Enable for fiat multicurrency
//   | SYSTEM_SUPPORTED_FIAT.eur
//   | SYSTEM_SUPPORTED_FIAT.ars
//   | SYSTEM_SUPPORTED_FIAT.cny
//   | SYSTEM_SUPPORTED_FIAT.krw
//   | SYSTEM_SUPPORTED_FIAT.jpy
//   | 'btc' // temporary: get from SupportedTokenSymbol
// ]

export type SupportedFiatSymbol = 'usd'
// (fiatMulC): Enable for fiat multicurrency
// | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';

// -juraj
// BaseFiat extend w/ BaseCurrency
export type BaseFiat = {
  symbol: SupportedFiatSymbol
  displayName: string
}
export type TokenRecord<T extends BaseFiat> = Record<SupportedFiatSymbol, T>

export const SUPPORTED_FIAT: TokenRecord<BaseFiat> = {
  usd: {
    symbol: 'usd',
    displayName: 'USD',
  },
}

export type XRItem = Partial<{
  [F in SupportedFiatSymbol]: number
}> & {
  token: SupportedTokenSymbol
}

export interface XRFilter {
  fiatSymbol: SupportedFiatSymbol
}

export type XRAPIService = Modify<APIService, {
  path: XRServiceAddress
  fetch: (filters: XRFilter) => Promise<XRItem[]>
}>

export class XRService extends AbstractAPIService implements XRAPIService {
  path = xrServiceAddress

  constructor() { super(client) }

  _fetch = async (filters: XRFilter): Promise<XRItem[]> => {
    const { fiatSymbol } = filters

    const results: Paginated<XRItem> = await this.service.find({
      query: {
        $select: ['token', fiatSymbol],
      },
    })
    const { data, ...metadata } = isResultPaginated(results)
      ? results : { data: results }
    this.meta = metadata

    return data.filter((item) => getSupportedTokenByName(item.token))
  }
}
