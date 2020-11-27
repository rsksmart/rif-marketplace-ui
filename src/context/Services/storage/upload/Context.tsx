import React, {
  createContext, FC, useContext,
  useEffect, useMemo, useReducer, useState,
} from 'react'
import { Big } from 'big.js'
import { createReducer } from 'context/storeUtils/reducer'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { UploadResponse, UploadAPIService } from 'api/rif-storage-upload-service/upload/interfaces'
import Logger from 'utils/Logger'
import { UIError } from 'models/UIMessage'
import createWithContext from 'context/storeUtils/createWithContext'
import { Web3Store } from '@rsksmart/rif-ui'
import { storageAddress } from 'contracts/config'
import {
  AsyncActions, GetFileSizeAction, Props, State, UploadFilesAction,
} from './interfaces'
import actions from './actions'
import { StorageOffersContext, StorageOffersContextProps } from '../offers'

export const contextID = 'storage_upload' as const
export type ContextName = typeof contextID

export const initialState: State = {
  contextID,
  status: {},
}

const initialAsyncActions: AsyncActions = {
  uploadFiles: (): Promise<void> => Promise.resolve(),
  getFileSize: (): Promise<Big> => Promise.resolve(Big(0)),
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
  asyncActions: initialAsyncActions,
})

export const Provider: FC = ({ children }) => {
  const {
    state: {
      apis: {
        upload: uploadApi,
      },
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const {
    service,
    connect,
    post,
    fetch,
  } = uploadApi as UploadAPIService
  const {
    state: {
      order: offer,
    },
  } = useContext<StorageOffersContextProps>(StorageOffersContext)
  const {
    state: { account },
  } = useContext(Web3Store)
  const [asyncActions, setAsyncActions] = useState(initialAsyncActions)

  const [state, dispatch] = useReducer(
    createReducer(initialState, actions),
    initialState,
  )

  const reportError = useMemo(
    () => errorReporterFactory(
      appDispatch,
    ), [appDispatch],
  )

  // Get service connection
  if (!service) {
    connect(reportError)
  }

  useEffect(() => {
    if (service && account && offer) {
      const {
        item: {
          id: offerId,
          peerId,
        },
      } = offer
      const uploadFiles: UploadFilesAction = (files) => {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: 'Uploading files...',
          },
        })
        dispatch({
          type: 'SET_STATUS',
          payload: {
            ...initialState.status,
            inProgress: true,
          },
        })

        return new Promise((resolve) => post({
          files,
          account,
          peerId,
          offerId,
          contractAddress: storageAddress,
        })
          .then((uploadResponse: UploadResponse) => {
            dispatch({
              type: 'SET_STATUS',
              payload: {
                isDone: true,
                uploadResponse,
              },
            })
            Logger.getInstance().debug('Upload server replied with:', uploadResponse)
          }).catch((error) => {
            reportError(new UIError({
              error,
              id: 'service-post',
              text: 'Could not upload files.',
            }))
          }).finally(() => {
            appDispatch({
              type: 'SET_IS_LOADING',
              payload: {
                isLoading: false,
                id: 'contract',
              },
            })
            dispatch({
              type: 'SET_STATUS',
              payload: { inProgress: false },
            })
            resolve()
          }))
      }

      const getFileSize: GetFileSizeAction = (fileHash) => {
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: `Fetching size of ${fileHash}...`,
          },
        })
        dispatch({
          type: 'SET_STATUS',
          payload: {
            inProgress: true,
          },
        })

        return fetch(fileHash)
          .catch((error) => {
            reportError(new UIError({
              error,
              id: 'service-post',
              text: 'Could not upload files.',
            }))
            return Big(0)
          }).finally(() => {
            appDispatch({
              type: 'SET_IS_LOADING',
              payload: {
                isLoading: false,
                id: 'contract',
              },
            })
            dispatch({
              type: 'SET_STATUS',
              payload: { inProgress: false },
            })
          })
      }

      setAsyncActions({
        uploadFiles,
        getFileSize,
      })
    }
  }, [
    service,
    appDispatch,
    post,
    fetch,
    reportError,
    account,
    offer,
  ])

  // Finalise
  const value = useMemo(() => ({
    state,
    dispatch,
    asyncActions,
  }), [state, asyncActions])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default createWithContext(Provider)
