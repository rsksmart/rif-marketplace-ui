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
      availableMonths: [...state.availableMonths.filter((x) => x !== payload.monthsDuration)],
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
    planItems: [...state.planItems.filter((x) => x.internalId !== internalId)],
  }),
  EDIT_ITEM: (state: ListingState, payload: EditItemPayload) => {
    const {
      internalId, monthsDuration, pricePerGb, currency,
    } = payload
    const newPlanItems = state.planItems.map((p) => {
      if (p.internalId === internalId) {
        return {
          ...p,
          monthsDuration,
          pricePerGb,
          currency,
        }
      }
      return p
    })
    const unavailableMonths = newPlanItems.map((x) => x.monthsDuration)
    const newAvailableMonths = state.allMonthsOptions.filter(
      (x) => unavailableMonths.indexOf(x) === -1,
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
