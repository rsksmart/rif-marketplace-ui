import networkConfig from 'config'

const {
  contractAddresses: {
    marketplace, rif, rnsDotRskOwner, storageManager, storageStaking,
  },
  services,
} = networkConfig

export const marketPlaceAddress = marketplace.toLowerCase()
export const rifTokenAddress = rif.toLowerCase()
export const rnsAddress = rnsDotRskOwner.toLowerCase()
export const storageAddress = storageManager.toLowerCase()
export const stakingAddress = storageStaking.toLowerCase()
export const rnsSupportedTokens = services.rns.tokens
export const storageSupportedTokens = services.storage.tokens
