import { Dispatch } from 'react'
import { ContextState } from 'context/storeUtils/interfaces'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import networkConfig from 'config'
import { OfferEditAction } from './offerEditActions'

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  timePeriod: TimePeriodEnum
}

export interface OfferEditState extends ContextState {
  system: string
  availableSize: number
  country: string
  planItems: StoragePlanItem[]
  internalCounter: number // counter to assign unique ids to planItems, this counter only sums up
  allPeriods: TimePeriodEnum[]
  peerId: string
  usedPeriodsPerCurrency: Record<string, TimePeriodEnum[]> // dictionary to easily know the timePeriods already used by a given currency
}

export interface OfferEditContextProps {
  state: OfferEditState
  dispatch: Dispatch<OfferEditAction>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

const ZeroAddress = '0x0000000000000000000000000000000000000000'

export const TokenAddressees = {
  [tokenDisplayNames.rbtc]: ZeroAddress, // we are using zero address for native token is Storage Manager SC
  [tokenDisplayNames.rif]: networkConfig.contractAddresses.rif,
}
