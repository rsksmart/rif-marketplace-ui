import { Dispatch } from 'react'
import { ContextState } from 'context/storeUtils/interfaces'
import networkConfig from 'config'
import {
  BillingPlan,
  StorageOffer,
  SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { ZERO_ADDRESS } from 'constants/strings'
import { SupportedTokens } from '../../../contracts/interfaces'
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

export const TokenAddressees: Record<SupportedTokens, string> = {
  rbtc: ZERO_ADDRESS, // we are using zero address for native token is Storage Manager SC
  rif: networkConfig.contractAddresses.rif,
}
