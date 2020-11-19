import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, APIService, isResultPaginated } from 'api/models/apiService'
import { Modify } from 'utils/typeUtils'
import { SUPPORTED_TOKENS, SupportedTokens } from 'contracts/interfaces'

export type XRServiceAddress = 'rates/v0'
export const xrServiceAddress: XRServiceAddress = 'rates/v0'

export type SupportedFiat = 'usd' | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';

export const tokenDisplayNames: Record<SupportedTokens, string> = {
  [SUPPORTED_TOKENS.rif]: 'RIF',
  [SUPPORTED_TOKENS.rbtc]: 'RBTC',
}

export type XRItem = Partial<{
  [F in SupportedFiat]: number
}> & {
  token: SupportedTokens
}

export interface XRFilter {
  fiatSymbol: SupportedFiat
}

export type XRAPIService = Modify<APIService, {
  path: XRServiceAddress
  fetch: (filters: XRFilter) => Promise<XRItem[]>
}>

export class XRService extends AbstractAPIService implements XRAPIService {
  path = xrServiceAddress

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

    return data.filter((item) => !!SUPPORTED_TOKENS[item.token])
  }
}
