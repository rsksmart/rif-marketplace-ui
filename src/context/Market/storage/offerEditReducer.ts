import { StoragePlanItem, OfferEditState } from './interfaces'
import {
  AddItemPayload,
  RemoveItemPayload,
  EditItemPayload,
  SetAvailableSizePayload,
  SetCountryPayload,
  SetPeerIdPayload,
  OfferEditActions,
  OfferEditPayload,
  SetOfferPayload,
} from './offerEditActions'
import { initialState } from './OfferEditContext'

export interface OfferEditReducer<P extends OfferEditPayload> {
  (state: OfferEditState, payload: P): OfferEditState
}

const calculateUsedPeriodsPerCurrency = (
  planItems: StoragePlanItem[],
): Record<string, []> => planItems.reduce((acc, item) => {
  acc[item.currency] = [...(acc[item.currency] || []), item.timePeriod]
  return acc
}, {})

export const offerEditActions: OfferEditActions = {
  ADD_ITEM: (state: OfferEditState, payload: AddItemPayload) => {
    const { internalCounter, planItems } = state
    const newPlan = {
      ...payload,
      internalId: internalCounter,
    }
    const newPlanItems = [...planItems, newPlan]

    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
      internalCounter: internalCounter + 1,
    }
  },
  CLEAN_UP: (_, __) => initialState,
  REMOVE_ITEM: (state: OfferEditState, { internalId }: RemoveItemPayload) => {
    const { planItems } = state
    const newPlanItems = planItems.filter((x) => x.internalId !== internalId)
    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
    }
  },
  EDIT_ITEM: (state: OfferEditState, payload: EditItemPayload) => {
    const {
      internalId, timePeriod, pricePerGb, currency,
    } = payload
    const { planItems } = state
    const newPlanItems = planItems.map((planItem) => {
      if (planItem.internalId === internalId) {
        return {
          ...planItem,
          timePeriod,
          pricePerGb,
          currency,
        }
      }
      return planItem
    })
    return {
      ...state,
      planItems: newPlanItems,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
    }
  },
  SET_AVAILABLE_SIZE: (
    state: OfferEditState,
    { availableSize }: SetAvailableSizePayload,
  ) => ({
    ...state,
    availableSize,
  }),
  SET_COUNTRY: (state: OfferEditState, { country }: SetCountryPayload) => ({
    ...state,
    country,
  }),
  SET_PEER_ID: (state: OfferEditState, { peerId }: SetPeerIdPayload) => ({
    ...state,
    peerId,
  }),
  SET_OFFER: (
    state: OfferEditState,
    {
      availableSize,
      country,
      peerId,
      planItems,
      system,
      offerId,
    }: SetOfferPayload,
  ) => {
    // every plan item needs a unique id to handle the edition
    const newPlanItems: StoragePlanItem[] = planItems.map(
      (plan: StoragePlanItem, index: number) => ({
        ...plan,
        internalId: index + 1,
      }),
    )
    return {
      ...state,
      availableSize,
      country,
      peerId,
      planItems: newPlanItems,
      system,
      usedPeriodsPerCurrency: calculateUsedPeriodsPerCurrency(newPlanItems),
      internalCounter: newPlanItems.length + 1,
      offerId,
    }
  },
}
