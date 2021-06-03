import { SupportedTokenSymbol } from 'models/Token'
import { parseToBigDecimal } from 'utils/parsers'

export type StakeBalanceTransport = {
  account: string
  symbol: string
  token: string
  total: string
}

export interface StakeTransport {
  totalStakedFiat: string
  stakes: StakeBalanceTransport[]
}

export type StakeFilters = {
  account: string
}

export type StakedBalances = Record<SupportedTokenSymbol, string>

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
