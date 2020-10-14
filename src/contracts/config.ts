import networkConfig from 'config'

const {
  contractAddresses: {
    marketplace, rif, rnsDotRskOwner, storageManager, storageStaking,
  },
} = networkConfig

export const marketPlaceAddress = marketplace.toLowerCase()
export const rifTokenAddress = rif.toLowerCase()
export const rnsAddress = rnsDotRskOwner.toLowerCase()
export const storageAddress = storageManager.toLowerCase()
export const stakingAddress = storageStaking.toLowerCase()
