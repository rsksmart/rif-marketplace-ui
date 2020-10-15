import { Big } from 'big.js'
import { initialState } from '../OfferEditContext'
import { StorageBillingPlan } from '../interfaces'
import { offerEditActions } from '../offerEditReducer'
import {
  AddItemPayload, SetCountryPayload, SetAvailableSizePayload,
} from '../offerEditActions'

const mockedPlanItem: StorageBillingPlan = {
  currency: 'RBTC',
  internalId: 1,
  price: new Big(0.001),
  period: 'Daily',
}

describe('StorageOfferEditContext', () => {
  describe('initial state', () => {
    test('should have empty plan items', () => {
      expect(initialState.billingPlans).toEqual([])
    })
  })
  describe('offerEditActions', () => {
    describe('ADD_ITEM', () => {
      test('should add a planItem to the state', () => {
        const payload: AddItemPayload = mockedPlanItem
        const { billingPlans } = offerEditActions.ADD_ITEM(initialState, payload)
        expect(billingPlans).toEqual([mockedPlanItem])
      })
      test('should increment the internalCounter', () => {
        const payload: AddItemPayload = mockedPlanItem
        const { internalCounter } = offerEditActions.ADD_ITEM(initialState, payload)
        const expectedInternalCounter = initialState.internalCounter + 1
        expect(internalCounter).toEqual(expectedInternalCounter)
      })
    })
    describe('REMOVE_ITEM', () => {
      test.todo('add and remove an item')
    })
    describe('EDIT_ITEM', () => {
      test.todo('add and edit an existing item')
    })
    describe('SET_COUNTRY', () => {
      const expectedCountry = 'UY'
      const payload: SetCountryPayload = {
        country: expectedCountry,
      }
      const { country } = offerEditActions.SET_COUNTRY(initialState, payload)
      expect(country).toBe(expectedCountry)
    })
    describe('SET_AVAILABLE_SIZE', () => {
      const expectedSize = 10
      const payload: SetAvailableSizePayload = {
        availableSize: expectedSize,
      }
      const { availableSize } = offerEditActions.SET_AVAILABLE_SIZE(initialState, payload)
      expect(availableSize).toBe(expectedSize)
    })
  })
})
