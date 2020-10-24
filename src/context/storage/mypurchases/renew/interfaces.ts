import { Big } from 'big.js'
import { Status } from 'components/templates/ProgressOverlay'
import { MarketFiat } from 'context/Market/MarketContext'
import { BillingPlan, Agreement } from 'models/marketItems/StorageItem'
import { Dispatch } from 'react'

// STATE
export type AuxiliaryState = {
  currentRate: number
  endDate: string
  periodsCount: number
  plan: BillingPlan
  totalFiat: string
  currentFiat: MarketFiat
}

export type Order = Agreement & {
  total: Big
}

export type State = {
  order?: Order
  auxiliary: AuxiliaryState
  status: Status
}

// PAYLOAD
export type InitialisePayload = Agreement & Pick<AuxiliaryState, 'plan'>
export type StatusPayload = (
  | {
    inProgress: boolean
    isDone?: never
  } | {
    inProgress?: never
    isDone: true
  }
)

// ACTIONS
export type Action = (
  | {
    type: 'SET_AUXILIARY'
    payload: Partial<AuxiliaryState>
  }
  | {
    type: 'SET_ORDER'
    payload: Partial<Order>
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

export type Actions = {
  SET_AUXILIARY: (state: State, payload: Partial<AuxiliaryState>) => State
  SET_ORDER: (state: State, payload: Partial<Order>) => State
  INITIALISE: (state: State, payload: InitialisePayload) => State
  SET_STATUS: (state: State, payload: StatusPayload) => State
}

export type AsyncAction = {
  (args?: unknown): Promise<unknown>
}

export type AsyncActions = {
  renewAgreement: AsyncAction
}

// PROPS
export type Props = {
    state: State
    dispatch: Dispatch<Action>
    asyncActions: AsyncActions
}
