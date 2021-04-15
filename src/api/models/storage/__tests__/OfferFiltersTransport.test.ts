import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { UNIT_PREFIX_POW2 } from 'utils/utils'
import OfferFiltersTransport from '../OfferFiltersTransport'

const FAKE_FILTERS: StorageOffersFilters = {
  withInactive: true,
  periods: new Set(['Daily' as SubscriptionPeriod]),
  provider: 'FakeProvider',
  size: { min: 5, max: 10 },
  price: { min: 5, max: 10 },
}

const EXPECTED_OBJECT: OfferFiltersTransport = {
  withInactive: FAKE_FILTERS.withInactive,
  periods: Array.from(FAKE_FILTERS.periods as Set<SubscriptionPeriod>)
    .map((p) => PeriodInSeconds[p]),
  averagePrice: {
    min: Math.floor(FAKE_FILTERS.price.min),
    max: Math.ceil(FAKE_FILTERS.price.max),
  },
  availableCapacity: {
    min: FAKE_FILTERS.size.min * UNIT_PREFIX_POW2.KILO,
    max: FAKE_FILTERS.size.max * UNIT_PREFIX_POW2.KILO,
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
    expect(testObject[key]).toStrictEqual(expectedValue)
  })
}

describe('OfferFiltersTransport', () => {
  let offerFiltersTransport: OfferFiltersTransport

  describe('constructor', () => {
    beforeEach(() => {
      offerFiltersTransport = new OfferFiltersTransport(FAKE_FILTERS)
    })
    test('should accept StorageOffersFilters as args', () => {
      expect(offerFiltersTransport).not.toBeUndefined()
    })

    test('should contain correct property: active', () => {
      const expectedPropertyValue = FAKE_FILTERS.withInactive

      expect(offerFiltersTransport.withInactive).toBe(expectedPropertyValue)
    })

    offerFiltersTransport = new OfferFiltersTransport(FAKE_FILTERS)
    Object.keys(EXPECTED_OBJECT).forEach((key) => testProperty(
      offerFiltersTransport,
      key as keyof OfferFiltersTransport,
      EXPECTED_OBJECT[key],
    ))
  })
})
