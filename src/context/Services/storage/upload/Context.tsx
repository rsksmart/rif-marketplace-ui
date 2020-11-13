import React, {
  createContext, FC, useContext,
  useEffect, useMemo, useReducer, useState,
} from 'react'
import { createReducer } from 'context/storeUtils/reducer'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { UploadAPIService } from 'api/rif-storage-upload-service/upload'
import Logger from 'utils/Logger'
import { UIError } from 'models/UIMessage'
import createWithContext from 'context/storeUtils/createWithContext'
import { Web3Store } from '@rsksmart/rif-ui'
import { AsyncActions, Props, State } from './interfaces'
import actions from './actions'
import { StorageOffersContext, StorageOffersContextProps } from '../offers'

export const contextID = 'storage_upload' as const
export type ContextName = typeof contextID

export const initialState: State = {
  contextID,
  status: {},
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
  asyncActions: {
    uploadFiles: (): Promise<void> => Promise.resolve(),
  },
})

const initialAsyncActions: AsyncActions = {
  uploadFiles: (): Promise<void> => Promise.resolve(),
}

export const Provider: FC = ({ children }) => {
  const {
    state: {
      apis: {
        upload: api,
      },
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const {
    service,
    connect,
    post,
  } = api as UploadAPIService
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
      const uploadFiles = (files: File[]): Promise<void> => {
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
        })
          .then((hash) => {
            dispatch({
              type: 'SET_STATUS',
              payload: {
                isDone: true,
                hash,
              },
            })
            Logger.getInstance().debug('Server replied with hash:', hash)
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

      setAsyncActions({
        uploadFiles,
      })
    }
  }, [
    service,
    appDispatch,
    post,
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