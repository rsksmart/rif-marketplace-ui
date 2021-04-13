const LISTING = 'listing'
const CHECKOUT = 'checkout'
const EDIT = 'edit'
const BUY = 'buy'
const SELL = 'sell'
const CANCEL = 'cancel'
const RENEW = 'renew'
const MY_OFFERS = 'myoffers'
const MY_PURCHASES = 'mypurchases'

const LANDING = '/'

const RNS = '/domains'
const RNS_BUY = `${RNS}/${BUY}`
const RNS_SELL = `${RNS}/${SELL}`
const RNS_CANCEL = `${RNS_SELL}/${CANCEL}`

const STORAGE = '/storage'
const STORAGE_BUY = `${STORAGE}/${BUY}`
const STORAGE_SELL = `${STORAGE}/${SELL}`
const STORAGE_MYOFFERS = `${STORAGE}/${MY_OFFERS}`
const STORAGE_MYOFFERS_CANCEL = `${STORAGE_MYOFFERS}/${CANCEL}`
const STORAGE_MYPURCHASES = `${STORAGE}/${MY_PURCHASES}`
const STORAGE_RENEW_AGREEMENT = `${STORAGE_MYPURCHASES}/${RENEW}`

const NOTIFIER = '/notifier'
const NOTIFIER_BUY = `${NOTIFIER}/${BUY}`
const NOTIFIER_SELL = `${NOTIFIER}/${SELL}`
const NOTIFIER_MYOFFERS = `${NOTIFIER}/${MY_OFFERS}`

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
    MYOFFERS: {
      BASE: NOTIFIER_MYOFFERS,
    },
  },
  FAQ,
  ABOUT,
}

export default ROUTES
