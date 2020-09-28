import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { StorageBillingPlan, OfferEditState } from './interfaces'
import {
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
  SetPeerIdPayload,
  OfferEditActions,
  OfferEditPayload,
  SetOfferPayload,
} from './offerEditActions'
import { initialState } from './OfferEditContext'

export interface OfferEditReducer<P extends OfferEditPayload> {
  (state: OfferEditState, payload: P): OfferEditState
}

const calculateUsedPeriodsPerCurrency = (
  billingPlans: StorageBillingPlan[],
): Record<string, []> => billingPlans.reduce((acc, item) => {
  acc[item.currency] = [...(acc[item.currency] || []), item.period]
  return acc
}, {})

export const offerEditActions: OfferEditActions = {
  ADD_ITEM: (state: OfferEditState, payload: AddItemPayload) => {
    const { internalCounter, billingPlans } = state
    const newPlan = {
      ...payload,
      internalId: internalCounter,
    }
    const newBillingPlans = [...billingPlans, newPlan]

    return {
      ...state,
      billingPlans: newBillingPlans,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newBillingPlans),
      internalCounter: internalCounter + 1,
    }
  },
  CLEAN_UP: (_, __) => initialState,
  REMOVE_ITEM: (state: OfferEditState, { internalId }: RemoveItemPayload) => {
    const { billingPlans } = state
    const newBillingPlans = billingPlans.filter(
      (x) => x.internalId !== internalId,
    )
    return {
      ...state,
      billingPlans: newBillingPlans,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newBillingPlans),
    }
  },
  EDIT_ITEM: (state: OfferEditState, payload: EditItemPayload) => {
    const {
      internalId, period, price, currency,
    } = payload
    const { billingPlans } = state
    const newBillingPlans = billingPlans.map((billingPlan) => {
      if (billingPlan.internalId === internalId) {
        return {
          ...billingPlan,
          period,
          price,
          currency,
        }
      }
      return billingPlan
    })
    return {
      ...state,
      billingPlans: newBillingPlans,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newBillingPlans),
    }
  },
  SET_AVAILABLE_SIZE: (
    state: OfferEditState,
    { availableSize }: SetAvailableSizePayload,
  ) => ({
    ...state,
    availableSize,
  }),
  SET_COUNTRY: (state: OfferEditState, { country }: SetCountryPayload) => ({
    ...state,
    country,
  }),
  SET_PEER_ID: (state: OfferEditState, { peerId }: SetPeerIdPayload) => ({
    ...state,
    peerId,
  }),
  SET_OFFER: (
    state: OfferEditState,
    {
      availableSize,
      country,
      peerId,
      billingPlans,
      system,
      offerId,
    }: SetOfferPayload,
  ) => {
    // every plan item needs a unique id to handle the edition
    const newBillingPlans: StorageBillingPlan[] = billingPlans.map(
      (plan: StorageBillingPlan, index: number) => ({
        ...plan,
        price: plan.price.mul(UNIT_PREFIX_POW2.KILO),
        internalId: index + 1,
      }),
    )
    return {
      ...state,
      availableSize,
      country,
      peerId,
      billingPlans: newBillingPlans,
      system,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newBillingPlans),
      internalCounter: newBillingPlans.length + 1,
      offerId,
    }
  },
}
