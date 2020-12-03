import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import StorageFiltersTransport from '../StorageFiltersTransport'

const FAKE_FILTERS: StorageOffersFilters = {
  active: true,
  periods: new Set(['Daily' as SubscriptionPeriod]),
  provider: 'FakeProvider',
  size: { min: 5, max: 10 },
  price: { min: 5, max: 10 },
}

const EXPECTED_OBJECT: StorageFiltersTransport = {
  active: FAKE_FILTERS.active,
  periods: Array.from(FAKE_FILTERS.periods as Set<SubscriptionPeriod>)
    .map((p) => PeriodInSeconds[p]),
  averagePrice: {
    min: (FAKE_FILTERS.price?.min as number) - 1,
    max: (FAKE_FILTERS.price?.max as number) + 1,
  },
  totalCapacity: {
    min: (FAKE_FILTERS.size?.min as number) * UNIT_PREFIX_POW2.KILO,
    max: (FAKE_FILTERS.size?.max as number) * UNIT_PREFIX_POW2.KILO,
  },
  provider: FAKE_FILTERS.provider
    ? { $like: FAKE_FILTERS.provider } : undefined,
}

const testProperty = <TObject, K extends keyof TObject>(
  testObject: TObject,
  key: K,
  expectedValue: TObject[K],
): void => {
  test(`should contain correct property: ${key}`, () => {
    expect(testObject[key]).toEqual(expectedValue)
  })
}

describe('StorageFiltersTransport', () => {
  let storageFiltersTransport: StorageFiltersTransport

  describe('constructor', () => {
    beforeEach(() => {
      storageFiltersTransport = new StorageFiltersTransport(FAKE_FILTERS)
    })
    test('should accept StorageOffersFilters as args', () => {
      expect(storageFiltersTransport).not.toBeUndefined()
    })

    test('should contain correct property: active', () => {
      const expectedPropertyValue = FAKE_FILTERS.active

      expect(storageFiltersTransport.active).toBe(expectedPropertyValue)
    })

    storageFiltersTransport = new StorageFiltersTransport(FAKE_FILTERS)
    Object.keys(EXPECTED_OBJECT).forEach((key) => testProperty(
      storageFiltersTransport,
      key as keyof StorageFiltersTransport,
      EXPECTED_OBJECT[key],
    ))
  })
})
