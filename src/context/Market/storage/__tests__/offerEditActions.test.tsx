import { Big } from 'big.js'
import { SYSTEM_TOKENS } from 'models/Token'
import { SetCountryPayload, SetTotalCapacityPayload, StorageBillingPlan } from '../interfaces'
import { initialState } from '../Context'
import { offerEditActions } from '..'

const mockedPlanItem: StorageBillingPlan = {
  currency: SYSTEM_TOKENS.rbtc,
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
        const payload: StorageBillingPlan = mockedPlanItem
        const { billingPlans } = offerEditActions.ADD_ITEM(initialState, payload)
        expect(billingPlans).toEqual([mockedPlanItem])
      })
      test('should increment the internalCounter', () => {
        const payload: StorageBillingPlan = mockedPlanItem
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
    describe('SET_TOTAL_CAPACITY', () => {
      const expectedSize = new Big(10)
      const payload: SetTotalCapacityPayload = {
        totalCapacity: expectedSize,
      }
      const { totalCapacity } = offerEditActions.SET_TOTAL_CAPACITY(initialState, payload)
      expect(totalCapacity).toBe(expectedSize)
    })
  })
})
