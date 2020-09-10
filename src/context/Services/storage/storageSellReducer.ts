import { StoragePlanItem, StorageSellState } from './interfaces'
import {
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
  SetPeerIdPayload,
  StorageSellActions,
  StorageSellPayload,
} from './storageSellActions'
import { initialState } from './StorageSellContext'

export interface StorageSellReducer<P extends StorageSellPayload> {
  (state: StorageSellState, payload: P): StorageSellState
}

const calculateUsedPeriodsPerCurrency = (
  planItems: StoragePlanItem[],
): Record<string, []> => planItems.reduce((acc, item) => {
  acc[item.currency] = [...(acc[item.currency] || []), item.timePeriod]
  return acc
}, {})

export const storageSellActions: StorageSellActions = {
  ADD_ITEM: (state: StorageSellState, payload: AddItemPayload) => {
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
  REMOVE_ITEM: (
    state: StorageSellState,
    { internalId }: RemoveItemPayload,
  ) => {
    const { planItems } = state
    const newPlanItems = planItems.filter((x) => x.internalId !== internalId)
    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
    }
  },
  EDIT_ITEM: (state: StorageSellState, payload: EditItemPayload) => {
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
    state: StorageSellState,
    { availableSize }: SetAvailableSizePayload,
  ) => ({
    ...state,
    availableSize,
  }),
  SET_COUNTRY: (state: StorageSellState, { country }: SetCountryPayload) => ({
    ...state,
    country,
  }),
  SET_PEER_ID: (state: StorageSellState, { peerId }: SetPeerIdPayload) => ({
    ...state,
    peerId,
  }),
}
