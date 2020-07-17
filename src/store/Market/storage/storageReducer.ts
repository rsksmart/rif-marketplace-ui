import { StorageState } from './interfaces'
import {
  StoragePayload,
  STORAGE_ACTIONS,
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
} from './storageActions'

export interface StorageReducer {
  (state: StorageState, payload: StoragePayload): StorageState
}

export type StorageActions = {
  [key in STORAGE_ACTIONS]: StorageReducer
}

export const storageActions: StorageActions = {
  ADD_ITEM: (state: StorageState, payload: AddItemPayload) => {
    // add the item and return new copy of the state
    return { ...state }
  },
  REMOVE_ITEM: (state: StorageState, payload: RemoveItemPayload) => {
    // TODO
    return { ...state }
  },
  EDIT_ITEM: (state: StorageState, payload: EditItemPayload) => {
    // TODO
    return { ...state }
  },
}
