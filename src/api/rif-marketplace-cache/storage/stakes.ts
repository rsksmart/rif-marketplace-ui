import { AbstractAPIService } from 'api/models/apiService'
import { StakeTransport } from 'api/models/storage/transports'
import { parseToBigDecimal } from 'utils/parsers'
import { SupportedToken } from '../rates/xr'
import {
  StakeAPIService,
  StakeFilters,
  StorageServiceAddress,
  StorageWSChannel,
} from './interfaces'

export const stakesAddress: StorageServiceAddress = 'storage/v0/stakes'
export const stakesWSChannel: StorageWSChannel = 'stakes'

export type StakedBalances = Record<SupportedToken, string>

export type Staked = {
  stakedBalances: StakedBalances
  totalStakedUSD: string
}

export const mapStakesListFromTransport = (
  stakes,
): StakedBalances => stakes.reduce((acc, { symbol, total }) => {
  acc[symbol] = parseToBigDecimal(total, 18).toString()
  return acc
}, {})

export const mapFromTransport = (stakeTransport: StakeTransport): Staked => {
  const { totalStakedFiat: totalStakedUSD, stakes } = stakeTransport
  const stakedBalances = mapStakesListFromTransport(stakes)

  return {
    stakedBalances,
    totalStakedUSD,
  }
}

export class StakesService extends AbstractAPIService
  implements StakeAPIService {
  path = stakesAddress

  _channel = stakesWSChannel

  _fetch = async (filters: StakeFilters): Promise<Staked> => {
    const { account } = filters
    const result = await this.service.get(account)
    return mapFromTransport(result)
  }
}