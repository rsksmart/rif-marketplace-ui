import { Web3Store } from '@rsksmart/rif-ui'
import { ConfirmationAPI, ConfirmationsItem } from 'api/rif-marketplace-cache/blockchain/confirmations'
import utils from 'api/rif-marketplace-cache/blockchain/utils'
import React, {
  createContext, Dispatch, useContext, useEffect, useReducer,
} from 'react'
import AppStore, { AppStoreProps, errorReporterFactory } from 'store/App/AppStore'
import { StoreActions, StoreReducer, StoreState } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { Modify } from 'utils/typeUtils'
import { BlockchainAction } from './blockchainActions'
import { blockchainActions, BlockchainReducer } from './blockchainReducer'

const { mapFromTransport } = utils

export type StoreName = 'blockchain'
export interface BlockchainState extends StoreState {
  confirmations: Modify<Partial<ConfirmationsItem>, {
    txHash?: string
  }>
}

export interface BlockchainStoreProps {
  state: BlockchainState
  dispatch: Dispatch<BlockchainAction>
}

export const initialState: BlockchainState = {
  storeID: 'blockchain',
  confirmations: {},
}

const BlockchainStore = createContext({} as BlockchainStoreProps | any)
const blockchainReducer: BlockchainReducer | StoreReducer = storeReducerFactory(initialState, blockchainActions as unknown as StoreActions)

export const BlockchainStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blockchainReducer, initialState)
  const {
    state: {
      apis: {
        confirmations,
      },
    }, dispatch: appDispatch,
  }: AppStoreProps = useContext(AppStore)
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
  return <BlockchainStore.Provider value={value}>{children}</BlockchainStore.Provider>
}

export default BlockchainStore
