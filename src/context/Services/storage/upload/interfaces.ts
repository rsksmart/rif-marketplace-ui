import { Dispatch } from 'react'
import { Status } from 'components/templates/ProgressOverlay'
import { ContextState } from 'context/storeUtils/interfaces'
import { UploadResponse } from 'api/rif-storage-upload-service/upload/interfaces'

// STATE
export type State = ContextState & {
  status: Status & {
    uploadResponse?: UploadResponse
  }
}

// PAYLOAD
type StatusPayload = Status & {
  uploadResponse?: UploadResponse
}

// ACTIONS
export type Action = (
  | {
    type: 'SET_STATUS'
    payload: StatusPayload
  }
)

export type Actions = {
  SET_STATUS: (state: State, payload: StatusPayload) => State
}

export type AsyncAction = {
  (args?: any): Promise<void>
}

export type AsyncActions = {
  uploadFiles: AsyncAction
}

// PROPS
export type Props = {
    state: State
    dispatch: Dispatch<Action>
    asyncActions: AsyncActions
}
