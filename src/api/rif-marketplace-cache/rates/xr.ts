import { AbstractAPIService, APIService } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'

export type XRServiceAddress = 'rates/v0'
export const xrServiceAddress: XRServiceAddress = 'rates/v0'

export type SupportedFiat = 'usd' | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';
export type SupportedTokens = 'rif';
export const tokenDisplayNames: Record<SupportedTokens, string> = {
  rif: 'RIF',
  // rbtc: 'RBTC',
}

export type XRItem = { [fiatSymbol: string]: number }

export interface XRFilter {
  fiatSymbol: SupportedFiat
}

export type XRAPIService = Modify<APIService, {
  path: XRServiceAddress
  fetch: (filters: XRFilter) => Promise<XRItem[]>
}>

export class XRService extends AbstractAPIService implements XRAPIService {
  path = xrServiceAddress

  _fetch = async (filters: XRFilter): Promise<[]> => {
    const { fiatSymbol } = filters

    const results = await this.service.find({
      query: {
        $select: ['token', fiatSymbol],
      },
    }) as unknown as []

    return results
  }
}
