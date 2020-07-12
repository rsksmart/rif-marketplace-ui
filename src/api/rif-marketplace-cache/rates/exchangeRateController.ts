import { AbstractAPIController, APIController } from 'api/models/apiController'
import { Modify } from 'utils/typeUtils'

export type XEServiceAddress = 'rates/v0'
export const xeServiceAddress: XEServiceAddress = 'rates/v0'

export type SupportedFiat = 'usd' | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';
export type SupportedTokens = 'rif';
export const tokenDisplayNames: Record<SupportedTokens, string> = {
  rif: 'RIF',
  // rbtc: 'RBTC',
}

export interface XEFilter {
  fiatSymbol: SupportedFiat
}

export type XEAPIController = Modify<APIController, {
  path: XEServiceAddress
  fetch: (filters: XEFilter) => Promise<[]>
}>

export class XEController extends AbstractAPIController implements XEAPIController {
  path = xeServiceAddress

  fetch = async (filters: XEFilter): Promise<[]> => {
    if (!this.service) throw Error('The exchange rates service is not connected')
    const { fiatSymbol } = filters

    const results = await this.service.find({
      query: {
        $select: ['token', fiatSymbol],
      },
    })

    return results
  }
}
