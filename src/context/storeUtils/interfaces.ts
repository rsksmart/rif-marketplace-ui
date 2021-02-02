import { RnsContextNames } from 'context/Services/rns/interfaces'
import { ContextName as MarketContextName } from 'context/Market/interfaces'
import { ContextName as AppContextName } from 'context/App/AppContext'
import { ContextName as StorageEditOfferContextName } from 'context/Market/storage/OfferEditContext'
import { ContextName as NotificationsContextName } from 'context/Services/notifications/interfaces'
import { ContextName as StorageUploadContextName } from 'context/Services/storage/upload/Context'
import { ContextName as ConfirmationsContextName } from 'context/Confirmations/Context'
import { APP_ACTION } from 'context/App/appActions'
import { SERVICE_ACTION } from 'context/Services/interfaces'
import { OFFER_EDIT_ACTION } from 'context/Market/storage/offerEditActions'
import { StorageContextNames } from 'context/Services/storage/interfaces'
import { Dispatch } from 'react'

export type AvailableContexts =
  | RnsContextNames
  | MarketContextName
  | AppContextName
  | StorageContextNames
  | StorageEditOfferContextName
  | NotificationsContextName
  | StorageUploadContextName
  | ConfirmationsContextName

export interface ContextPayload {
  [key: string]: any // TODO: make into [K in keyof T]: any where T is ContextState
}

export type ContextActionType =
  | APP_ACTION
  | SERVICE_ACTION
  | OFFER_EDIT_ACTION

export interface ContextDispatch<
  T extends ContextActionType,
  P extends ContextPayload
  > {
  readonly type: T
  readonly payload: P
}

export interface ContextState {
  contextID: AvailableContexts
}

export interface ContextReducer {
  (
    state: ContextState,
    dispatch: ContextDispatch<ContextActionType, ContextPayload>
  ): ContextState
}

export interface ContextAction {
  (state: ContextState, payload: ContextPayload): ContextState
}

export type ContextActions = {
  [key: string]: ContextAction
}

export type ContextProps<State, Action> = {
  state: State
  dispatch: Dispatch<Action>
}
