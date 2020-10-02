import React, {
  createContext, Dispatch, FC,
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

type AuxiliaryState = {
  currencyOptions: SupportedTokens[]
  currentRate: number
  endDate: string
  periodsCount: number
  planOptions: BillingPlan[]
  selectedCurrency: number
  selectedPlan: number
  totalFiat: string
}

export type Order = Pick<StorageOffer, 'id' | 'system' | 'location'> & {
  billingPeriod: PeriodInSeconds
  token: SupportedTokens
  total: Big
}

export type PinnedContent = {
  name: string
  size: string
  unit: UNIT_PREFIX_POW2
  hash: string
}

type Status = {
  inProgress?: boolean
  isDone?: boolean
}

type State = {
  order: Order
  auxiliary: AuxiliaryState
  pinned?: PinnedContent
  status: Status
}

type InitialisePayload = Pick<AuxiliaryState, 'currencyOptions'> & Pick<Order, 'id' | 'system' | 'location'>
type StatusPayload = (
  | {
    inProgress: true
    isDone?: never
  } | {
    inProgress?: never
    isDone: true
  }
)

export type PurchaseStorageAction = (
  | {
    type: 'CHANGE_CURRENCY'
    payload: { index: number }
  }
  | {
    type: 'SET_AUXILIARY'
    payload: Partial<AuxiliaryState>
  }
  | {
    type: 'SET_ORDER'
    payload: Partial<Order>
  }
  | {
    type: 'SET_PINNED'
    payload: Partial<PinnedContent>
  }
  | {
    type: 'INITIALISE'
    payload: InitialisePayload
  }
  | {
    type: 'SET_STATUS'
    payload: StatusPayload
  }
)

interface Actions {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ) => State
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>) => State
  SET_ORDER: (state: State, payload: Partial<Order>) => State
  SET_PINNED: (state: State, payload: PinnedContent) => State
  INITIALISE: (state: State, payload: InitialisePayload) => State
  SET_STATUS: (state: State, payload: StatusPayload) => State
}

const actions: Actions = {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      selectedCurrency,
      selectedPlan: 0,
      periodsCount: 0,
    },
  }),
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      ...payload,
    },
  }),
  SET_ORDER: (state: State, payload: Partial<Order>): State => ({
    ...state,
    order: {
      ...state.order,
      ...payload,
    },
  }),
  SET_PINNED: (state: State, payload: PinnedContent): State => ({
    ...state,
    pinned: {
      ...state.pinned,
      ...payload,
    },
  }),
  INITIALISE: (state: State, {
    currencyOptions, id, location, system,
  }: InitialisePayload): State => ({
    ...state,
    auxiliary: {
      ...state.auxiliary,
      currencyOptions,
    },
    order: {
      ...state.order,
      ...{ id, location, system },
    },
  }),
  SET_STATUS: (
    state: State,
    payload: StatusPayload,
  ): State => ({
    ...state,
    status: payload,
  }),
}

type AsyncAction = {
  (args?: unknown): Promise<unknown>
}

type StorageAsyncActions = {
  createAgreement: AsyncAction
}

export type Props = {
    state: State
    dispatch: Dispatch<PurchaseStorageAction>
    asyncActions: StorageAsyncActions
}

const isObject = (item: object | unknown): boolean => typeof item === 'object'
const isUndefined = (item: undefined | unknown): boolean => typeof item === 'undefined'

const recDiff = (obj1: object, obj2: object): unknown[] => {
  const keys = Object.keys(obj1)
  return keys.filter((key) => {
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (isUndefined(value1) || isUndefined(value2)) return false

    if (isObject(value1) && isObject(value2)) {
      return recDiff(value1, value2).length
    }
    return value1 !== value2
  })
}

const reducer = (state: State, action: PurchaseStorageAction): State => {
  const { type, payload } = action
  const actionFunction = actions[type]

  if (actionFunction) {
    const newState: State = actionFunction(state, payload as never)

    if (state === newState) {
      Logger.getInstance().debug('Checkout Context Action', type, 'no change in state:', state)
    } else {
      Logger.getInstance().debug('Checkout Context Action', type, 'old state:', state)
      Logger.getInstance().debug('Checkout Context Action', type, 'new state:', newState)
      const diff = recDiff(newState, state)
      Logger.getInstance().debug('Checkout Context Action', type, 'state diff:', diff)
    }
    return newState
  }

  Logger.getInstance().warn('Storage Checkout Context:', type, 'action is not defined!')
  return state
}

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

const initialAsyncActions: StorageAsyncActions = {
  createAgreement: (): Promise<void> => Promise.resolve(),
}

const Context = createContext<Props>({
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
        const storageContract = (await import('contracts/Storage')).default.getInstance(web3 as Web3)
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
        dispatch({
          type: 'SET_STATUS',
          payload: {
            isDone: true,
          },
        })

        if (receipt) {
          Logger.getInstance().debug('Agreement receipt:', receipt)
        } else {
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
export const CheckoutContext = Context
