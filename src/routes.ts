const LISTING = 'listing'
const CHECKOUT = 'checkout'
const EDIT = 'edit'

const LANDING = '/'

const RNS = '/domains'
const RNS_BUY = `${RNS}/buy`
const RNS_SELL = `${RNS}/sell`
const RNS_CANCEL = `${RNS_SELL}/cancel`

const STORAGE = '/storage'
const STORAGE_BUY = `${STORAGE}/buy`
const STORAGE_SELL = `${STORAGE}/sell`
const STORAGE_MYOFFERS = `${STORAGE}/myoffers`
const STORAGE_MYOFFERS_CANCEL = `${STORAGE_MYOFFERS}/cancel`
const STORAGE_MYPURCHASES = `${STORAGE}/mypurchases`
const STORAGE_RENEW_AGREEMENT = `${STORAGE_MYPURCHASES}/renew`

const NOTIFIER = '/notifications'
const NOTIFIER_BUY = `${NOTIFIER}/buy`
const NOTIFIER_SELL = `${NOTIFIER}/sell`

const FAQ = '/faq'
const ABOUT = '/about'

const ROUTES = {
  LANDING,
  RNS: {
    BASE: RNS,
    BUY: {
      BASE: RNS_BUY,
      LISTING: `${RNS_BUY}/${LISTING}`,
      CHECKOUT: `${RNS_BUY}/${CHECKOUT}`,
    },
    SELL: {
      BASE: RNS_SELL,
      LISTING: `${RNS_SELL}/${LISTING}`,
      CHECKOUT: `${RNS_SELL}/${CHECKOUT}`,
      CANCEL: {
        CHECKOUT: `${RNS_CANCEL}/${CHECKOUT}`,
      },
    },
  },
  STORAGE: {
    BASE: STORAGE,
    BUY: {
      BASE: STORAGE_BUY,
      LISTING: `${STORAGE_BUY}/${LISTING}`,
      CHECKOUT: `${STORAGE_BUY}/${CHECKOUT}`,
    },
    SELL: {
      BASE: STORAGE_SELL,
    },
    MYOFFERS: {
      BASE: STORAGE_MYOFFERS,
      CANCEL: STORAGE_MYOFFERS_CANCEL,
      EDIT: `${STORAGE_MYOFFERS}/${EDIT}`,
    },
    MYPURCHASES: {
      BASE: STORAGE_MYPURCHASES,
      LISTING: `${STORAGE_MYPURCHASES}/${LISTING}`,
      RENEW: `${STORAGE_RENEW_AGREEMENT}/${CHECKOUT}`,
    },
  },
  NOTIFIER: {
    BASE: NOTIFIER,
    BUY: {
      BASE: NOTIFIER_BUY,
    },
    SELL: {
      BASE: NOTIFIER_SELL,
    },
  },
  FAQ,
  ABOUT,
}

export default ROUTES
