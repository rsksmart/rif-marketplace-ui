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
    { internalId, monthsDuration }: RemoveItemPayload,
  ) => ({
    ...state,
    plan: state.plan && {
      ...state.plan,
      availableMonths: [...state.plan?.availableMonths, monthsDuration],
      planItems: [...state.plan?.planItems.filter((x) => x.internalId !== internalId)],
    },
  }),
  EDIT_ITEM: (state: StorageState, payload: EditItemPayload) => {
    // TODO: remove the item with the internalId provided and add the one of the payload
    const { internalId } = payload
    return {
      ...state,
      plan: state.plan && {
        ...state.plan,
        planItems: [
          ...state.plan?.planItems.filter((x) => x.internalId !== internalId),
          { ...payload },
        ],
      },
    }
  },
  SET_AVAILABLE_SIZE: (
    state: StorageState,
    { availableSize }: SetAvailableSizePayload,
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
