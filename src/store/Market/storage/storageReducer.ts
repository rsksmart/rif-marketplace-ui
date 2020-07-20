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
  // add the item and return new copy of the state
  ADD_ITEM: (state: StorageState, _payload: AddItemPayload) => ({ ...state }),
  // TODO
  REMOVE_ITEM: (state: StorageState, _payload: RemoveItemPayload) => ({ ...state }),
  // TODO
  EDIT_ITEM: (state: StorageState, _payload: EditItemPayload) => ({ ...state }),
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
