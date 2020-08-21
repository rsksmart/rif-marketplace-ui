import { ListingState } from './interfaces'
import {
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
  SetCurrencyPayload,
  ListingActions,
  ListingPayload,
} from './listingActions'
import { initialState } from './ListingContext'

export interface ListingReducer<P extends ListingPayload> {
  (state: ListingState, payload: P): ListingState
}

export const listingActions: ListingActions = {
  ADD_ITEM: (state: ListingState, payload: AddItemPayload) => {
    const { internalCounter, availablePeriods } = state
    const newPlan = {
      ...payload,
      internalId: internalCounter,
    }
    const { timePeriod } = payload
    return {
      ...state,
      availablePeriods: availablePeriods.filter(
        (option) => option !== timePeriod,
      ),
      internalCounter: internalCounter + 1,
      planItems: [...state.planItems, newPlan],
    }
  },
  CLEAN_UP: (_, __) => initialState,
  REMOVE_ITEM: (
    state: ListingState,
    { internalId, timePeriod }: RemoveItemPayload,
  ) => ({
    ...state,
    availablePeriods: [...state.availablePeriods, timePeriod],
    planItems: state.planItems.filter((x) => x.internalId !== internalId),
  }),
  EDIT_ITEM: (state: ListingState, payload: EditItemPayload) => {
    const {
      internalId, timePeriod, pricePerGb, currency,
    } = payload
    const { planItems, allPeriods } = state
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
    const newAvailableMonths = allPeriods.filter(
      (option) => !newPlanItems.find((newPlanItem) => newPlanItem.timePeriod === option),
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
  SET_CURRENCY: (state: ListingState, { currency }: SetCurrencyPayload) => ({
    ...state,
    currency,
  }),
}
