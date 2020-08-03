const LANDING = '/'
const COMMUNICATIONS = '/communications'
const DATA_SERVICE = 'data_service'
const PAYMENTS = '/payments'
const DOMAINS = '/domains'
const DOMAINS_BUY = `${DOMAINS}/buy`
const DOMAINS_SELL = `${DOMAINS}/sell`
const DOMAIN_OFFERS_CHECKOUT = `${DOMAINS_BUY}/checkout`
const DOMAINS_CHECKOUT = `${DOMAINS_SELL}/checkout`
const DOMAIN_OFFERS_DONE = `${DOMAINS_BUY}/done`
const DOMAINS_DONE = `${DOMAINS_SELL}/done`
const DOMAIN_CANCEL_CHECKOUT = `${DOMAINS}/cancel/checkout`
const DOMAIN_CANCEL_DONE = `${DOMAINS}/cancel/done`
const STORAGE = '/storage'
const STORAGE_BUY = `${STORAGE}/buy`
const STORAGE_SELL = `${STORAGE}/sell`
const STORAGE_SELL_DONE = `${STORAGE_SELL}/done`
const FAQ = '/faq'
const ABOUT = '/about'

const ROUTES = {
  LANDING,
  COMMUNICATIONS,
  DATA_SERVICE,
  PAYMENTS,
  DOMAINS: {
    BASE: DOMAINS,
    BUY: DOMAINS_BUY,
    SELL: DOMAINS_SELL,
    CHECKOUT: {
      BUY: DOMAIN_OFFERS_CHECKOUT,
      SELL: DOMAINS_CHECKOUT,
      CANCEL: DOMAIN_CANCEL_CHECKOUT,
    },
    DONE: {
      BUY: DOMAIN_OFFERS_DONE,
      SELL: DOMAINS_DONE,
      CANCEL: DOMAIN_CANCEL_DONE,
    },
  },
  STORAGE: {
    BASE: STORAGE,
    BUY: STORAGE_BUY,
    SELL: STORAGE_SELL,
    DONE: {
      SELL: STORAGE_SELL_DONE,
    },
  },
  FAQ,
  ABOUT,
}

export default ROUTES
