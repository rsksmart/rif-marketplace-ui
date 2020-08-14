// import offers from '../offers'
import { Big } from 'big.js'
import { OfferTransport } from 'api/models/storage/transports'
import { OffersService } from '../offers'
import mockFeathersService from 'api/test-utils/feathers'
import { StorageOffer, BillingPlan, subscriptionPeriods } from 'models/marketItems/StorageItem'

const FAKE_OFFER_0: OfferTransport = {
    utilizedCapacity: '0',
    availableCapacity: '1073741824',
    provider: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    totalCapacity: '1073741824',
    peerId: null,
    createdAt: "2020-08-10T14:11:32.648Z",
    updatedAt: "2020-08-10T14:11:32.740Z",
    plans: [
        {
            id: 1,
            period: '86400',
            price: '931322574',
            offerId: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
            createdAt: "2020-08-10T14:11:32.680Z",
            updatedAt: "2020-08-10T14:11:32.680Z"
        }
    ]
}

const FAKE_TRANSPORT = [FAKE_OFFER_0]

let offersService: OffersService

describe('Storage OffersService', () => {
    beforeEach(() => {
        offersService = new OffersService()
        offersService.errorReporter = jest.fn()
    })

    describe('_fetch via super.fetch', () => {
        beforeEach(() => {
            offersService.service = mockFeathersService(FAKE_TRANSPORT)
        })

        test('should return StorageOffer[] on success', async () => {
            const actualReturnValue = await offersService.fetch()
            const {
              provider,
              availableCapacity,
              plans
            } = FAKE_OFFER_0
            const expectedOffers: StorageOffer = {
              id: 'I do not know', // FIXME: what is the ID and what is the address and why is it the same as offerID?
              provider,
              location: 'UK',
              system: 'IPFS',
              availableSize: new Big(availableCapacity),
              subscriptionOptions: plans
                .filter(plan => !!subscriptionPeriods[plan.period])
                .map<BillingPlan>(plan => ({
                    period: subscriptionPeriods[plan.period],
                    price: new Big(plan.price),
                    currency: 'RBTC'
                  })),
              pricePGBPDay: plans
                .reduce<Big>((acc, plan) => {
                  const period = new Big(plan.period)
                  const price = new Big(plan.price)
                  acc = acc.add(price.div(period))
                  return acc
                } , new Big(0))
                .div(plans.length)
                .mul(new Big(3600 * 24))
            }

            expect(actualReturnValue).toStrictEqual(expectedOffers)
        })

    })

})
