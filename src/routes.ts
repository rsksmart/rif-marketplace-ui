const LANDING = '/'
const COMMUNICATIONS = '/communications'
const DATA_SERVICE = 'data_service'
const PAYMENTS = '/payments'
const DOMAINS = '/domains'
const DOMAINS_BUY = `${DOMAINS}/buy`
const DOMAINS_SELL = `${DOMAINS}/sell`
const DOMAINS_SOLD = `${DOMAINS}/sold`
const DOMAIN_OFFERS_CHECKOUT = `${DOMAINS_BUY}/checkout`
const DOMAINS_CHECKOUT = `${DOMAINS_SELL}/checkout`
const DOMAIN_OFFERS_DONE = `${DOMAINS_BUY}/done`
const DOMAINS_DONE = `${DOMAINS_SELL}/done`
const STORAGE = '/storage'
const FAQ = '/faq'
const ABOUT = '/about'

export const ROUTES = {
  LANDING,
  COMMUNICATIONS,
  DATA_SERVICE,
  PAYMENTS,
  STORAGE,
  DOMAINS: {
    BASE: DOMAINS,
    BUY: DOMAINS_BUY,
    SELL: DOMAINS_SELL,
    SOLD: DOMAINS_SOLD,
    CHECKOUT: {
      BUY: DOMAIN_OFFERS_CHECKOUT,
      SELL: DOMAINS_CHECKOUT,
    },
    DONE: {
      BUY: DOMAIN_OFFERS_DONE,
      SELL: DOMAINS_DONE
    }
  },
  FAQ,
  ABOUT
}