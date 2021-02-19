import networkConfig from 'config'
import { ZERO_ADDRESS } from 'constants/strings'
import { SupportedTokenSymbol } from 'models/Token'

const {
  contractAddresses,
  services,
} = networkConfig
contractAddresses.rbtc = ZERO_ADDRESS // Adds zero address for native payments

const {
  marketplace,
  rnsDotRskOwner,
  storageManager,
  storageStaking,
  notificationsManager,
  ...tokenAddresses
} = contractAddresses

const marketPlaceAddress = marketplace.toLowerCase()
const rnsAddress = rnsDotRskOwner.toLowerCase()
const storageAddress = storageManager.toLowerCase()
const storageStakingAddress = storageStaking.toLowerCase()
const notifierAddress = notificationsManager.toLowerCase()

const rnsSupportedTokens: SupportedTokenSymbol[] = services.rns?.tokens || []
const storageSupportedTokens: SupportedTokenSymbol[] = services.storage?.tokens || []
const notifierSupportedTokens: SupportedTokenSymbol[] = services.notifier?.tokens || []

const svcNames = Object.keys(services)
const allAllowedPaymentTokens: string[] = Array.from(
  new Set(svcNames.reduce((acc, name) => acc.concat(services[name].tokens), [])),
)

const allTokenAddresses: string[] = Object.keys(tokenAddresses)
  .filter((scName) => allAllowedPaymentTokens.includes(scName))
  .map((scName) => tokenAddresses[scName].toLowerCase())

const addressTokenRecord: Record<string, string> = allAllowedPaymentTokens
  .reduce((acc, symbol) => {
    const tokenAddress = tokenAddresses[symbol].toLowerCase()
    acc[tokenAddress] = symbol
    return acc
  }, {})

const rifTokenAddress = tokenAddresses.rif.toLowerCase()

export {
  marketPlaceAddress,
  rnsAddress,
  storageAddress,
  storageStakingAddress,
  allAllowedPaymentTokens,
  allTokenAddresses,
  addressTokenRecord,
  rnsSupportedTokens,
  storageSupportedTokens,
  rifTokenAddress,
  notifierAddress,
  notifierSupportedTokens,
}
