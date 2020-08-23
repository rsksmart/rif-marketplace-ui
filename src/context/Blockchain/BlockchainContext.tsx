import { Web3Store } from '@rsksmart/rif-ui'
import { ConfirmationAPI, ConfirmationsItem } from 'api/rif-marketplace-cache/blockchain/confirmations'
import utils from 'api/rif-marketplace-cache/blockchain/utils'
import React, {
  createContext, Dispatch, useContext, useEffect, useReducer,
} from 'react'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { ContextActions, ContextReducer, ContextState } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { BlockchainAction } from './blockchainActions'
import { blockchainActions, BlockchainReducer } from './blockchainReducer'

const { mapFromTransport } = utils

export type ContextName = 'blockchain'
export interface BlockchainState extends ContextState {
  confirmations: Modify<Partial<ConfirmationsItem>, {
    txHash?: string
  }>
}

export interface BlockchainContextProps {
  state: BlockchainState
  dispatch: Dispatch<BlockchainAction>
}

export const initialState: BlockchainState = {
  contextID: 'blockchain',
  confirmations: {},
}

const BlockchainContext = createContext({} as BlockchainContextProps | any)
const blockchainReducer: BlockchainReducer | ContextReducer = storeReducerFactory(initialState, blockchainActions as unknown as ContextActions)

export const BlockchainContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blockchainReducer, initialState)
  const {
    state: {
      apis: {
        confirmations,
      },
    }, dispatch: appDispatch,
  }: AppContextProps = useContext(AppContext)
  const { state: { account } } = useContext(Web3Store)
  const api = confirmations as ConfirmationAPI

  const {
    confirmations: {
      txHash,
      currentCount: storedCurrentCt,
      targetCount: storedTargetCt,
    },
  } = state as BlockchainState

  useEffect(() => {
    if (storedCurrentCt && storedTargetCt) {
      if (storedCurrentCt >= storedTargetCt) {
        dispatch({
          type: 'SET_TX_HASH',
          payload: {
            txHash: undefined,
          } as any,
        })
      }
    }
  }, [storedCurrentCt, storedTargetCt])

  useEffect(() => {
    const {
      service,
      attachEvent,
    } = api

    if (service && txHash) {
      attachEvent('newConfirmation', (result) => {
        const confs = mapFromTransport([result])
        const currentTx = confs[txHash as string]

        if (currentTx) {
          dispatch({
            type: 'SET_CONFIRMATIONS',
            payload: currentTx as any,
          })
        }
      })
    }
  }, [txHash, api])

  useEffect(() => {
    if (account) {
      api.connect(errorReporterFactory(appDispatch))
    }
  }, [account, api, appDispatch])

  const value = { state, dispatch }
  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>
}

export default BlockchainContext
