import { ListingState, StoragePlanItem } from './interfaces'
import {
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
  ListingActions,
  ListingPayload,
  SetPeerIdPayload,
} from './listingActions'
import { initialState } from './ListingContext'

export interface ListingReducer<P extends ListingPayload> {
  (state: ListingState, payload: P): ListingState
}

const calculateUsedPeriodsPerCurrency = (
  planItems: StoragePlanItem[],
): Record<string, []> => planItems.reduce((acc, item) => {
  acc[item.currency] = [...(acc[item.currency] || []), item.timePeriod]
  return acc
}, {})

export const listingActions: ListingActions = {
  ADD_ITEM: (state: ListingState, payload: AddItemPayload) => {
    const { internalCounter, planItems } = state
    const newPlan = {
      ...payload,
      internalId: internalCounter,
    }
    const newPlanItems = [...planItems, newPlan]

    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
      internalCounter: internalCounter + 1,
    }
  },
  CLEAN_UP: (_, __) => initialState,
  REMOVE_ITEM: (state: ListingState, { internalId }: RemoveItemPayload) => {
    const { planItems } = state
    const newPlanItems = planItems.filter((x) => x.internalId !== internalId)
    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
    }
  },
  EDIT_ITEM: (state: ListingState, payload: EditItemPayload) => {
    const {
      internalId, timePeriod, pricePerGb, currency,
    } = payload
    const { planItems } = state
    const newPlanItems = planItems.map((planItem) => {
      if (planItem.internalId === internalId) {
        return {
          ...planItem,
          timePeriod,
          pricePerGb,
          currency,
        }
      }
      return planItem
    })
    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
    }
  },
  SET_AVAILABLE_SIZE: (
    state: ListingState,
    { availableSize }: SetAvailableSizePayload,
  ) => ({
    ...state,
    availableSize,
  }),
  SET_COUNTRY: (state: ListingState, { country }: SetCountryPayload) => ({
    ...state,
    country,
  }),
  SET_PEER_ID: (state: ListingState, { peerId }: SetPeerIdPayload) => ({
    ...state,
    peerId,
  }),
}
