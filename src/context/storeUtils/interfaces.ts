import { RnsContextNames } from 'context/Services/rns/interfaces'
import { StorageContextNames } from 'context/Services/storage/interfaces'
import { ContextName as BlockchainContextName } from 'context/Blockchain/BlockchainContext'
import { ContextName as MarketContextName } from 'context/Market/MarketContext'
import { ContextName as AppContextName } from 'context/App/AppContext'
import { MARKET_ACTION } from 'context/Market/marketActions'
import { APP_ACTION } from 'context/App/appActions'
import { BLOCKCHAIN_ACTION } from 'context/Blockchain/blockchainActions'
import { SERVICE_ACTION } from 'context/Services/interfaces'

export type AvailableContexts =
  | RnsContextNames
  | BlockchainContextName
  | MarketContextName
  | AppContextName
  | StorageContextNames

export interface ContextPayload {
  [key: string]: any // TODO: make into [K in keyof T]: any where T is ContextState
}

export type ContextActionType = APP_ACTION | BLOCKCHAIN_ACTION | MARKET_ACTION | SERVICE_ACTION

export interface ContextDispatch<T extends ContextActionType, P extends ContextPayload> {
  readonly type: T
  readonly payload: P
}

export interface ContextState {
  contextID: AvailableContexts
}

export interface ContextReducer {
  (state: ContextState, dispatch: ContextDispatch<ContextActionType, ContextPayload>): ContextState
}

export interface ContextAction {
  (state: ContextState, payload: ContextPayload): ContextState
}

export type ContextActions = {
  [key: string]: ContextAction
}
