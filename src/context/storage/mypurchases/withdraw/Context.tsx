import { Web3Store } from '@rsksmart/rif-ui'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import createWithContext from 'context/storeUtils/createWithContext'
import { UIError } from 'models/UIMessage'
import React, {
  createContext,
  FC,
  useCallback, useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import Logger from 'utils/Logger'
import { reducer } from './actions'
import { AsyncActions, Props, State } from './interfaces'

export const initialState: State = {
  status: {},
}

const initialAsyncActions: AsyncActions = {
  withdraw: async (): Promise<void> => await Promise.resolve(),
}

export const Context = createContext<Props>({
  state: initialState,
  dispatch: () => undefined,
  asyncActions: initialAsyncActions,
})

const Provider: FC = ({ children }) => {
  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )

  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)

  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  const [asyncActions, setAsyncActions] = useState(initialAsyncActions)

  const [state, dispatch] = useReducer(reducer, initialState)

  const { agreement } = state

  useEffect(() => {
    if (web3 && account && agreement) {
      const withdraw = async (): Promise<void> => {
        const { id } = agreement
        const storageContract = (await import('contracts/storage'))
          .default
          .StorageContract
          .getInstance(web3)

        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: 'Withdrawing your funds...',
          },
        })
        dispatch({
          type: 'SET_STATUS',
          payload: { inProgress: true },
        })
        const withdrawFundsReceipt = await storageContract
          .withdrawFunds(
            {
              amounts: ['0'], // using 0 withdraws the max amount available
              dataReference: agreement.dataReference,
              provider: agreement.provider,
              tokens: [agreement.paymentToken],
            },
            { from: account },
          ).catch((error) => {
            reportError(new UIError({
              error,
              id: 'contract-storage',
              text: `Could not withdraw funds from agreement ${id}...`,
            }))
            Logger.getInstance().error(`Error while withdrawing funds from agreement ${id}`, { error })
          })

        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'contract',
          },
        })

        if (withdrawFundsReceipt) {
          confirmationsDispatch({
            type: 'NEW_REQUEST',
            payload: {
              contractAction: 'AGREEMENT_WITHDRAW',
              txHash: withdrawFundsReceipt.transactionHash,
              contractActionData: {
                id: id,
              },
            },
          })
          dispatch({
            type: 'SET_STATUS',
            payload: {
              isDone: true,
            },
          })
          Logger.getInstance().debug('Withdraw receipt:', { withdrawFundsReceipt })
        } else {
          dispatch({
            type: 'SET_STATUS',
            payload: {
              inProgress: false,
            },
          })
          reportError(new UIError({
            error: new Error('Did not receive the recipt from the storage contract.'),
            id: 'contract-storage',
            text: 'Could not withdraw funds.',
          }))
        }
      }
      setAsyncActions({ withdraw })
    }
  }, [
    web3, account, appDispatch, reportError, agreement,
    confirmationsDispatch,
  ])

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
