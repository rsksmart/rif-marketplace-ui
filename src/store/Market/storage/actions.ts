
import { StorageState } from './interfaces'
import { StoreDispatcher } from 'store/storeUtils/interfaces'
import { RnsReducer } from '../rns/rnsActions'

export type STORAGE_ACTION = 'NOOP'

export type StoragePayload = {}

export interface StorageAction extends StoreDispatcher<StoragePayload> {
  type: STORAGE_ACTION
}

export interface StorageReducer<P extends StoragePayload> {
  (state: StorageState, payload: P): StorageState
}

export type Actions = {
  NOOP: RnsReducer<StoragePayload>
}

export const storageActions: Actions = {
  NOOP: (state, payload) => ({ ...state, ...payload })
}
