import { Dispatch } from 'react'
import { ContextState } from 'context/storeUtils/interfaces'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import networkConfig from 'config'
import {
  BillingPlan,
  StorageOffer,
  SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { OfferEditAction } from './offerEditActions'

export interface StorageBillingPlan extends BillingPlan {
  internalId?: number
}

export interface OfferEditState extends ContextState {
  system: string
  availableSize: number
  country: string
  billingPlans: StorageBillingPlan[]
  internalCounter: number // counter to assign unique ids to billingPlans, this counter only sums up
  allBillingPeriods: SubscriptionPeriod[]
  peerId: string
  usedPeriodsPerCurrency: Record<string, SubscriptionPeriod[]> // dictionary to easily know the timePeriods already used by a given currency
  originalOffer?: StorageOffer
}

export interface OfferEditContextProps {
  state: OfferEditState
  dispatch: Dispatch<OfferEditAction>
}

const ZeroAddress = '0x0000000000000000000000000000000000000000'

export const TokenAddressees = {
  [tokenDisplayNames.rbtc]: ZeroAddress, // we are using zero address for native token is Storage Manager SC
  [tokenDisplayNames.rif]: networkConfig.contractAddresses.rif,
}
