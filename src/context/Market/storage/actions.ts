import { UNIT_PREFIX_POW2 } from 'utils/utils'
import { initialState } from './Context'
import {
  Actions,
  SetCountryPayload, SetOfferPayload,
  SetPeerIdPayload, SetTotalCapacityPayload,
  State, StorageBillingPlan,
} from './interfaces'

const calculateUsedPeriodsPerCurrency = (
  billingPlans: StorageBillingPlan[],
): Record<string, []> => billingPlans.reduce((acc, item) => {
  acc[item.currency.symbol] = [
    ...(acc[item.currency.symbol] || []),
    item.period,
  ]
  return acc
}, {})

const actions: Actions = {
  ADD_ITEM: (state: State, payload: StorageBillingPlan) => {
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
  CLEAN_UP: () => initialState,
  REMOVE_ITEM: (state: State, { internalId }: StorageBillingPlan) => {
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
  EDIT_ITEM: (state: State, payload: StorageBillingPlan) => {
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
    state: State,
    { totalCapacity }: SetTotalCapacityPayload,
  ) => ({
    ...state,
    totalCapacity,
  }),
  SET_COUNTRY: (state: State, { country }: SetCountryPayload) => ({
    ...state,
    country,
  }),
  SET_PEER_ID: (state: State, { peerId }: SetPeerIdPayload) => ({
    ...state,
    peerId,
  }),
  SET_OFFER: (state: State, payload: SetOfferPayload) => {
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
      originalOffer: {
        ...payload,
        subscriptionOptions: newBillingPlans,
      },
    }
  },
}

export default actions
