import { ListingState } from './interfaces'
import {
  StoragePayload,
  STORAGE_ACTIONS,
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
} from './listingActions'

export interface ListingReducer {
  (state: ListingState, payload: StoragePayload): ListingState
}

export type ListingActions = {
  [key in STORAGE_ACTIONS]: ListingReducer
}

export const listingActions: ListingActions = {
  ADD_ITEM: (state: ListingState, payload: AddItemPayload) => {
    const { internalCounter } = state
    const newPlan = {
      ...payload,
      internalId: internalCounter,
    }
    return {
      ...state,
      availableMonths: state.availableMonths.filter(
        (option) => option !== payload.monthsDuration,
      ),
      internalCounter: internalCounter + 1,
      planItems: [...state.planItems, newPlan],
    }
  },
  REMOVE_ITEM: (
    state: ListingState,
    { internalId, monthsDuration }: RemoveItemPayload,
  ) => ({
    ...state,
    availableMonths: [...state.availableMonths, monthsDuration],
    planItems: state.planItems.filter((x) => x.internalId !== internalId),
  }),
  EDIT_ITEM: (state: ListingState, payload: EditItemPayload) => {
    const {
      internalId, monthsDuration, pricePerGb, currency,
    } = payload
    const { planItems } = state
    const newPlanItems = planItems.map((planItem) => {
      if (planItem.internalId === internalId) {
        return {
          ...planItem,
          monthsDuration,
          pricePerGb,
          currency,
        }
      }
      return planItem
    })
    const newAvailableMonths = state.allMonthsOptions.filter(
      (option) => !newPlanItems.find(
        (newPlanItem) => newPlanItem.monthsDuration === option,
      ),
    )
    return {
      ...state,
      planItems: newPlanItems,
      availableMonths: newAvailableMonths,
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
}
