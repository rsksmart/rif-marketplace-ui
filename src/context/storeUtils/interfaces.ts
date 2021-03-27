import { RnsContextNames } from 'context/Services/rns/interfaces'
import { ContextName as MarketContextName } from 'context/Market/interfaces'
import { AppContextName } from 'context/App'
import { StorageEditOfferContextName } from 'context/Market/storage'
import { ContextName as NotificationsContextName } from 'context/Services/notifications/interfaces'
import { StorageUploadContextName } from 'context/Services/storage/upload'
import { ContextName as ConfirmationsContextName } from 'context/Confirmations/Context'
import { StorageContextNames } from 'context/Services/storage/interfaces'
import { Dispatch } from 'react'
import { NotifierContextNames } from 'context/Services/notifier'
import { StakingContextName } from 'context/Services/staking'

export type AvailableContexts =
  | RnsContextNames
  | MarketContextName
  | AppContextName
  | StorageContextNames
  | StorageEditOfferContextName
  | NotificationsContextName
  | StorageUploadContextName
  | ConfirmationsContextName
  | NotifierContextNames
  | StakingContextName

export interface ContextState {
  contextID: AvailableContexts
}

export type ContextProps<State, Action> = {
  state: State
  dispatch: Dispatch<Action>
}
