import { Web3Store } from '@rsksmart/rif-ui'
import client from 'api/rif-marketplace-cache/config'
import { ConfirmationAPI, ConfirmationsItem, mapFromTransport } from 'api/rif-marketplace-cache/confirmationsController'
import React, {
  createContext, Dispatch, useContext, useEffect, useReducer,
} from 'react'
import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { BlockchainAction, BLOCKCHAIN_ACTIONS } from './blockchainActions'
import blockchainReducer from './blockchainReducer'

type Modify<T, R> = Omit<T, keyof R> & R;

export interface BlockchainState {
  confirmations: Modify<Partial<ConfirmationsItem>, {
    txHash?: string
    isConnected?: boolean
  }>
}

export interface BlockchainStoreProps {
  state: BlockchainState
  dispatch: Dispatch<BlockchainAction>
}

export const initialState: BlockchainState = {
  confirmations: {},
}

const BlockchainStore = createContext({} as BlockchainStoreProps | any)

export const BlockchainStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blockchainReducer, initialState)
  const { state: { apis } }: AppStoreProps = useContext(AppStore)
  const { state: { account } } = useContext(Web3Store)
  const confirmationsAPI = apis.get('confirmations') as ConfirmationAPI
  const {
    confirmations: {
      txHash, currentCt: storedCurrentCt, targetCt: storedTargetCt, isConnected,
    },
  } = state

  useEffect(() => {
    if (storedCurrentCt && storedTargetCt) {
      if (storedCurrentCt >= storedTargetCt) {
        dispatch({
          type: BLOCKCHAIN_ACTIONS.SET_TX_HASH,
          payload: {
            txHash: undefined,
          } as any,
        })
      }
    }
  }, [storedCurrentCt, storedTargetCt])

  useEffect(() => {
    if (isConnected && txHash) {
      confirmationsAPI.attachEvent('newConfirmation', (result) => {
        const confs = mapFromTransport([result])
        const currentTx = confs[txHash as string]

        if (currentTx) {
          dispatch({
            type: BLOCKCHAIN_ACTIONS.SET_CONFIRMATIONS,
            payload: currentTx as any,
          })
        }
      })
    }
  }, [isConnected, txHash, confirmationsAPI])

  useEffect(() => {
    if (account) {
      if (confirmationsAPI) {
        const connected = !!confirmationsAPI.connect(client)

        if (connected) {
          dispatch({
            type: BLOCKCHAIN_ACTIONS.CONNECT_CONFIRMATIONS,
            payload: { isConnected: connected } as any,
          })
        }
      }
    }
  }, [account, confirmationsAPI])

  const value = { state, dispatch }
  return <BlockchainStore.Provider value={value}>{children}</BlockchainStore.Provider>
}

export default BlockchainStore
