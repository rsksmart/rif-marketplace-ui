const LISTING = 'listing'
const CHECKOUT = 'checkout'
const DONE = 'done'

const LANDING = '/'

const RNS = '/domains'
const RNS_BUY = `${RNS}/buy`
const RNS_SELL = `${RNS}/sell`
const RNS_CANCEL = `${RNS_SELL}/cancel`

const STORAGE = '/storage'
const STORAGE_BUY = `${STORAGE}/buy`
const STORAGE_SELL = `${STORAGE}/sell`
const STORAGE_MYOFFERS = `${STORAGE}/myoffers`
const STORAGE_MYPURCHASES = `${STORAGE}/mypurchases`
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
      DONE: `${RNS_BUY}/${DONE}`,
    },
    SELL: {
      BASE: RNS_SELL,
      LISTING: `${RNS_SELL}/${LISTING}`,
      CHECKOUT: `${RNS_SELL}/${CHECKOUT}`,
      DONE: `${RNS_SELL}/${DONE}`,
      CANCEL: {
        CHECKOUT: `${RNS_CANCEL}/${CHECKOUT}`,
        DONE: `${RNS_CANCEL}/${DONE}`,
      },
    },
  },
  STORAGE: {
    BASE: STORAGE,
    BUY: {
      BASE: STORAGE_BUY,
      LISTING: `${STORAGE_BUY}/${LISTING}`,
      CHECKOUT: `${STORAGE_BUY}/${CHECKOUT}`,
      DONE: `${STORAGE_BUY}/${DONE}`,
    },
    SELL: {
      BASE: STORAGE_SELL,
      LISTING: `${STORAGE_SELL}/${LISTING}`,
      DONE: `${STORAGE_SELL}/${DONE}`,
    },
    MYOFFERS: {
      BASE: STORAGE_MYOFFERS,
    },
    MYPURCHASES: {
      BASE: STORAGE_MYPURCHASES,
    },
  },
  FAQ,
  ABOUT,
}

export default ROUTES
