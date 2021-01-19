import { Dispatch } from 'react'
import { Big } from 'big.js'
import { Status } from 'components/templates/ProgressOverlay'
import { ContextState } from 'context/storeUtils/interfaces'
import { UploadResponse } from 'api/rif-storage-upload-service/upload/interfaces'

// STATE
export type State = ContextState & {
  status: Status & {
    uploadResponse?: UploadResponse
  }
  fileSizeLimit: Big
  isLoading: {
    sizeLimit: boolean
  }
}

// PAYLOAD
type StatusPayload = Status & {
  uploadResponse?: UploadResponse
}

export type SizeLimitPayload = {
  fileSizeLimit: Big
}

export type IsLoadingPayload = {
  sizeLimit: boolean
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
  SET_SIZE_LIMIT: (state: State, payload: SizeLimitPayload) => State
  SET_IS_LOADING: (state: State, payload: IsLoadingPayload) => State
}

export type AsyncAction<ARGS, RETURN> = {
  (args: ARGS): Promise<RETURN>
}

export type UploadFilesAction = AsyncAction<File[], void>
export type GetFileSizeAction = AsyncAction<string, Big>

export type AsyncActions = {
  uploadFiles: UploadFilesAction
  getFileSize: GetFileSizeAction
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
  asyncActions: AsyncActions
}
