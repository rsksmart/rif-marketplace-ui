import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import Big from 'big.js'
import { Agreement } from 'models/marketItems/StorageItem'
import { AgreementFilters } from 'api/rif-marketplace-cache/storage/interfaces'
import {
  AgreementsContextState,
  agreementsInitialState,
} from '..'
import actions from '../actions'

const MOCK_AGREEMENT: Agreement[] = [
  {
    id: 'MOCK_AGREEMENT',
    consumer: 'MOCK_CONSUMER',
    dataReference: 'MOCK_REFERENCE',
    expiresInSeconds: 1,
    isActive: true,
    monthlyFee: new Big(1),
    paymentToken: SUPPORTED_TOKEN_RECORDS.rbtc,
    provider: 'MOCK_PROVIDER',
    size: new Big(1),
    subscriptionPeriod: 'Daily',
    subscriptionPrice: new Big(1),
    title: 'MOCK_TITLE',
    toBePayedOut: new Big(1),
    withdrawableFunds: new Big(1),
  },
]

describe('Storage Agreements Context actions', () => {
  const {
    SET_LISTING,
    SET_ORDER,
    SET_FILTERS,
  } = actions
  describe('SET_LISTING', () => {
    test('should return state with correct agreemnents property', () => {
      const {
        agreements,
      }: Partial<AgreementsContextState> = SET_LISTING(
        agreementsInitialState, MOCK_AGREEMENT,
      )

      expect(agreements).toEqual(MOCK_AGREEMENT)
    })
  })
  describe('SET_ORDER', () => {
    test('should return state with correct order property', () => {
      const {
        order,
      }: Partial<AgreementsContextState> = SET_ORDER(
        agreementsInitialState, MOCK_AGREEMENT[0],
      )

      expect(order).toEqual(MOCK_AGREEMENT[0])
    })
  })
  describe('SET_FILTERS', () => {
    test('should return state with correct filters property', () => {
      const expectedFilters: AgreementFilters = {
        consumer: 'MOCK_CONSUMER',
      }
      const {
        filters,
      }: Partial<AgreementsContextState> = SET_FILTERS(
        agreementsInitialState, expectedFilters,
      )

      expect(filters).toEqual(expectedFilters)
    })
  })
})
