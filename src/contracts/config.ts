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
  ...tokenAddresses
} = contractAddresses

const marketPlaceAddress = marketplace.toLowerCase()
const rnsAddress = rnsDotRskOwner.toLowerCase()
const storageAddress = storageManager.toLowerCase()
const stakingAddress = storageStaking.toLowerCase()

const rnsSupportedTokens: SupportedTokenSymbol[] = services.rns.tokens
const storageSupportedTokens: SupportedTokenSymbol[] = services.storage.tokens

const svcNames = Object.keys(services)
const allAllowedPaymentTokens: string[] = Array.from(
  new Set(svcNames.flatMap((s) => services[s].tokens)),
)

const allNftAddresses: string[] = Object.keys(tokenAddresses)
  .filter((scName) => allAllowedPaymentTokens.includes(scName))
  .map((scName) => tokenAddresses[scName].toLowerCase())

const addressTokenRecord: Record<string, string> = allAllowedPaymentTokens
  .reduce((acc, symbol) => {
    const tokenAddress = tokenAddresses[symbol].toLowerCase()
    acc[tokenAddress] = symbol
    return acc
  }, {})

const rifTokenAddress = tokenAddresses.rif

export {
  marketPlaceAddress,
  rnsAddress,
  storageAddress,
  stakingAddress,
  allAllowedPaymentTokens,
  allNftAddresses,
  addressTokenRecord,
  rnsSupportedTokens,
  storageSupportedTokens,
  rifTokenAddress,
}
