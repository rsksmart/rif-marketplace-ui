import React, {
  createContext, FC,
  useCallback,
  useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import Web3 from 'web3'
import { Big } from 'big.js'
import { Web3Store } from '@rsksmart/rif-ui'
import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import { TokenAddressees } from 'context/Services/storage/interfaces'
import StorageOffersContext from 'context/Services/storage/OffersContext'
import { BillingPlan, PeriodInSeconds, StorageOffer } from 'models/marketItems/StorageItem'
import { UIError } from 'models/UIMessage'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { convertToWeiString } from 'utils/parsers'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import {
  PinnedContent, Props, State, AsyncActions,
} from './interfaces'
import { reducer } from './actions'

export const initialState: State = {
  order: {
    id: '',
    system: '',
    location: '',
    total: new Big(0),
    billingPeriod: PeriodInSeconds.Daily,
    token: 'rbtc',
  },
  auxiliary: {
    currencyOptions: [],
    currentRate: 0,
    endDate: '',
    periodsCount: 1,
    planOptions: [],
    selectedCurrency: 0,
    selectedPlan: 0,
    totalFiat: '',
  },
  status: {},
}

const initialAsyncActions: AsyncActions = {
  createAgreement: (): Promise<void> => Promise.resolve(),
}

export const Context = createContext<Props>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
  asyncActions: initialAsyncActions,
})

const Provider: FC = ({ children }) => {
  const history = useHistory()

  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const reportError = useCallback(
    (e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch],
  )

  const {
    state: {
      exchangeRates: {
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)

  const {
    state: {
      order: listedOffer,
    },
  } = useContext(StorageOffersContext)
  const listedItem: StorageOffer | undefined = listedOffer?.item

  const [isInitialised, setIsInitialised] = useState(false)
  const [asyncActions, setAsyncActions] = useState(initialAsyncActions)

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    auxiliary: {
      selectedCurrency,
      currencyOptions,
      selectedPlan,
      planOptions,
      periodsCount,
      currentRate,
    },
    pinned,
    order,
  } = state

  // Initialise context
  useEffect(() => {
    if (!isInitialised && listedItem) {
      const {
        subscriptionOptions,
        id,
        system,
        location,
      } = listedItem
      const currencies: SupportedTokens[] = Array.from(
        new Set(subscriptionOptions.map(
          (option: BillingPlan) => option.currency,
        )),
      )

      setIsInitialised(true)
      dispatch({
        type: 'INITIALISE',
        payload: {
          currencyOptions: currencies,
          id,
          system,
          location,
        },
      })
    }
  }, [listedItem, isInitialised])

  // Prepare async actions
  useEffect(() => {
    if (web3 && account && pinned) {
      const createAgreement = async (): Promise<void> => {
        const {
          id: provider,
          billingPeriod,
          token,
          total,
        } = order
        const {
          size,
          hash: fileHash,
        } = pinned as PinnedContent
        const agreement = {
          amount: convertToWeiString(total),
          billingPeriod,
          fileHash,
          provider,
          size,
          token: TokenAddressees[token],
        }
        const storageContract = (await import('contracts/storage/contract')).default.getInstance(web3 as Web3)
        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: true,
            id: 'contract',
            message: 'Creating the agreement...',
          },
        })
        dispatch({
          type: 'SET_STATUS',
          payload: { inProgress: true },
        })
        const receipt = await storageContract
          .newAgreement(agreement, { from: account })
          .catch((error) => {
            reportError(new UIError({
              error,
              id: 'contract-storage',
              text: 'Could not create new agreement.',
            }))
            Logger.getInstance().error('Error while creating new agreement:', error)
          })

        appDispatch({
          type: 'SET_IS_LOADING',
          payload: {
            isLoading: false,
            id: 'contract',
          },
        })

        if (receipt) {
          dispatch({
            type: 'SET_STATUS',
            payload: {
              isDone: true,
            },
          })
          Logger.getInstance().debug('Agreement receipt:', receipt)
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
            text: 'Could not create new agreement.',
          }))
        }
      }
      setAsyncActions({ createAgreement })
    }
  }, [web3, account, appDispatch, history, order, pinned, reportError])

  // Sets plans and currency related states
  useEffect(() => {
    if (
      isInitialised
      && currencyOptions.length
      && selectedCurrency >= 0
      && listedItem
      && pinned
    ) {
      const { subscriptionOptions } = listedItem
      const newToken = currencyOptions[selectedCurrency]
      const newRate = crypto[newToken]?.rate

      const newPlans = subscriptionOptions
        .filter((plan: BillingPlan) => plan.currency === newToken)
        .map((plan: BillingPlan) => {
          const pricePerSize = (plan.price
            .div(UNIT_PREFIX_POW2.MEGA)
            .mul(pinned.size))
            .mul(pinned.unit)

          return {
            ...plan,
            price: pricePerSize,
          }
        })

      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          planOptions: newPlans,
          currentRate: newRate,
        },
      })
      dispatch({
        type: 'SET_ORDER',
        payload: {
          token: newToken,
        },
      })
    }
  }, [
    isInitialised, currencyOptions, selectedCurrency,
    crypto, listedItem, pinned,
  ])

  // Recalculates total amounts and subscription end date
  useEffect(() => {
    const currentPlan = planOptions[selectedPlan]

    if (isInitialised && currentPlan) {
      const { price, period }: BillingPlan = currentPlan
      const currentTotal = price.mul(periodsCount)
      const currentTotalFiat = currentTotal.mul(currentRate)
      const currentBillingPeriod = PeriodInSeconds[period]
      const currentPeriodsInSec = currentBillingPeriod
      * periodsCount
      const dateNow = new Date(Date.now())
      const currentEndDate = new Date(
        dateNow.setSeconds(dateNow.getSeconds() + currentPeriodsInSec),
      ).toLocaleDateString()

      dispatch({
        type: 'SET_ORDER',
        payload: {
          total: currentTotal,
          billingPeriod: currentBillingPeriod,
        },
      })
      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          totalFiat: currentTotalFiat.toString(),
          endDate: currentEndDate,
        },
      })
    }
  }, [
    isInitialised,
    selectedPlan,
    periodsCount,
    listedItem,
    planOptions,
    currentRate,
  ])

  const value = useMemo(() => ({
    state,
    dispatch,
    asyncActions,
  }), [state, asyncActions])

  if (!listedItem) {
    history.replace(ROUTES.STORAGE.BUY.BASE)
    return null
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

function withCheckoutContext<T>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  return (props: T): React.ReactElement => (
    <Provider>
      <Component {...props} />
    </Provider>
  )
}

export default withCheckoutContext
