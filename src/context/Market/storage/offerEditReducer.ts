import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { StorageBillingPlan, OfferEditState } from './interfaces'
import {
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetTotalCapacityPayload,
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
  SET_TOTAL_CAPACITY: (
    state: OfferEditState,
    { totalCapacity }: SetTotalCapacityPayload,
  ) => ({
    ...state,
    totalCapacity,
  }),
  SET_COUNTRY: (state: OfferEditState, { country }: SetCountryPayload) => ({
    ...state,
    country,
  }),
  SET_PEER_ID: (state: OfferEditState, { peerId }: SetPeerIdPayload) => ({
    ...state,
    peerId,
  }),
  SET_OFFER: (state: OfferEditState, payload: SetOfferPayload) => {
    const {
      totalCapacityGB,
      location,
      peerId,
      subscriptionOptions,
      system,
    } = payload
    // every plan item needs a unique id to handle the edition
    const newBillingPlans: StorageBillingPlan[] = subscriptionOptions.map(
      (plan: StorageBillingPlan, index: number) => ({
        ...plan,
        price: plan.price.mul(UNIT_PREFIX_POW2.KILO),
        internalId: index + 1,
      }),
    )
    return {
      ...state,
      totalCapacity: totalCapacityGB,
      peerId,
      country: location,
      billingPlans: newBillingPlans,
      system,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newBillingPlans),
      internalCounter: newBillingPlans.length + 1,
      originalOffer: { ...payload },
    }
  },
}
