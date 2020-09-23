import { SupportedTokens } from 'api/rif-marketplace-cache/rates/xr'
import MarketContext, { MarketContextProps } from 'context/Market/MarketContext'
import StorageOffersContext from 'context/Services/storage/OffersContext'
import { BillingPlan, PeriodInSeconds, StorageOffer } from 'models/marketItems/StorageItem'
import React, {
  createContext, Dispatch, FC,
  useContext, useEffect, useMemo, useReducer, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'

type AuxiliaryState = {
  planOptions: BillingPlan[]
  currencyOptions: SupportedTokens[]
  currentToken?: SupportedTokens
  currentRate: number
  requiresUpload: boolean
  selectedCurrency: number
  selectedPlan: number
  periodsCount: number
}

export type Order = Pick<StorageOffer, 'id' | 'system' | 'location'> & {
  total: string
  totalFiat: string
  endDate: string
}

export type PinnedContent = {
  name: string
  size: string
  hash: string
}

type State = {
  order: Order
  auxiliary: AuxiliaryState
  pinned: PinnedContent
}

type ActionType = (
  | 'CHANGE_CURRENCY'
  | 'SET_AUXILIARY'
  | 'SET_ORDER'
  | 'SET_PINNED'
  | 'INITIALISE'
)

type InitialisePayload = Pick<AuxiliaryState, 'currencyOptions'> & Pick<Order, 'id' | 'system' | 'location'>

type Action = (
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
)

interface Actions {
  CHANGE_CURRENCY: (
    state: State,
    { index: selectedCurrency }: { index: number },
  ) => State
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>) => State
  SET_ORDER: (state: State, payload: Partial<Order>) => State
  SET_PINNED: (state: State, payload: Partial<PinnedContent>) => State
  INITIALISE: (state: State, payload: InitialisePayload) => State
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
  SET_PINNED: (state: State, payload: Partial<PinnedContent>): State => ({
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
}

export type Props = {
    state: State
    dispatch: Dispatch<Action>
}

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action
  return actions[type](state, payload as never)
}

const initialState: State = {
  order: {
    id: '',
    system: '',
    location: '',
    total: '',
    totalFiat: '',
    endDate: '',
  },
  auxiliary: {
    currencyOptions: [],
    currentRate: 0,
    planOptions: [],
    requiresUpload: false,
    selectedCurrency: 0,
    selectedPlan: 0,
    periodsCount: 0,
  },
  pinned: {
    name: '',
    hash: '',
    size: '',
  },
}

const Context = createContext<Props>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
})

const Provider: FC = ({ children }) => {
  const history = useHistory()

  const {
    state: {
      exchangeRates: {
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  const {
    state: {
      order: listedOffer,
    },
  } = useContext(StorageOffersContext)
  const listedItem: StorageOffer | undefined = listedOffer?.item

  const [isInitialised, setIsInitialised] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    auxiliary: {
      selectedCurrency,
      currencyOptions,
      selectedPlan,
      periodsCount,
      currentRate,
    },
  } = state

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

  // Sets currency related states
  useEffect(() => {
    if (
      isInitialised
      && currencyOptions.length
      && selectedCurrency >= 0
      && listedItem
    ) {
      const { subscriptionOptions } = listedItem
      const newToken = currencyOptions[selectedCurrency]
      const newRate = crypto[newToken]?.rate

      const newPlans = subscriptionOptions
        .filter((plan: BillingPlan) => plan.currency === newToken)

      dispatch({
        type: 'SET_AUXILIARY',
        payload: {
          planOptions: newPlans,
          currentToken: newToken,
          currentRate: newRate,
        },
      })
    }
  }, [isInitialised, currencyOptions, selectedCurrency, crypto, listedItem])

  // Recalculates total amounts and subscription end date
  useEffect(() => {
    const currentPlan: BillingPlan | undefined = listedItem?.subscriptionOptions[selectedPlan]

    if (isInitialised && currentPlan) {
      const currentTotal = currentPlan.price.mul(periodsCount)
      const currentTotalFiat = currentTotal.mul(currentRate)
      const currentPeriodsInSec = PeriodInSeconds[currentPlan.period]
      * periodsCount
      const dateNow = new Date(Date.now())
      const currentEndDate = new Date(
        dateNow.setSeconds(dateNow.getSeconds() + currentPeriodsInSec),
      ).toLocaleDateString()

      dispatch({
        type: 'SET_ORDER',
        payload: {
          total: currentTotal.toString(),
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
    currentRate,
  ])

  const value = useMemo(() => ({ state, dispatch }), [state])

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
