import { StorageState } from './interfaces'
import {
  StoragePayload,
  STORAGE_ACTIONS,
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
} from './storageActions'

export interface StorageReducer {
  (state: StorageState, payload: StoragePayload): StorageState
}

export type StorageActions = {
  [key in STORAGE_ACTIONS]: StorageReducer
}

export const storageActions: StorageActions = {
  ADD_ITEM: (state: StorageState, payload: AddItemPayload) => {
    const internalCounter = state.plan?.internalCounter || 1
    const newPlan = {
      ...payload,
      internalId: internalCounter,
    }
    return {
      ...state,
      plan: state.plan && {
        ...state.plan,
        availableMonths: [
          ...state.plan?.availableMonths.filter(
            (x) => x !== payload.monthsDuration
          ),
        ],
        internalCounter: internalCounter + 1,
        planItems: [...state.plan?.planItems, newPlan],
      },
    }
  },
  REMOVE_ITEM: (
    state: StorageState,
    { internalId, monthsDuration }: RemoveItemPayload
  ) => ({
    ...state,
    plan: state.plan && {
      ...state.plan,
      availableMonths: [...state.plan?.availableMonths, monthsDuration],
      planItems: [
        ...state.plan?.planItems.filter((x) => x.internalId !== internalId),
      ],
    },
  }),
  EDIT_ITEM: (state: StorageState, payload: EditItemPayload) => {
    // TODO: update the available months
    const { internalId, monthsDuration, pricePerGb, currency } = payload
    const newPlanItems =
      state.plan?.planItems.map((p) => {
        if (p.internalId === internalId) {
          return {
            ...p,
            monthsDuration,
            pricePerGb,
            currency,
          }
        }
        return p
      }) || []

    // TODO: move the state from plan, it's too nested and confusing
    const unavailableMonths = newPlanItems.map((x) => x.monthsDuration)
    const newAvailableMonths =
      state.plan?.allMonthsOptions.filter(
        (x) => unavailableMonths.indexOf(x) === -1
      ) || []
    return {
      ...state,
      plan: state.plan && {
        ...state.plan,
        planItems: newPlanItems,
        availableMonths: newAvailableMonths,
      },
    }
  },
  SET_AVAILABLE_SIZE: (
    state: StorageState,
    { availableSize }: SetAvailableSizePayload
  ) => ({
    ...state,
    plan: state.plan && {
      ...state.plan,
      availableSize,
    },
  }),
  SET_COUNTRY: (state: StorageState, { country }: SetCountryPayload) => ({
    ...state,
    plan: state.plan && {
      ...state.plan,
      country,
    },
  }),
}
