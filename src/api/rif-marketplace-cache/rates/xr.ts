import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, APIService, isResultPaginated } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'

export type XRServiceAddress = 'rates/v0'
export const xrServiceAddress: XRServiceAddress = 'rates/v0'

export type SupportedFiat = 'usd' | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';

export const SUPPORTED_TOKENS = ['rif', 'rbtc'] as const
export type SupportedToken = typeof SUPPORTED_TOKENS[number];
export const tokenDisplayNames: Record<SupportedToken, string> = {
  rif: 'RIF',
  rbtc: 'RBTC',
}

export type XRItem = { [fiatSymbol: string]: number }

export interface XRFilter {
  fiatSymbol: SupportedFiat
}

export type XRAPIService = Modify<APIService, {
  path: XRServiceAddress
  fetch: (filters: XRFilter) => Promise<XRItem[]>
}>

export type ExchangeRate = {
  [fiatSymbol in SupportedFiat]: number
} & {
  token: SupportedToken
}

export const isSupportedToken = (
  token: SupportedToken | string,
): token is SupportedToken => SUPPORTED_TOKENS.includes(token as SupportedToken)

export class XRService extends AbstractAPIService implements XRAPIService {
  path = xrServiceAddress

  _fetch = async (filters: XRFilter): Promise<ExchangeRate[]> => {
    const { fiatSymbol } = filters

    const results: Paginated<ExchangeRate> = await this.service.find({
      query: {
        $select: ['token', fiatSymbol],
      },
    })
    const { data, ...metadata } = isResultPaginated(results)
      ? results : { data: results }
    this.meta = metadata

    return data.filter(({ token }) => isSupportedToken(token))
  }
}
